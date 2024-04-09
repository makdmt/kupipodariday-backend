import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
.setTitle('Wishlists service')
.setDescription('Service for gift lovers. After login you can post your wishlist and donate for gifts for other users')
.setVersion('1.0.0')
.build();
