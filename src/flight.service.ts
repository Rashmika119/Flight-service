import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Flight } from './Entity/flight.entity';


import { flightUpdateDto } from './DTO/flightUpdate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cheapFlightDto } from './DTO/cheapFlight.dto';
import { flightSearchDto } from './DTO/fightSearch.dto';

@Injectable()
export class FlightService {
  private readonly logger = new Logger(FlightService.name);

  constructor(
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
  ) { }

  async getAllFlights(): Promise<Flight[]> {
    try {
      this.logger.debug('Fetching all flights');
      return await this.flightRepo.find();
    } catch (error) {
      this.logger.error('Error fetching flights', error.stack);
      throw new InternalServerErrorException('Failed to fetch flights');
    }
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
    this.logger.debug(`Flight created: ${flight.name} (${flight.id})`);
    return flight;
  }

  async deleteFlight(id: string): Promise<void> {
    const result = await this.flightRepo.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Flight not found: ${id}`);
      throw new NotFoundException(`Flight with id ${id} not found`);
    }
    this.logger.log(`Flight deleted: ${id}`);

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
      console.log(departTime);
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

    const flights = await query.getMany();
    this.logger.debug(`Flight search result count: ${flights.length}`);
    return flights


  }
  async getFlightById(id: string): Promise<Flight> {
    const flight = await this.flightRepo.findOne({ where: { id } })
    if (!flight) {
      this.logger.error(`Flight not found: ${id}`);
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    this.logger.debug(`Flight fetched: ${id}`);
    return flight;
  }

  async updateFlight(id: string, flightUpdatedto: flightUpdateDto): Promise<Flight> {
    const flight = await this.getFlightById(id);
    if (flightUpdatedto.departTime) {
      const departDate = new Date(flightUpdatedto.departTime);
      if (isNaN(departDate.getTime())) {
        this.logger.warn(`Invalid departTime for flight ${id}`);
        throw new HttpException('Invalid departTime', 400);
      }
      flight.departTime = departDate;
    }

    if (flightUpdatedto.arriveTime) {
      const arriveDate = new Date(flightUpdatedto.arriveTime);
      if (isNaN(arriveDate.getTime())) {
        this.logger.warn(`Invalid arriveTime for flight ${id}`);
        throw new HttpException('Invalid arriveTime', 400);
      }
      flight.arriveTime = arriveDate;
    }
    const { arriveTime, departTime, ...otherFields } = flightUpdatedto;
    Object.assign(flight, otherFields);

    const updatedFlight = await this.flightRepo.save(flight);
    this.logger.log(`Flight updated: ${id}`);
    return updatedFlight
  }

}
