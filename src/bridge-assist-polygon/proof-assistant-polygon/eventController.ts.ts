import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { EventListenerService } from './eventListenerService';

@Controller('events')
export class EventListenerController {
  constructor(private readonly eventListenerService: EventListenerService) {}

  @Get('transactions')
  getTransactionsByAddress(@Query('address') address: string): any {
    console.log('TEST');

    const transaction =
      this.eventListenerService.getTransactionsByAddress(address);

    if (transaction) {
      console.log(`Sending back: ${JSON.stringify(transaction)}`);
      return transaction;
    } else {
      throw new NotFoundException(
        `No transaction found for address ${address}`,
      );
    }
  }
}
