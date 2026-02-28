import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: "PENDING",
  })
  @IsString()
  status: String
}

export class findByDateDto {
  @IsDate({ message: 'Date must be a valid date' })
  @Type(() => Date)
  @ApiProperty({
    example: "2026-02-23",
  })
  date: Date
}