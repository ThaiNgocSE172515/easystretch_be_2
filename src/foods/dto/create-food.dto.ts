import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsUrl,
  IsUUID,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoodDto {

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["tinh bột", "thịt"]
  })
  categories: string[];

  @IsUUID()
  @ApiProperty({
    example: "2758a251-ccf1-47de-981f-62a068c94822",
  })
  user_id: string;
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
    example: 'f801accd-4117-4a78-a9d3-9c79c6c7458f',
  })
  user_id: string;

  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}


export class UserIdDto {
  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;
}
