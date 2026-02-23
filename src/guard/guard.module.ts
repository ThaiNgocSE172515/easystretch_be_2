import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { CourseGuard } from './course.guard';

@Module({
  imports: [SupabaseModule],
  providers: [AuthGuard, RolesGuard, CourseGuard],
  exports: [AuthGuard, RolesGuard, CourseGuard]
})
export class GuardModule {
}
