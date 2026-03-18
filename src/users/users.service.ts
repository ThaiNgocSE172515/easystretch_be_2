import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  BanUserDto,
  CreateUserDto,
  LoginUserDto,
  mailDto,
  sendOtpDto,
} from './dto/create-user.dto';
import { SupabaseService } from '../supabase/supabase.service';
import bcrypt from 'bcrypt';
import { ApiResponse } from '../common/response/api-response';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signup(createUserDto: CreateUserDto) {
    const { full_name, email, password, role } = createUserDto;
    const supabase = this.supabaseService.getClient();
    const finalRole = role || 'user';

    // Insert vào bảng profiles
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role: finalRole },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      code: 201,
      message: 'Thêm user thành công',
      data: data,
    };
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { height_cm, weight_kg, gender, goal } = updateUserDto;

    const supabase = this.supabaseService.getClient();

    const dataUpdate = {
      height_cm,
      weight_kg,
      gender,
      goal,
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(dataUpdate)
      .eq('id', id)
      .select();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      code: 201,
      message: 'cập nhật user thành công',
      data: data,
    };
  }

  async signin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');

    return {
      success: true,
      code: 200,
      message: 'Đăng nhập thành công',
      token: data.session?.access_token,
    };
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      throw new BadRequestException('Lấy danh sách user khônng thành công');
    }
    return {
      data: data,
      success: true,
      code: 200,
    };
  }

  async getProfile(user: any) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    console.log(user.id, error, data);
    return {
      success: true,
      code: 200,
      message: 'Lấy thông tin cá nhân thành công',
      data: data,
    };
  }

  async getLeaderboard() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, current_point')
      .order('current_point', { ascending: false })
      .limit(10);
      
    if (error) {
      throw new BadRequestException('Lấy bảng xếp hạng không thành công');
    }
    return {
      success: true,
      code: 200,
      message: 'Lấy bảng xếp hạng thành công',
      data: data,
    };
  }

  async ban(id: string, banUserDTO: BanUserDto) {
    const supabase = this.supabaseService.getClient();
    let duration = 0;

    if (
      banUserDTO.type == 'day' ||
      banUserDTO.type == 'days' ||
      banUserDTO.type == 'd' ||
      banUserDTO.type == 'D' ||
      banUserDTO.type == 'DAY'
    ) {
      duration = banUserDTO.time * 24;
    } else if (
      banUserDTO.type == 'hour' ||
      banUserDTO.type == 'hours' ||
      banUserDTO.type == 'h' ||
      banUserDTO.type == 'H' ||
      banUserDTO.type == 'HOUR'
    ) {
      duration = banUserDTO.time;
    }

    const { data: banData, error: banError } =
      await supabase.auth.admin.updateUserById(id, {
        ban_duration: duration + 'h',
      });

    if (banError) {
      throw new BadRequestException(
        `Không thể khóa tài khoản: ${banError.message}`,
      );
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id)
      .select();

    if (profileError) {
      throw new BadRequestException(
        `Không thể cập nhật profile: ${profileError.message}`,
      );
    }

    // @ts-ignore
    const dateTmp = new Date(banData.user?.banned_until);
    const date = dateTmp.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const formData = {
      user_id: banData.user?.id,
      email: banData.user?.email,
      ban_duration: date || banData.user?.banned_until,
      reason: banUserDTO.reason,
    };
    return ApiResponse.success(formData, 'Khóa tài khoản thành công', 200);
  }

  async unban(id: string) {
    const supabase = this.supabaseService.getClient();

    const { error: unbanError } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: 'none',
    });

    if (unbanError) {
      throw new BadRequestException(
        `Không thể mở khóa tài khoản: ${unbanError.message}`,
      );
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', id)
      .select();

    if (profileError) {
      throw new BadRequestException(
        `Không thể cập nhật profile: ${profileError.message}`,
      );
    }

    return {
      success: true,
      code: 200,
      message: 'Đã mở khóa tài khoản và khôi phục người dùng thành công',
      data: data,
    };
  }

  async signout() {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new BadRequestException(error.message);
    }
    return {
      code: 200,
      success: true,
      message: 'Đã đăng xuất thành công',
    };
  }

  async handleSendOtp(mail: mailDto){
    const supabase = this.supabaseService.getClient();
    const {data, error} = await  supabase.auth.resetPasswordForEmail(mail.gmail);
    if(error) {
      throw new BadRequestException(error.message);
    }
    return {
      success: true,
      code: 200,
      message: "Đã gữi mã otp về mail của bạn",
      data: data
    }
  };
  async resetPassword( token: sendOtpDto){
    const supabase = this.supabaseService.getClient();
    const {data, error} = await  supabase.auth.verifyOtp({
      email: token.gmail,
      token: token.otp,
      type: "recovery"
    });
    if(error) {
      throw new BadRequestException(error.message);
    }

    const {data: updateData, error: updateError} = await supabase.auth.updateUser({
      password: token.password
    });
    if (updateError) {
      throw new BadRequestException(updateError.message);
    }

    return {
      success: true,
      code: 200,
      message: "Lấy mật khẩu thành công",
      data: data
    }
  };
}
