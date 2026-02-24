import { Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { SupabaseService } from '../supabase/supabase.service';
import Grog from  "groq-sdk"
import {Pool} from "pg"
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private grog: Grog;
  private pool: Pool;
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    this.grog = new Grog({
      apiKey: configService.get<string>('GROQ_API_KEY'),
    });
    this.pool = new Pool({
      connectionString: configService.get<string>('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
    });
  }

  sql = `TABLE public.course_day_exercises (
  course_day_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT course_day_exercises_pkey PRIMARY KEY (course_day_id, exercise_id),
  CONSTRAINT course_day_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id),
  CONSTRAINT course_day_exercises_course_day_id_fkey FOREIGN KEY (course_day_id) REFERENCES public.course_days(id)
);
 TABLE public.course_days (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  phase_number integer NOT NULL,
  week_number integer NOT NULL,
  day_number integer NOT NULL,
  title text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT course_days_pkey PRIMARY KEY (id),
  CONSTRAINT course_days_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
 TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  level text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_active boolean NOT NULL DEFAULT true,
  price numeric DEFAULT '0'::numeric,
  img_url text,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
 TABLE public.exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text,
  duration integer NOT NULL,
  target_muscle ARRAY,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  img_list ARRAY,
  type USER-DEFINED,
  CONSTRAINT exercises_pkey PRIMARY KEY (id)
);
 TABLE public.foods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  calories integer NOT NULL,
  protein numeric,
  carbs numeric,
  fat numeric,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT foods_pkey PRIMARY KEY (id)
);
 TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid,
  status USER-DEFINED DEFAULT 'PENDING'::order_status,
  sepay_transaction_id text,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
 TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  email text,
  avatar_url text,
  gender text CHECK (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text])),
  height_cm real CHECK (height_cm > 50::double precision AND height_cm < 250::double precision),
  weight_kg real CHECK (weight_kg > 20::double precision AND weight_kg < 300::double precision),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  total_practice_minutes bigint NOT NULL DEFAULT '0'::bigint,
  current_point bigint NOT NULL DEFAULT '0'::bigint,
  is_subscriber USER-DEFINED NOT NULL DEFAULT 'inactive'::subscriber,
  role USER-DEFINED NOT NULL DEFAULT 'user'::role,
  age numeric CHECK (age >= 15::numeric),
  is_active boolean NOT NULL DEFAULT true CHECK (is_active = ANY (ARRAY[true, false])),
  goal text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
 TABLE public.user_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid,
  enrolled_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_courses_pkey PRIMARY KEY (id),
  CONSTRAINT user_courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
 TABLE public.user_meals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  food_id uuid NOT NULL,
  meal_type text NOT NULL CHECK (meal_type = ANY (ARRAY['BREAKFAST'::text, 'LUNCH'::text, 'DINNER'::text, 'SNACK'::text])),
  quantity numeric NOT NULL DEFAULT 1,
  consumed_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_meals_pkey PRIMARY KEY (id),
  CONSTRAINT user_meals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_meals_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(id)
);
 TABLE public.water_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_ml integer NOT NULL,
  consumed_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT water_logs_pkey PRIMARY KEY (id),
  CONSTRAINT water_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
 TABLE public.water_settings (
  user_id uuid NOT NULL,
  daily_goal_ml integer NOT NULL DEFAULT 2000,
  wake_time time without time zone NOT NULL DEFAULT '08:00:00'::time without time zone,
  sleep_time time without time zone NOT NULL DEFAULT '22:00:00'::time without time zone,
  reminder_interval_mins integer NOT NULL DEFAULT 60,
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT water_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT water_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);`;

  async question(question: CreateAiDto) {
    const prompt = `
      Bạn là một chuyên gia PostgreSQL. Dựa vào cấu trúc Database sau:
      ${this.sql};

      Câu hỏi của Admin: "${question.question}"

      Nhiệm vụ: Viết câu lệnh SQL (chỉ SELECT) để trả lời câu hỏi trên.
      TUYỆT ĐỐI CHỈ TRẢ VỀ CÂU LỆNH SQL THUẦN TÚY, không giải thích, không dùng markdown (\`\`\`).
    `;

    const rs = await this.grog.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    // @ts-ignore
    const sqlQuery = rs.choices[0].message.content.trim();
    console.log('AI generated SQL:', sqlQuery);
    try {
      const db = await this.pool.query(sqlQuery);

      const prompt = `bạn là 1 quản lý hệ thống, bạn sẽ trả lời gắn gọn dựa trên ${question.question} và ${JSON.stringify(db.rows)} trả lời gắn gọn súc tích tuyệt đối không dùng markdown`;
      const rs = await this.grog.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
      });
      console.log('DB response:', db.rows);
      return {
        query_used: sqlQuery,
        answer: rs.choices[0].message.content?.trim(),
      };
    } catch (error) {
      return {
        query_used: sqlQuery,
        answer: error.message,
      };
    }
  }

  async questionNutrition(question: CreateAiDto) {

    const prompt =`Bạn là chuyên gia dinh dưỡng bạn đang làm nhiệm vụ đưa ra gợi ý thức ăn dưa trên câu hỏi ${question.question} của user
                   QUAN TRỌNG
                   - Không trả lời câu hỏi ngoài việc liên quan dinh dưỡng nếu hõi không liên quan bạn trả lời tôi không có dữ liệu liên quan
                   - Trã lời dạng plain text không phải dạng markdown
                   `;

    const rs = await this.grog.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });
    console.log('DB response:', rs.choices[0].message.content?.trim());
    return {
      answer: rs.choices[0].message.content?.trim(),
    }

  };
}
