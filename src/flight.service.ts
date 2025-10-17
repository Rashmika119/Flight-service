import { Injectable, NotFoundException } from '@nestjs/common';



import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';
import { flightSearchDto } from './fightSearch.dto';
import { flightUpdateDto } from './flightUpdate.dto';
import { cheapFlightDto } from './cheapFlight.dto';


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
    departTime: string,
    arriveTime: string,
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
    const { startDestination, endDestination, locationType, departTime, price, arriveTime } = flightSearchDto;

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
    if (locationType) {
      query.andWhere('flight.locationType LIKE :locationType', {
        locationType: `%${locationType}%`,
      })
    }
    if (departTime) {
      query.andWhere("flight.departTime LIKE :departDate", {
        departDate: `${departTime}%`
      })
    }
    if (arriveTime) {
      query.andWhere("flight.arriveTime LIKE :arriveTime", {
        arriveTime: `${arriveTime}%`
      })
    }

    if (price) {
      query.andWhere('flight.price LIKE :price', {
        price: `%${price}%`,
      })
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
    Object.assign(flight, flightUpdatedto);

    return await this.flightRepo.save(flight);

  }
  async searchCheapestFlightArrival(cheapFlightDto: cheapFlightDto) {


    const { startDestination, endDestination, arriveTime } = cheapFlightDto;
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
    if (arriveTime) {
      //[0]-date [1]-time

      const date = arriveTime.split('T')[0];
      query.andWhere('DATE(flight.arriveTime) = :date', { date });

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
