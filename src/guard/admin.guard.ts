import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ):  boolean  {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const role = user.user_metadata.role;
    if(role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền truy cập');
    }
    return true;
  }
}