import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CourseGuard implements CanActivate{

constructor(private readonly supabaseService: SupabaseService) {}

async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const courseId = request.params.course_id;
    console.log(courseId);
    const userId = request.user.id;
    console.log(userId);
    const supabase = this.supabaseService.getClient();
    const {data: user_course, error} = await supabase.from('user_courses').select('*').eq('course_id', courseId).eq("user_id", userId).maybeSingle();
    if(error || !user_course) {
      throw new BadRequestException("Bạn không có quyền truy cập vào khóa học này")
    }
  return true;
}}