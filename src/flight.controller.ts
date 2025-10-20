import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { FlightService } from './flight.service';

import { flightUpdateDto } from './DTO/flightUpdate.dto';
import { cheapFlightDto } from './DTO/cheapFlight.dto';
import { flightSearchDto } from './DTO/fightSearch.dto';
import { createFlightDto } from './DTO/createFlight.dto';


@Controller('flight')
export class FlightController {
  private readonly logger = new Logger(FlightController.name);
  constructor(private readonly flightService: FlightService) { }

  @Get()
  async getAllFlights(@Query() param: flightSearchDto) {
    this.logger.log(`GET /flight called with query: ${JSON.stringify(param)}`);
    try {
      if (Object.keys(param).length) {
        const flights = await this.flightService.flightSearch(param);
        this.logger.debug(`Found ${flights.length} flights matching query`);
        return flights;
      } else {
        const flights = await this.flightService.getAllFlights();
        this.logger.debug(`Returning all ${flights.length} flights`);
        return flights;
      }
    } catch (error) {
      this.logger.error('Error fetching flights', error.stack);
      throw new InternalServerErrorException('Failed to fetch flights');
    }
  }



  @Get('/:id')
  async getFlightById(@Param('id') id: string) {
    this.logger.log(`GET /flight/${id} called`);
    try {
      const flight = await this.flightService.getFlightById(id);
      this.logger.debug(`Found flight: ${JSON.stringify(flight)}`);
      return flight;
    } catch (error) {
      this.logger.error(`Error fetching flight with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch flight');
    }
  }

  @Post()
  async createFlight(@Body() dto: createFlightDto) {
    const { name, startDestination, endDestination, locationType, departTime, arriveTime, price } = dto;
    this.logger.log(`POST /flight called to create flight ${name} from ${startDestination} -> ${endDestination}`);
    try {
      const depart = new Date(departTime);
      const arrive = new Date(arriveTime);
      const flight = await this.flightService.createFlight(
        name,
        startDestination,
        endDestination,
        locationType,
        depart,
        arrive,
        price,
      );
      this.logger.debug(`Flight created with id: ${flight.id}`);
      return flight;
    } catch (error) {
      this.logger.error('Error creating flight', error.stack);
      throw new InternalServerErrorException('Failed to create flight');
    }
  }

  @Put('/:id')
  async updateFlight(
    @Param() id: string,
    @Body() updatedData: flightUpdateDto
  ) {
    this.logger.log(`PUT /flight/${id} called`);
    try {
      const updatedFlight = await this.flightService.updateFlight(id, updatedData);
      this.logger.debug(`Flight updated: ${JSON.stringify(updatedFlight)}`);
      return updatedFlight;
    } catch (error) {
      this.logger.error(`Error updating flight with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update flight');
    }
  }

  @Delete('/:id')
  async deleteFlight(
    @Param('id') id: string
  ) {
    this.logger.log(`DELETE /flight/${id} called`);
    try {
      await this.flightService.deleteFlight(id);
      this.logger.log(`Flight with id ${id} deleted successfully`);
      return { message: `Flight ${id} deleted` };
    } catch (error) {
      this.logger.error(`Error deleting flight with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete flight');
    }
  }
}
