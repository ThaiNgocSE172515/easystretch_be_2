import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ForbiddenError } from "@payos/node";
import { Observable } from "rxjs";
import { SupabaseService } from "src/supabase/supabase.service";


@Injectable()
export class MemberGuard implements CanActivate {

    constructor(private readonly supabaseService: SupabaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const { data, error } = await this.supabaseService.getClient().from("profiles").select("is_subscriber").eq("id", userId).single();

        if (error || !data) {
            throw new ForbiddenException(error.message);
        }

        if (data.is_subscriber !== "active") {
            throw new ForbiddenException("Bạn không có quyền truy cập");
        }

        return true;
    }

}