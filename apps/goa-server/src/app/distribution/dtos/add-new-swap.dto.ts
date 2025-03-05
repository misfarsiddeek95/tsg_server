import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewSwapDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: string;
  @IsNotEmpty()
  @IsNumber()
  currentTutorTspId: number;
  @IsNotEmpty()
  @IsString()
  swapType: string;
  @IsNotEmpty()
  @IsString()
  tempSwap: boolean;
  @IsNotEmpty()
  @IsString()
  reason: string;
}
