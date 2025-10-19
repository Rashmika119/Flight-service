import { IsDateString, IsOptional, IsString } from "class-validator"

export class cheapFlightDto{
    @IsString()
    @IsOptional()
    startDestination?:string

    @IsOptional()
    @IsDateString()
    endDestination?:string

    @IsOptional()
    @IsDateString()
    departTime?:string
}