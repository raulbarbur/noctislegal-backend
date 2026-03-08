import { IsString, IsOptional, Length, IsArray, ArrayMaxSize, MaxLength, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  contact?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}