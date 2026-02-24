import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoodDto {
  @IsString()
  @ApiProperty({
    example: 'Ức gà luộc',
    description: 'Tên thực phẩm / món ăn',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Ức gà luộc không da, dồi dào protein rất tốt cho việc tăng cơ',
    description: 'Mô tả chi tiết về thực phẩm',
  })
  description?: string;

  @IsInt()
  @ApiProperty({
    example: 165,
    description: 'Tổng lượng calo (kcal)',
  })
  calories: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: 31.0,
    description: 'Lượng Protein (gram)',
  })
  protein?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: 0,
    description: 'Lượng Carbohydrate (gram)',
  })
  carbs?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: 3.6,
    description: 'Lượng chất béo / Fat (gram)',
  })
  fat?: number;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'https://example.com/images/uc-ga-luoc.jpg',
    description: 'Đường dẫn URL hình ảnh của món ăn',
  })
  image_url?: string;
}

export class IdDto {
  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}
