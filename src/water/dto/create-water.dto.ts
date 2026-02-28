import {
  IsInt,
  IsUUID,
  IsString,
  IsOptional,
  Matches,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWaterSettingDto {
  @ApiProperty({
    description: 'UUID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Mục tiêu uống nước (ml)', example: 2000 })
  @IsInt()
  daily_goal_ml: number;

  @ApiProperty({ description: 'Giờ bắt đầu nhắc (HH:mm)', example: '08:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Định dạng giờ phải là HH:mm',
  })
  wake_time: string;

  @ApiProperty({ description: 'Giờ kết thúc nhắc (HH:mm)', example: '22:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Định dạng giờ phải là HH:mm',
  })
  sleep_time: string;

  @ApiProperty({
    description: 'Khoảng cách giữa các lần nhắc (Phút)',
    example: 60,
  })
  @IsInt()
  reminder_interval_mins: number;
}



export class CreateWaterLogDto {
  @ApiProperty({
    description: 'UUID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Lượng nước vừa uống (ml)', example: 250 })
  @IsInt()
  amount_ml: number;
}

export class GetLogsDto {
  @ApiProperty({
    description: "2026-02-28"
  })
  @IsDate({ message: 'Date must be a valid date' })
  date: Date;
}