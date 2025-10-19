import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator"

export class flightUpdateDto{

    @IsDateString()
    @IsOptional()
    arriveTime?: string

    @IsDateString()
    @IsOptional()
    departTime?: string

    @IsNumber()
    @IsOptional()
    price?: number
}