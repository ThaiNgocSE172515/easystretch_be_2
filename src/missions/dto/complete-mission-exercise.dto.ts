import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteMissionExerciseDto {
  @ApiProperty({ description: 'ID của nhiệm vụ' })
  @IsNotEmpty()
  @IsString()
  mission_id: string;

  @ApiProperty({ description: 'ID của bài tập' })
  @IsNotEmpty()
  @IsString()
  exercise_id: string;
}
