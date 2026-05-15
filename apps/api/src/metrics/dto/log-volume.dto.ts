import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class LogVolumeDto {
  @ApiProperty({
    enum: ['minute', 'hour', 'day'],
    default: 'hour',
    required: false,
    example: 'hour',
  })
  @IsOptional()
  @IsIn(['minute', 'hour', 'day'])
  interval?: 'minute' | 'hour' | 'day';

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
