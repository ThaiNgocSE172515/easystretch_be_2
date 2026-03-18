import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class MissionExerciseItemDto {
  @ApiProperty({ description: 'ID của bài tập (từ bảng exercises)' })
  @IsNotEmpty()
  @IsString()
  exercise_id: string;

  @ApiProperty({ description: 'Số điểm đạt được' })
  @IsNotEmpty()
  @IsNumber()
  point: number;
}

export class AddMissionExerciseDto {
  @ApiProperty({ type: [MissionExerciseItemDto], description: 'Danh sách bài tập cần thêm' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissionExerciseItemDto)
  exercises: MissionExerciseItemDto[];
}
