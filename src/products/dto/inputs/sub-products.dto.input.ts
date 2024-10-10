import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, IsUrl } from 'class-validator';
import { StateImage } from 'src/products/enums/state-image.enum';

@InputType()
export class ImgProductsInput {
  @Field(() => String, { description: 'Url de la imagen del producto' })
  @IsUrl()
  url: string;
  @Field(() => String, {
    nullable: true,
    description: 'Descripcion de la imagen si llegara a tener',
  })
  @IsString()
  alt?: string;
  @Field(() => StateImage, { description: 'Estado de la imagen ' })
  @IsEnum(() => StateImage)
  state_image: StateImage;
}
