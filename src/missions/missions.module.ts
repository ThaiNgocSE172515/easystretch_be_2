import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [SupabaseModule, GuardModule],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
