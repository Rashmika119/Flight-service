import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './flight.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'flight.sqlite',
      entities:[Flight],
      synchronize:true,
    }),
    TypeOrmModule.forFeature([Flight])
  ],
  controllers: [FlightController],
  providers: [FlightService],
})
export class AppModule {}
