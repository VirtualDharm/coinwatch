// src/modules/price-tracker/price-tracker.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import axios from 'axios';

@Injectable()
export class PriceTrackerService {
  private readonly logger = new Logger(PriceTrackerService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  // Fetches prices of Ethereum and Polygon
  async fetchPrices() {
    this.logger.log('Fetching prices...');
    const ethereumPrice = await this.getEthereumPrice();
    const polygonPrice = await this.getPolygonPrice();

    await this.savePrice('Ethereum', ethereumPrice);
    await this.savePrice('Polygon', polygonPrice);
  }

  // Gets the current price of Ethereum
  async getEthereumPrice() {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    );
    return response.data.ethereum.usd;
  }

  // Gets the current price of Polygon (MATIC)
  async getPolygonPrice() {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd',
    );
    return response.data['matic-network'].usd;
  }

  // Saves the price to the database
  private async savePrice(chain: string, price: number) {
    await this.connection.query(
      `INSERT INTO price (chain, price) VALUES ($1, $2)`,
      [chain, price],
    );
    this.logger.log(`Saved price for ${chain}: ${price}`);
  }

  // Retrieves hourly prices for the last 100 hours
  async getHourlyPrices(chain: string) {
    const query = `
      SELECT date_trunc('hour', timestamp) as hour, AVG(price) as average_price
      FROM price
      WHERE chain = $1 AND timestamp >= NOW() - INTERVAL '1000 HOURS'
      GROUP BY hour
      ORDER BY hour ASC
    `;
  
    const prices = await this.connection.query(query, [chain]);
    return prices;
  }

  // Checks if the price has increased by more than 3% in the last hour
  async checkPriceIncrease(chain: string, currentPrice: number) {
    const oneHourAgoPriceResult = await this.connection.query(
      `SELECT price FROM price 
       WHERE chain = $1 
       AND timestamp <= NOW() - INTERVAL '1 HOUR'
       ORDER BY timestamp DESC LIMIT 1`,
      [chain],
    );

    if (oneHourAgoPriceResult.length > 0) {
      const oneHourAgoPrice = oneHourAgoPriceResult[0].price;
      const increasePercentage =
        ((currentPrice - oneHourAgoPrice) / oneHourAgoPrice) * 100;

      if (increasePercentage > 3) {
        this.logger.log(
          `${chain} price increased by more than 3% in the last hour.`,
        );
        return true;
      }
    }
    return false;
  }
}