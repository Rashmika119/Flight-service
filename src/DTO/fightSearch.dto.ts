import { IsOptional, IsString } from "class-validator"

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

    @IsString()
    @IsOptional()
    departTime?: string

    @IsString()
    @IsOptional()
    price?: number
} 