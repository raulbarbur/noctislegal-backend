import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto, UpdateClientDto } from './dto/clients.dto.js';
import { PaginatedData } from '../../common/interfaces/api-response.interface.js';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeTags(tags: string[]): string[] {
    if (!tags) return [];
    return Array.from(new Set(tags.map((t) => t.trim().toLowerCase())));
  }

  async create(createClientDto: CreateClientDto) {
    const { tags, ...data } = createClientDto;
    const normalizedTags = this.normalizeTags(tags || []);

    return await this.prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          ...data,
          tags: normalizedTags,
        },
      });

      await tx.clientHistory.create({
        data: {
          clientId: client.id,
          action: 'client_created',
          newValue: client as any,
        },
      });

      return client;
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    archived?: boolean;
  }): Promise<PaginatedData<any>> {
    const { page = 1, limit = 20, search, tag, archived = false } = params;
    const skip = (page - 1) * limit;

    const where: any = { archived };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { whatsapp: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = { has: tag.toLowerCase() };
    }

    const [items, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { files: true },
          },
        },
      }),
      this.prisma.client.count({ where }),
    ]);

    const formattedItems = items.map((item) => ({
      ...item,
      files_count: item._count.files,
      _count: undefined,
    }));

    return {
      items: formattedItems,
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        _count: {
          select: { files: true },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return {
      ...client,
      files_count: client._count.files,
      _count: undefined,
    };
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const { tags, ...data } = updateClientDto;
    const existingClient = await this.findOne(id);

    const normalizedTags = tags ? this.normalizeTags(tags) : undefined;

    return await this.prisma.$transaction(async (tx) => {
      const updatedClient = await tx.client.update({
        where: { id },
        data: {
          ...data,
          ...(normalizedTags && { tags: normalizedTags }),
        },
      });

      await tx.clientHistory.create({
        data: {
          clientId: id,
          action: 'client_updated',
          previousValue: existingClient as any,
          newValue: updatedClient as any,
        },
      });

      return updatedClient;
    });
  }

  async archive(id: string) {
    await this.findOne(id);

    return await this.prisma.$transaction(async (tx) => {
      const client = await tx.client.update({
        where: { id },
        data: {
          archived: true,
          archivedAt: new Date(),
        },
      });

      await tx.clientHistory.create({
        data: {
          clientId: id,
          action: 'client_archived',
        },
      });

      return client;
    });
  }

  async restore(id: string) {
    await this.findOne(id);

    return await this.prisma.$transaction(async (tx) => {
      const client = await tx.client.update({
        where: { id },
        data: {
          archived: false,
          archivedAt: null,
        },
      });

      await tx.clientHistory.create({
        data: {
          clientId: id,
          action: 'client_restored',
        },
      });

      return client;
    });
  }
}
