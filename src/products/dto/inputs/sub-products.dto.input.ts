import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, IsUrl } from 'class-validator';
import { StateImage } from 'src/products/enums/state-image.enum';

@InputType()
export class ImgProductsInput {
  @Field(() => String)
  @IsUrl()
  url: string;
  @Field(() => String, { nullable: true })
  @IsString()
  alt?: string;
  @Field(() => StateImage)
  @IsEnum(() => StateImage)
  state_image: StateImage;
}
