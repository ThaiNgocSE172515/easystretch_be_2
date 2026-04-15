import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Chưa có token trong header');
    }

    const token = authHeader.split(' ')[1];
    const supabase = this.supabaseService.getClient();
    const {data: {user}, error} = await  supabase.auth.getUser(token);

    if(error || !user) {
      throw new UnauthorizedException(`Token không hợp lệ hoặc đã hết hạn ${error?.message}`)
    }
    
    request.user = user;
    return true;
}}