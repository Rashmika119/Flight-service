import { IsOptional, IsString } from "class-validator"

export class cheapFlightDto{
    @IsString()
    @IsOptional()
    startDestination?:string

    @IsOptional()
    @IsString()
    endDestination?:string

    @IsOptional()
    @IsString()
    departTime?:string
}