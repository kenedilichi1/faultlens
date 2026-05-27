import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    type: String,
    description: 'The name of the project',
    example: 'My Awesome Project',
  })
  @IsString()
  @MinLength(2)
  name: string;
}
