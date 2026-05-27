import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({
    type: String,
    description: 'The name of the API key',
    example: 'My API Key',
  })
  @IsString()
  name!: string;
}
