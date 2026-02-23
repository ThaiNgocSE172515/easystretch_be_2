import { Module } from '@nestjs/common';
import { WaterService } from './water.service';
import { WaterController } from './water.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [WaterController],
  providers: [WaterService],
  imports: [SupabaseModule]
})
export class WaterModule {}
