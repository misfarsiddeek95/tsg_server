import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReadSessionEvaluationDatumDto {
  @IsNotEmpty()
  @IsNumber()
  evaluationId: number;

  @IsNotEmpty()
  @IsNumber()
  tutorId: number;

  @IsNotEmpty()
  type: string;

  @IsString()
  tutorCentre: string;
}
export class ReadSessionEvaluationDatumDto {
  @IsNotEmpty()
  @IsNumber()
  tutorId: number;
}
