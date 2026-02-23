import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ExerciseInDayDto {
  @IsString()
  @ApiProperty({ example: 'exercise_id_12345' })
  exercise_id: string;

  @IsInt()
  @ApiProperty({ example: 1 })
  order_index: number;
}


class CourseDayDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  phase_number: number; // giai đoạn: 1

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 2 })
  week_number: number; //số tuần cho khóa học: 2

  @Min(1)
  @Max(7)
  @IsInt()
  @ApiProperty({ example: 2 })
  day_number: number; // ngày khóa học: 2

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Bài tập 1' })
  title?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseInDayDto)
  @ApiProperty({ example: [{ exercise_id: 'exercise_id_12345', order_index: 1 }] })
  exercises: ExerciseInDayDto[]; // bài tập
}

export class CreateCourseDto {
  @IsString()
  @ApiProperty({ example: 'Bài tập vùng cổ vay gáy' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Bài tập giúp làm giảm đau nhứt ở cổ vai' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'beginner' })
  level?: string; //beginner, intermediate, advanced

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseDayDto)
  @ApiProperty({
    example: [
      {
        phase_number: 1,
        week_number: 1,
        day_number: 1,
        title: 'ngày 1, tuần 1, giai đoạn 1',
        exercises: [
          {
            exercise_id: '39dcf413-802d-463e-8925-073d13277a44',
          },
          {
            exercise_id: 'cd99bf48-f486-4d63-94d2-527aef2d92eb',
          },
        ],
      },
      {
        phase_number: 1,
        week_number: 1,
        day_number: 2,
        title: 'ngày 2, tuần 1, giai đoạn 1',
        exercises: [
          {
            exercise_id: '39dcf413-802d-463e-8925-073d13277a44',
          },
          {
            exercise_id: 'cd99bf48-f486-4d63-94d2-527aef2d92eb',
          },
        ],
      },
    ],
  })
  days: CourseDayDto[];
}
