import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { BanUserDto } from './dto/create-user.dto';

@Controller('admin-users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get("users")
  @ApiOperation({
    summary: "Lấy danh sách tất cả người dùng"
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }

  @Post("ban/:id")
  @ApiOperation({summary: "Ban người dùng vi phạm"})
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  banUser(@Param("id") id: string,@Body() banUserDto: BanUserDto ) {
    return this.usersService.ban(id, banUserDto);
  }

  @Post("unban/:id")
  @ApiOperation({summary: "Bỏ ban người dùng vi phạm"})
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  unbanUser(@Param("id") id: string ) {
    return this.usersService.unban(id);
  }


}

