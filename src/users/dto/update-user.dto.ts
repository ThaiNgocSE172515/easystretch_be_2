import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, Max, Min, MinLength } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateUserDto  {
  @Min(120, { message: 'Chiều cao phải cao hơn 120 cm`' })
  @Max(200, { message: 'Chiều cao phải nhỏ hơn 200 cm' })
  @ApiPropertyOptional({ example: 180 })
  @Optional()
  height_cm?: number;

  @Optional()
  @Min(20, { message: 'Cân năng phải lớn hơn 20 kg' })
  @Max(250, { message: 'Cân Năng phải nhỏ hơn 250kg' })
  @ApiPropertyOptional({ example: 65 })
  weight_kg?: number;

  @Optional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Giới tính phải nằm trong Male, Female, hoặc Other',
  })
  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'other'] })
  gender?: string;

  @Optional()
  @IsString({ message: 'Mục tiêu là chuỗi k tự' })
  @ApiPropertyOptional({ example: 'I want to lose weight' })
  goal?: string;
}
