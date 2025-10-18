import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Flight } from './flight.entity';


import { flightUpdateDto } from './flightUpdate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cheapFlightDto } from './cheapFlight.dto';
import { flightSearchDto } from './fightSearch.dto';

@Injectable()
export class FlightService {

  constructor(
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
  ) { }

  async getAllFlights(): Promise<Flight[]> {
    return await this.flightRepo.find();
  }

  async createFlight(
    name: string,
    startDestination: string,
    endDestination: string,
    locationType: string,
    departTime: Date,
    arriveTime: Date,
    price: number
  ): Promise<Flight> {
    const flight = this.flightRepo.create({
      name,
      startDestination,
      endDestination,
      locationType,
      departTime,
      arriveTime,
      price
    });
    await this.flightRepo.save(flight);
    return flight;
  }

  async deleteFlight(id: string): Promise<void> {
    const result = await this.flightRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Flight with is ${id} not found`)
    }

  }

async flightSearch(flightSearchDto: flightSearchDto): Promise<Flight[]> {
  const { startDestination, endDestination, locationType, departTime, price } = flightSearchDto;

  const query = this.flightRepo.createQueryBuilder('flight');

  if (startDestination) {
    query.andWhere('flight.startDestination LIKE :startDestination', {
      startDestination: `%${startDestination}%`,
    });
  }

  if (endDestination) {
    query.andWhere('flight.endDestination LIKE :endDestination', {
      endDestination: `%${endDestination}%`,
    });
  }

  if (locationType) {
    query.andWhere('flight.locationType LIKE :locationType', {
      locationType: `%${locationType}%`,
    });
  }

  // Handle departTime correctly for Date column
  if (departTime) {
    const startOfDay = new Date(departTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(departTime);
    endOfDay.setHours(23, 59, 59, 999);

    query.andWhere('flight.departTime BETWEEN :start AND :end', {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString(),
    });
  }

  if (price) {
    query.andWhere('flight.price = :price', { price });
  }

  return await query.getMany();
}
  async getFlightById(id: string): Promise<Flight> {
    const flight = await this.flightRepo.findOne({ where: { id } })
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  async updateFlight(id: string, flightUpdatedto: flightUpdateDto): Promise<Flight> {
    const flight = await this.getFlightById(id);

    if (flightUpdatedto.departTime) {
    const departDate = new Date(flightUpdatedto.departTime);
    if (isNaN(departDate.getTime())) throw new HttpException('Invalid departTime', 400);
    flight.departTime = departDate;
  }

  if (flightUpdatedto.arriveTime) {
    const arriveDate = new Date(flightUpdatedto.arriveTime);
    if (isNaN(arriveDate.getTime())) throw new HttpException('Invalid arriveTime', 400);
    flight.arriveTime = arriveDate;
  }
    const { arriveTime, departTime, ...otherFields } = flightUpdatedto;
    Object.assign(flight, otherFields);

    return await this.flightRepo.save(flight);
  }
  async searchCheapestFlightArrival(cheapFlightDto: cheapFlightDto) {

    const { startDestination, endDestination, departTime } = cheapFlightDto;
    const query = this.flightRepo.createQueryBuilder('flight')

    if (startDestination) {
      query.andWhere('flight.startDestination LIKE :startDestination', {
        startDestination: `%${startDestination}%`,
      })
    }

    if (endDestination) {
      query.andWhere('flight.endDestination LIKE :endDestination', {
        endDestination: `%${endDestination}%`,
      })
    }
   if (departTime) {
    const startOfDay = new Date(departTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(departTime);
    endOfDay.setHours(23, 59, 59, 999);

    query.andWhere('flight.arriveTime BETWEEN :start AND :end', {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString(),
    });
  }
    query.orderBy('flight.price', 'ASC');
    const cheapestFlight = await query.getOne();

    if (!cheapestFlight) {
      return null;
    } else {

      return {
        name: cheapestFlight.name,
        price: cheapestFlight.price,
        arriveTime: cheapestFlight.arriveTime
      }

    }



  }
}
