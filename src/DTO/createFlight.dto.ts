import { IsDateString, IsNumber, IsString } from 'class-validator';
import { PrimaryGeneratedColumn, Column } from 'typeorm';

export class createFlightDto  {


  @IsString()
  name!: string;

  @IsString()
  startDestination!: string;

  @IsString()
  endDestination!: string;

  @IsString()
  locationType!: string;

  @IsDateString()
  departTime!: string;

 @IsDateString()
  arriveTime!: string;

  @IsNumber()
  price!: number;
}
