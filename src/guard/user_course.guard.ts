import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserCourseGuard implements CanActivate {
    constructor(private readonly supabaseService: SupabaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const courseId = request.params?.course_id;


        if (!courseId) {
            throw new NotFoundException(`Không tìm thấy course với id ${courseId}`);
        }


        const { data: course, error: course_error } = await this.supabaseService.getClient().from("courses").select().eq("id", courseId).maybeSingle();

        if (!course || course_error) {
            throw new ForbiddenException(`Không thể tìm thấy course với id là ${courseId}`)
        }


        if (course.type == "free") {
            return true;
        }


        const { data: userCourse } = await this.supabaseService.getClient()
            .from("user_courses")
            .select("id")
            .eq("user_id", userId)
            .eq("course_id", courseId)
            .maybeSingle();

        if (userCourse) {
            return true;
        }

        if (course.type === 'member') {
            const { data: profile, error: profileError } = await this.supabaseService.getClient()
                .from("profiles")
                .select("is_subscriber")
                .eq("id", userId)
                .single();

            if (profileError || !profile) {
                throw new ForbiddenException("Lỗi khi kiểm tra thông tin user");
            }

            if (profile.is_subscriber === "active") {
                return true;
            } else {
                throw new ForbiddenException("Bạn cần nâng cấp gói Member để xem khóa học này");
            }
        }

        throw new ForbiddenException("Bạn cần mua khóa học để truy cập")

    }
}
