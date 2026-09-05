import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { Document, Role } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private async assertCaseAccess(params: {
    caseId: string;
    userId: string;
    role: Role;
  }) {
    if (params.role === Role.ADMIN) return;

    const c = await this.prisma.case.findUnique({
      where: { id: params.caseId },
      select: { id: true, clientId: true, lawyerId: true },
    });
    if (!c) throw new NotFoundException('Case not found');

    if (params.role === Role.CLIENT && c.clientId !== params.userId) {
      throw new ForbiddenException('Not allowed');
    }
    if (params.role === Role.LAWYER && c.lawyerId !== params.userId) {
      throw new ForbiddenException('Not allowed');
    }
  }

  private isCloudinaryConfigured() {
    const name = process.env.CLOUDINARY_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    const vals = [name, key, secret].map((v) => (v || '').trim());
    if (vals.some((v) => !v)) return false;
    if (vals.some((v) => v.toUpperCase() === 'XXXX')) return false;
    return true;
  }

  private async saveToLocal(params: {
    file: Express.Multer.File;
    baseUrl: string;
  }) {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'documents');
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(params.file.originalname || '') || '';
    const safeExt = ext.length <= 10 ? ext : '';
    const filename = `${randomUUID()}${safeExt}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, params.file.buffer);

    const publicUrl = `${params.baseUrl}/uploads/documents/${filename}`;
    return publicUrl;
  }

  private async saveToFirebase(file: Express.Multer.File) {
    const bucket = this.prisma.storageBucket;
    if (!bucket) return null;

    const ext = path.extname(file.originalname || '') || '';
    const safeExt = ext.length <= 10 ? ext : '';
    const filename = `documents/${randomUUID()}${safeExt}`;
    const remoteFile = bucket.file(filename);
    await remoteFile.save(file.buffer, {
      contentType: file.mimetype,
      resumable: false,
    });
    await remoteFile.makePublic();
    return remoteFile.publicUrl();
  }

  async uploadDocument(params: {
    file: Express.Multer.File;
    caseId: string;
    uploadedById: string;
    uploadedByRole: Role;
    name: string;
    baseUrl: string;
  }): Promise<Document> {
    await this.assertCaseAccess({
      caseId: params.caseId,
      userId: params.uploadedById,
      role: params.uploadedByRole,
    });

    try {
      const url =
        (await this.saveToFirebase(params.file)) ||
        (this.isCloudinaryConfigured()
          ? (await this.cloudinary.uploadFile(params.file)).secure_url
          : await this.saveToLocal({
              file: params.file,
              baseUrl: params.baseUrl,
            }));

      return this.prisma.document.create({
        data: {
          name: params.name,
          url,
          type: params.file.mimetype,
          caseId: params.caseId,
          uploadedById: params.uploadedById,
        },
      });
    } catch {
      throw new BadRequestException('Failed to upload document');
    }
  }

  async findAllByCase(params: {
    caseId: string;
    requestingUserId: string;
    requestingUserRole: Role;
  }): Promise<Document[]> {
    await this.assertCaseAccess({
      caseId: params.caseId,
      userId: params.requestingUserId,
      role: params.requestingUserRole,
    });
    return this.prisma.document.findMany({
      where: { caseId: params.caseId },
      include: { uploadedBy: true },
    });
  }

  async remove(id: string): Promise<Document> {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
