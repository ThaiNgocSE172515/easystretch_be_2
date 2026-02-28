import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  UpdateWaterSettingDto,
  CreateWaterLogDto,
  GetLogsDto,
} from './dto/create-water.dto';

@Injectable()
export class WaterService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // 1. Cập nhật thiết lập & Tạo lịch trình nhắc nhở
  async updateSettings(dto: UpdateWaterSettingDto) {
    const supabase = this.supabaseService.getClient();

    // Dùng upsert (Nếu chưa có thì tạo, có rồi thì cập nhật)
    const { data: settings, error } = await supabase
      .from('water_settings')
      .upsert({
        user_id: dto.user_id,
        daily_goal_ml: dto.daily_goal_ml,
        wake_time: dto.wake_time,
        sleep_time: dto.sleep_time,
        reminder_interval_mins: dto.reminder_interval_mins,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException(
        'Lỗi lưu cài đặt: ' + error.message,
      );

    // Tự động tính toán các khung giờ nhắc nhở cho Frontend
    const schedule = this.generateReminderSchedule(
      settings.wake_time,
      settings.sleep_time,
      settings.reminder_interval_mins,
      settings.daily_goal_ml,
    );

    return {
      message: 'Đã cập nhật mục tiêu uống nước',
      settings,
      reminders: schedule,
    };
  }

  // 2. Hàm helper tính toán mảng thời gian nhắc nhở
  private generateReminderSchedule(
    wakeTime: string,
    sleepTime: string,
    intervalMins: number,
    dailyGoal: number,
  ) {
    const times = [];
    let [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    let [sleepHour, sleepMin] = sleepTime.split(':').map(Number);

    let currentTime = wakeHour * 60 + wakeMin; // Tính theo số phút từ 00:00
    const endTime = sleepHour * 60 + sleepMin;

    while (currentTime <= endTime) {
      const h = Math.floor(currentTime / 60)
        .toString()
        .padStart(2, '0');
      const m = (currentTime % 60).toString().padStart(2, '0');
      // @ts-ignore
      times.push(`${h}:${m}`);
      currentTime += intervalMins;
    }

    const amountPerReminder = Math.round(dailyGoal / times.length);

    return {
      total_reminders: times.length,
      suggested_amount_per_time: amountPerReminder, // Gợi ý mỗi lần nên uống bao nhiêu ml
      schedule_times: times, // Mảng các giờ ['08:00', '09:00', '10:00'...]
    };
  }

  // 3. Người dùng bấm nút "Đã uống nước"
  async logWater(dto: CreateWaterLogDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('water_logs')
      .insert([dto])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Đã ghi nhận uống nước', log: data };
  }

  // 4. Lấy tiến độ trong ngày hôm nay (Tiêu thụ vs Mục tiêu)
  async getDailyProgress(userId: string) {
    const supabase = this.supabaseService.getClient();

    // Lấy mục tiêu
    const { data: settings } = await supabase
      .from('water_settings')
      .select('daily_goal_ml')
      .eq('user_id', userId)
      .single();

    const goal = settings ? settings.daily_goal_ml : 2000;

    // Lấy tổng uống hôm nay
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: logs, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', userId)
      .gte('consumed_at', `${today}T00:00:00Z`)
      .lte('consumed_at', `${today}T23:59:59Z`);

    if (error) throw new InternalServerErrorException(error.message);

    const totalConsumed = logs.reduce((sum, log) => sum + log.amount_ml, 0);

    return {
      today,
      goal_ml: goal,
      consumed_ml: totalConsumed,
      percentage: Math.min(Math.round((totalConsumed / goal) * 100), 100),
      is_goal_reached: totalConsumed >= goal,
    };
  }

  async getWaterLogs(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data: logs, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
    if(error) throw new BadRequestException(error.message);
    return {
      code: 200,
      success: true,
      message: "Lấy danh sách nước uống theo id user thành công",
      data: logs,
    };
  }

  async getDailyWaterLogs(userId: string, date: GetLogsDto) {
    const supabase = this.supabaseService.getClient();
    const dateTmp = new Date(date.date).toISOString().split('T')[0];
    const startDate = dateTmp + 'T00:00:00Z';
    const endDate = dateTmp + 'T23:59:59Z';

    const { data: logs, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('consumed_at', startDate)
      .lte('consumed_at', endDate);

    if (error) throw new BadRequestException(error.message);
    return {
      code: 200,
      success: true,
      message: 'Lấy danh sách nước uống theo id user thành công',
      data: logs,
    };
  }
}
