import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FlightService } from './flight.service';
import type { flightSearchDto } from './fightSearch.dto';
import type { cheapFlightDto } from './cheapFlight.dto';
import type { flightUpdateDto } from './flightUpdate.dto';



@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }

  @Get('/getAllFlights')
  getAllFlights(@Query() param: flightSearchDto) {
    if (Object.keys(param).length) {
      return this.flightService.flightSearch(param);
    } else {
      return this.flightService.getAllFlights();
    }

  }

  @Get('/getCheapFlight')
  getCheapFlightTime(@Query() param: cheapFlightDto) {
    if (Object.keys(param).length) {
      return this.flightService.searchCheapestFlightArrival(param);
    } else {
      return null;
    }

  }

  // @Get('/searchFlight')
  // searchFlight(@Query() param: flightSearchDto) {
  //   if (Object.keys(param).length) {
  //     return this.flightService.flightSearch(param);
  //   } else {
  //     return null;
  //   }
  // }



  @Get('/:id')
  getFlightById(@Param('id') id: string) {
    return this.flightService.getFlightById(id);
  }



  @Post()
  createFlight(
    @Body('name') name: string,
    @Body('startDestination') startDestination: string,
    @Body('endDestination') endDestination: string,
    @Body('locationType') locationType: string,
    @Body('departTime') departTime: string,
    @Body('arriveTime') arriveTime: string,
    @Body('price') price: number,
  ) {
    return this.flightService.createFlight(name, startDestination, endDestination, locationType, departTime, arriveTime, price)
  }



  @Put('/:id')
  updateFlight(
    @Param() id: string,
    @Body() updatedData: flightUpdateDto
  ) {
    const updatedFlight = this.flightService.updateFlight(id, updatedData);
    return updatedFlight
  }

  @Delete('/:id')
  deleteFlight(
    @Param() id: string
  ) {
    this.flightService.deleteFlight(id)
  }

}
