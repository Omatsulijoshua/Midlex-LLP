import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('caseId') caseId: string,
    @Body('name') name: string,
    @Request() req: any,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.documentsService.uploadDocument({
      file,
      caseId,
      uploadedById: req.user.id,
      uploadedByRole: req.user.role,
      name,
      baseUrl,
    });
  }

  @Get('case/:caseId')
  async findAllByCase(@Param('caseId') caseId: string, @Request() req: any) {
    return this.documentsService.findAllByCase({
      caseId,
      requestingUserId: req.user.id,
      requestingUserRole: req.user.role,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role === Role.CLIENT)
      throw new ForbiddenException('Not allowed');
    return this.documentsService.remove(id);
  }
}
