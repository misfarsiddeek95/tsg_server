import { ApiProperty } from '@nestjs/swagger';

export class emailResponseDto201 {
  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;
  @ApiProperty({
    type: 'string',
    example: 'Email sent successfully'
  })
  'message': string;
}

export class emailResponseDto400 {
  @ApiProperty({
    type: Boolean,
    example: false
  })
  'success': string;
  @ApiProperty({
    type: 'string',
    example: 'Failed to send email'
  })
  'message': string;
}
