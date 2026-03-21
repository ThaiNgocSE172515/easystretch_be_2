import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMissionExerciseDto {
  @ApiPropertyOptional({ description: 'Số điểm đạt được' })
  @IsOptional()
  @IsNumber()
  point?: number;

  @ApiPropertyOptional({ description: 'Thứ tự bài tập' })
  @IsOptional()
  @IsNumber()
  order?: number;
}
