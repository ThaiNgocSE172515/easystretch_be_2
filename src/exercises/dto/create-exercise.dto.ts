import { ArrayUnique, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';



export class TimeLine {

  @IsNumber()
  imageIndex: number;

  @IsNumber()
  duration: number;
}


export enum LoopTypeEnum {
  REPS = 'reps',
  DURATION = 'duration',
}
export enum ExerciseEnum {
  RECOVER = 'recover',
  RELAXATION = 'relaxation',
}

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

  @IsArray()
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
    example: ["https://bizweb.dktcdn.net/100/011/344/files/bai-tap-gian-co-vai-6.jpg?v=1685326227931", "https://bizweb.dktcdn.net/100/011/344/files/bai-tap-gian-co-tay-sau-1.jpg?v=1685331005258"]
  })
  img_list?: string[];

  @IsEnum(ExerciseEnum, { message: "Type phải là recover hay relaxation" })
  @ApiProperty({
    example: "relaxation"
  })
  type: string;

  @IsNumber({}, { message: "rest after phải là 1 số" })
  @ApiProperty({
    example: 10
  })
  rest_after: number;

  @IsNumber({}, { message: "target value phải là 1 số" })
  @ApiProperty({
    example: 10
  })
  target_value: number;

  @IsEnum(LoopTypeEnum, { message: "loop type phải là reps hoặc duration" })
  @ApiProperty({
    example: "reps"
  })
  loop_type: string;

  @IsArray()
  @Type(() => TimeLine)
  @ApiProperty({
    example: [
      {
        imageIndex: 0,
        duration: 10000
      },
      {
        imageIndex: 2,
        duration: 20000
      }
    ]
  })
  time_line: TimeLine[]
}



