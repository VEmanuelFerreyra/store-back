import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { Category } from './categories/entities/category.entity';
import { OrderDetail } from './order-details/entities/order-detail.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    UsersModule,
    CategoriesModule,
    OrdersModule,
    OrderDetailsModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Product, Order, Category, OrderDetail],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
