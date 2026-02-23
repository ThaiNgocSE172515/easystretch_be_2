import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Optional } from '@nestjs/common';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export enum BanType {
  DAY = 'day',
  HOUR = 'hour',
}
export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Trung Loc' })
  full_name: string;

  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsEmail()
  @ApiProperty({ example: 'trungloc@gmail.com' })
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ example: UserRole.USER, enum: UserRole })
  role?: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'trungloc@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}

export class BanUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  time: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BanType)
  @ApiProperty({ example: BanType.DAY, enum: BanType })
  type: string;

  @Optional()
  @IsString()
  @ApiProperty({example: "Truy cập quá nhiều lần (optional có thể không xóa không cần lý do)"})
  reason?: string;
}

