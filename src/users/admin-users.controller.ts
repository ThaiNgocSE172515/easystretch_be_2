import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { BanUserDto, UnbanUserDto } from './dto/create-user.dto';

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
  findAll(@Req() req) {
    return this.usersService.findAll();
  }

  @Post("ban")
  @ApiOperation({summary: "Ban người dùng vi phạm"})
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  banUser(@Body() banUserDto: BanUserDto ) {
    return this.usersService.ban(banUserDto);
  }

  @Post("unban")
  @ApiOperation({summary: "Bỏ ban người dùng vi phạm"})
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  unbanUser(@Body() unbanUserDto: UnbanUserDto ) {
    return this.usersService.unban(unbanUserDto);
  }


}

