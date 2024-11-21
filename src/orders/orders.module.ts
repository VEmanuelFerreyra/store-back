import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { UsersModule } from 'src/users/users.module';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product, OrderDetail]),
    UsersModule
],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
