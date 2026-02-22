import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if(user.user_metadata.role !== 'admin'){
      throw new ForbiddenException('Chỉ admin mới có quyền truy cập');
    }
    return true;
  }
}