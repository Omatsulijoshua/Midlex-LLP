import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RealtyService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const properties = await this.prisma.property.findMany();
    return properties.sort((left: any, right: any) => {
      if (Boolean(left.featured) !== Boolean(right.featured)) {
        return left.featured ? -1 : 1;
      }
      return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
    });
  }

  async findOne(slug: string) {
    const property = await this.prisma.property.findUnique({ where: { slug } });
    if (!property) throw new NotFoundException('Property listing not found');
    return property;
  }

  create(body: any) {
    this.validate(body);
    return this.prisma.property.create({ data: this.toData(body, true) as any });
  }

  async update(id: string, body: any) {
    const existing = await this.prisma.property.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Property listing not found');
    return this.prisma.property.update({
      where: { id },
      data: this.toData(body, false) as any,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.property.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Property listing not found');
    await this.prisma.property.delete({ where: { id } });
    return { ok: true };
  }

  private validate(body: any) {
    if (!String(body.title || '').trim()) throw new BadRequestException('Property title is required');
    if (!String(body.location || '').trim()) throw new BadRequestException('Property location is required');
    if (!Number.isFinite(Number(body.price)) || Number(body.price) < 0) {
      throw new BadRequestException('A valid property price is required');
    }
  }

  private toData(body: any, creating: boolean) {
    const data: Record<string, unknown> = {};
    const put = (key: string, rawValue: unknown, transform: (value: any) => unknown) => {
      if (creating || rawValue !== undefined) data[key] = transform(rawValue);
    };

    put('title', body.title, (value) => String(value || '').trim());
    if (creating || body.slug !== undefined || body.title !== undefined) {
      data.slug = this.slugify(body.slug || body.title);
    }
    put('description', body.description, (value) => String(value || '').trim());
    put('price', body.price, (value) => Number(value || 0));
    put('location', body.location, (value) => String(value || '').trim());
    put('category', body.category, (value) => String(value || 'RESIDENTIAL').trim().toUpperCase());
    put('offerTypes', body.offerTypes, (value) => {
      const valid = this.stringList(value)
        .map((item) => item.toUpperCase())
        .filter((item) => ['SALE', 'RENT', 'LEASE'].includes(item));
      return valid.length ? [...new Set(valid)] : ['SALE'];
    });
    put('bedrooms', body.bedrooms, (value) => Math.max(0, Number(value || 0)));
    put('bathrooms', body.bathrooms, (value) => Math.max(0, Number(value || 0)));
    put('sizeSqm', body.sizeSqm, (value) => value === '' || value == null ? null : Number(value));
    put('images', body.images, (value) => this.stringList(value));
    put('features', body.features, (value) => this.stringList(value));
    put('status', body.status, (value) => String(value || 'AVAILABLE').trim().toUpperCase());
    put('featured', body.featured, (value) => Boolean(value));
    return data;
  }

  private stringList(value: unknown) {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    return String(value || '').split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  }

  private slugify(value: unknown) {
    const slug = String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return slug || `property-${Date.now()}`;
  }
}
