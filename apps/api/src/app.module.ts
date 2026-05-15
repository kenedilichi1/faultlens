import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { LogsModule } from './logs/logs.module';
import { IncidentsModule } from './incidents/incidents.module';
import { QueueModule } from './queue/queue.module';
import { RealtimeModule } from './realtime/realtime.module';
import { MetricsModule } from './metrics/metrics.module';
import { DashboardModule } from './dashboard/dashboard.module';
import configuration from './common/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: () => crypto.randomUUID(),
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    PrismaModule,
    HealthModule,
    LogsModule,
    IncidentsModule,
    QueueModule,
    RealtimeModule,
    MetricsModule,
    DashboardModule,
  ],
})
export class AppModule {}
