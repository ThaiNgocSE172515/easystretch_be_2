import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  LoginUserDto,
  mailDto,
  sendOtpDto,
} from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('signup')
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng mới' })
  @ApiResponse({ status: 201, description: 'Tạo user thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Tài khoản không tồn tại' })
  @ApiResponse({ status: 400, description: 'Mật khẩu không chính xác' })
  signin(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.signin(loginUserDto);
  }

  @Post('signout')
  @ApiOperation({ summary: 'Đăng xuất' })
  signout() {
    return this.usersService.signout();
  }  
  
  @Post('otp')
  @ApiOperation({ summary: 'Lấy otp để reset password' })
  sendOpt(@Body() email: mailDto) {
    return this.usersService.handleSendOtp(email);
  }  
  @Post('reset')
  @ApiOperation({ summary: 'reset password' })
  reset(@Body() reset: sendOtpDto) {
    return this.usersService.resetPassword(reset);
  }

  @Get('profile')
  @ApiOperation({summary: "Lấy thông tin cá nhân "})
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getProfile(@Req() req) {
    return this.usersService.getProfile(req.user);
  }

  @Patch('update') 
  @ApiOperation({summary: "Cập nhật thông tin cá nhân"})
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const id = req.user.id;
    return this.usersService.update(id, updateUserDto);
  }
}
