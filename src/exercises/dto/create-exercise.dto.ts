import { IsArray, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @IsString()
  @ApiProperty({
    example: "Bài tập cổ và vai căn bản"
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "Bài tập về cổ và vai"
  })
  description?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: ["https://www.youtube.com/watch?v=09-09-09", "https://www.youtube.com/watch?v=09-09-09"] })
  video_url?: string[];

  @IsInt()
  @ApiProperty({ example: 10 })
  duration: number;

  @IsArray()
  @ApiProperty({
    example: ["cổ", "vai"]
  })
  target_muscle: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ["https://i.ytimg.com/vi/09-09-09/maxresdefault.jpg"]
  })
  img_list?: string[];

  @IsString()
  @ApiProperty({
    example: "free"
  })
  type: string;
}
