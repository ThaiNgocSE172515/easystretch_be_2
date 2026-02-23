import { Optional } from "@nestjs/common";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { IsDate, IsNumber, IsString, IsUrl, ValidateNested } from "class-validator";

export class PaymentItemsDto {
    @IsString({ message: "name là 1 chuỗi ký tự" })
    @ApiProperty({ example: "4fffd2f9-cc0e-4e27-a06c-9f7fd41b225a" })
    name: string;

    @IsNumber({}, { message: "quanlity phải là 1 số" })
    @ApiProperty({ example: 1 })
    quantity: number;

    @IsNumber({}, { message: "amount phải là 1 số" })
    @ApiProperty({ example: 200000 })
    price: number;
}

export class CreatePaymentLinkDto {

    @IsNumber({}, { message: "orderCode phải là 1 số" })
    @Optional()
    @ApiHideProperty()
    orderCode: number;

    @IsNumber({}, { message: "amount phải là 1 số" })
    @ApiProperty({ example: 500000 })
    amount: number;

    @IsString({ message: "description là 1 chuỗi ký tự" })
    @ApiProperty({ example: "Khóa học giản cơ tại nhà" })
    description: string;

    @ValidateNested({ each: true })
    @Type(() => PaymentItemsDto)
    @ApiProperty({
        example: [{
            name: "4fffd2f9-cc0e-4e27-a06c-9f7fd41b225a",
            quantity: 1,
            price: 50000
        }], description: "name là course id"
    })
    items: PaymentItemsDto[];

    @IsUrl({}, { message: "returnUrl phải là url" })
    @ApiProperty({ example: "https://www.youtube.com/watch?v=Da9NpDAtElE&list=RDDa9NpDAtElE&start_radio=1" })
    returnUrl: string;

    @IsUrl({}, { message: "cancelUrl phải là url" })
    @ApiProperty({ example: "https://www.youtube.com/watch?v=Da9NpDAtElE&list=RDDa9NpDAtElE&start_radio=1" })
    cancelUrl: string

}

export class CreateOrdersDto {
    user_id: string;
    course_id: string;
    sepay_transaction_id: number;
    amount: number;
    status: string;
    created_at: Date;
}

export class useCourseDto {
    enrolled_at: Date;
    user_id: string;
    course_id: string;
}