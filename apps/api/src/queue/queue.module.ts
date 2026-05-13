import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port') || 6379,
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: 'log-processing',
    }),
  ],
  exports: [BullModule],
  controllers: [QueueController],
})
export class QueueModule {}
