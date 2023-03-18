import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Offer } from './dtos/offer.dto';
import { QueryOffer } from './dtos/queryoffer.dto';
import { QueryHistoricalOffers } from './dtos/queryhistoffers.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /*
  Params: 
    stateid: 
      - For US, refer to https://www.sinfin.net/railways/world/usa/stateids.html plus the following regions.
          Region: (ENC) East North Central
          Region: (ESC) East South Central
          Region: (MAT) Middle Atlantic
          Region: (MTN) Mountain
          Region: (NEW) New England
          Region: (PACC) Pacific Contiguous
          Region: (PACN) Pacific Noncontiguous
          Region: (SAT) South Atlantic
          Region: (WNC) West North Central
          Region: (WSC) West South Central
          Total: (US) United States (not including territory data)
      - For CA, refer to https://www150.statcan.gc.ca/n1/pub/92-195-x/2011001/geo/prov/tbl/tbl8-eng.htm. Now only AB supported. 
  */
  @Get('/queryprice/:stateid')
  async queryRealtimeElectricityPrice(@Param('stateid') stateid: string) {
    let price: number = 0;
    switch (stateid) {
      case 'AB':
        price = await this.appService.queryCAElectricityPrice();
        break;
      default:
        price = await this.appService.queryUSElectricityPrice(stateid);
    }
    return price;
  }

  @Post('/storeoffer')
  async storeOffer(@Body() offer: Offer) {
    await this.appService.storeOffer(offer);
  }

  @Get('/searchoffers')
  async searchListingOffers(@Body() queryoffer: QueryOffer) {
    const offerRecords = await this.appService.searchListingOffers(queryoffer);
    return offerRecords;
  }

  @Get('/queryhistoricaloffers')
  async queryHistoricalOffers(@Body() queryhistoffer: QueryHistoricalOffers) {
    const historicalOfferRecords = await this.appService.searchHistoricalOffers(
      queryhistoffer,
    );
    return historicalOfferRecords;
  }
}
