import { IsOptional, IsString } from "class-validator"

export class flightUpdateDto{

    @IsString()
    @IsOptional()
    arriveTime?: string

    @IsString()
    @IsOptional()
    departTime?: string

    @IsString()
    @IsOptional()
    price?: number
}