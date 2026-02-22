import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseModule } from '../supabase/supabase.module';
import { GuardModule } from '../guard/guard.module';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [
    SupabaseModule, GuardModule
  ],
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService],
})
export class UsersModule {}
