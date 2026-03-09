import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  ParseUUIDPipe,
  Inject,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { ClientsService } from './clients.service.js';
import { CreateClientDto, UpdateClientDto } from './dto/clients.dto.js';
import { ApiResponse } from '../../common/interfaces/api-response.interface.js';

@Controller('clients')
export class ClientsController {
  constructor(
    @Inject(ClientsService)
    private readonly clientsService: ClientsService
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ 
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true,
      expectedType: CreateClientDto // CLAVE: Fuerza la validación de esta clase específica
    })) 
    createClientDto: CreateClientDto
  ): Promise<ApiResponse> {
    const data = await this.clientsService.create(createClientDto);
    return {
      success: true,
      data,
      error: null,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('archived') archived?: string,
  ): Promise<ApiResponse> {
    const data = await this.clientsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      tag,
      archived: archived === 'true',
    });
    return {
      success: true,
      data,
      error: null,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse> {
    const data = await this.clientsService.findOne(id);
    return {
      success: true,
      data,
      error: null,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ 
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true,
      expectedType: UpdateClientDto // CLAVE: Fuerza la validación de esta clase específica
    })) 
    updateClientDto: UpdateClientDto,
  ): Promise<ApiResponse> {
    const data = await this.clientsService.update(id, updateClientDto);
    return {
      success: true,
      data,
      error: null,
    };
  }

  @Post(':id/archive')
  async archive(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse> {
    const data = await this.clientsService.archive(id);
    return {
      success: true,
      data,
      error: null,
    };
  }

  @Post(':id/restore')
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse> {
    const data = await this.clientsService.restore(id);
    return {
      success: true,
      data,
      error: null,
    };
  }
}