import {
  IsString,
  IsUUID,
  IsNumber,
  IsIn,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMealDto {
  @ApiProperty({
    description: 'UUID của người dùng (tạm nhập tay để test)',
    example: '2758a251-ccf1-47de-981f-62a068c94822',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'UUID của món ăn/thực phẩm',
    example: '64d0bd57-a515-4319-8072-c7d5889539a0',
  })
  @IsUUID()
  food_id: string;

  @ApiProperty({
    description: 'Loại bữa ăn trong ngày',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'],
    example: 'BREAKFAST',
  })
  @IsString()
  @IsIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'])
  meal_type: string;

  @ApiPropertyOptional({
    description: 'Số lượng khẩu phần ăn',
    example: 1.5,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Ngày tiêu thụ (Định dạng: YYYY-MM-DD)',
    example: '2026-02-23',
  })
  @IsDateString()
  consumed_at: string;
}

export class IdDto {
  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}