import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator"

export class flightSearchDto{
    @IsString()
    @IsOptional()
    startDestination?: string

    @IsString()
    @IsOptional()
    endDestination?: string

    @IsString()
    @IsOptional()
    locationType?: string

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