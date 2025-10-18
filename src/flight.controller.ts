import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { FlightService } from './flight.service';

import type { flightUpdateDto } from './flightUpdate.dto';
import type { cheapFlightDto } from './cheapFlight.dto';
import type { flightSearchDto } from './fightSearch.dto';


@Controller('flight')
export class FlightController {
  private readonly logger = new Logger(FlightController.name);
  constructor(private readonly flightService: FlightService) { }

  @Get()
  async getAllFlights(@Query() param: flightSearchDto) {
    this.logger.log(`GET /flight called with query: ${JSON.stringify(param)}`);

      if (Object.keys(param).length) {
        const flights = await this.flightService.flightSearch(param);
        this.logger.debug(`Found ${flights.length} flights matching query`);
        return flights;
      } else {
        const flights = await this.flightService.getAllFlights();
        this.logger.debug(`Returning all ${flights.length} flights`);
        return flights;
      }


  }

  @Get('/getCheapFlight')
  async getCheapFlightTime(@Query() param: cheapFlightDto) {
    this.logger.log(`GET /flight/getCheapFlight called with query: ${JSON.stringify(param)}`);
    try {
      if (Object.keys(param).length) {
        return this.flightService.searchCheapestFlightArrival(param);
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('Error fetching cheapest flight', error.stack);
      throw new InternalServerErrorException('Failed to fetch cheapest flight');
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
      throw new InternalServerErrorException(`Failed to fetch flight with id ${id}`);
    }
  }

  @Post()
  async createFlight(
    @Body('name') name: string,
    @Body('startDestination') startDestination: string,
    @Body('endDestination') endDestination: string,
    @Body('locationType') locationType: string,
    @Body('departTime') departTime: string,
    @Body('arriveTime') arriveTime: string,
    @Body('price') price: number,
  ) {
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
      throw new InternalServerErrorException(`Failed to update flight with id ${id}`);
    }
  }

  @Delete('/:id')
  async deleteFlight(
    @Param() id: string
  ) {
    this.logger.log(`DELETE /flight/${id} called`);
    try {
      await this.flightService.deleteFlight(id);
      this.logger.log(`Flight with id ${id} deleted successfully`);
      return { message: `Flight ${id} deleted` };
    } catch (error) {
      this.logger.error(`Error deleting flight with id ${id}`, error.stack);
      throw new InternalServerErrorException(`Failed to delete flight with id ${id}`);
    }
  }

}
