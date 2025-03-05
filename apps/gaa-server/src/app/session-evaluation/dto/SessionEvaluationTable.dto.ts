import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEvaluationDto {
  @IsNotEmpty()
  @IsNumber()
  tutorId: number;

  @IsNumber()
  templateId: number;

  @IsNumber()
  createdBy: number;

  @IsNumber()
  updatedBy: number;
}

export class UpdateSessionStatusDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsNumber()
  evaluationId: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;

}

export class DeleteSessionStatusDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsNumber()
  evaluationId: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  abandonReason: string;
}
