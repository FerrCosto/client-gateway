import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PriceProductInput {
  @Field(() => String, { description: 'Valor minimo ', nullable: true })
  @IsString()
  @IsOptional()
  min?: string;
  @Field(() => String, { description: 'Valor maximo ', nullable: true })
  @IsString()
  @IsOptional()
  max?: string;
}
