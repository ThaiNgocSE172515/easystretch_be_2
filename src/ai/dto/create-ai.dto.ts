import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAiDto {

  @(IsString())
  @ApiProperty({
    example: "Hiện tại hệ thống có bao nhiêu người dùng"
  })
  question: string;
}
