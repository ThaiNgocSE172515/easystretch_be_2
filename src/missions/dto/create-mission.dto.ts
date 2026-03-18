import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMissionDto {
  @ApiProperty({ description: 'Tên nhiệm vụ' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả nhiệm vụ' })
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiPropertyOptional({ description: 'Cấp độ nhiệm vụ' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Ngày chạy nhiệm vụ (YYYY-MM-DD)', example: '2026-03-18' })
  @IsOptional()
  @IsString()
  target_date?: string;
}
