import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
export default class AddExperienceDto{
  @IsOptional()
  @IsString()
  title?: string | undefined;

  @IsOptional()
  @IsString()
  company?: string | undefined;

  @IsOptional()
  @IsString()
  location?: string | undefined;

  @IsOptional()
  @IsString()
  from?: Date | undefined;

  @IsOptional()
  @IsString()
  to?: Date | undefined;

  @IsOptional()
  @IsBoolean()
  current?: boolean | undefined;

  @IsOptional()
  @IsString()
  description?: string | undefined;
}
