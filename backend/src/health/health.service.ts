import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  check() {
    const databaseConnected = this.connection.readyState === 1;

    return {
      success: databaseConnected,
      data: {
        api: 'ok',
        database: databaseConnected ? 'connected' : 'disconnected',
      },
    };
  }
}
