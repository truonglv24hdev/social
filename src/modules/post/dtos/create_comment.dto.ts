import { IsEmpty, IsString,  } from "class-validator";

export default class CreateCommentDto {
  @IsString()
  public text: string | undefined;
}