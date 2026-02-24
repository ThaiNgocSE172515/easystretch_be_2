import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: [SupabaseModule]
})
export class AiModule {}
