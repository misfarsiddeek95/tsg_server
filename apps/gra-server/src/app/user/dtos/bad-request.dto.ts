import { ApiProperty } from '@nestjs/swagger';

export class Unauthorized401Dto {
  @ApiProperty({
    type: Number,
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    example: 'Unauthorized'
  })
  message: string;
}

export class BadRequest400Dto {
  @ApiProperty({
    type: Number,
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: [String],
    example: [
      'skip must be a number conforming to the specified constraints',
      'take must be a number conforming to the specified constraints'
    ]
  })
  message: string[];

  @ApiProperty({ type: String, example: 'Bad Request' })
  error: string;
}

export class Exception400Dto {
  @ApiProperty({
    type: Boolean,
    example: false
  })
  success: boolean;

  @ApiProperty({
    type: String,
    example: "Cannot read property 'tspId' of null"
  })
  error: string;
}

export class Forbidden403Dto {
  @ApiProperty({
    type: Number,
    example: 403
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    example: 'Forbidden resource'
  })
  message: string;

  @ApiProperty({ type: String, example: 'Forbidden' })
  error: string;
}
