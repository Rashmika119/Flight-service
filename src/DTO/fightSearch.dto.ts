import { IsDateString, IsOptional, IsString } from "class-validator"

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

    @IsString()
    @IsOptional()
    arriveTime?: string

    @IsDateString()
    @IsOptional()
    departTime?: string

    @IsDateString()
    @IsOptional()
    price?: number
} 