import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail) private readonly orderDetailRepository: Repository<OrderDetail>
  ){}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, products } = createOrderDto;

    //valido que el usuario exista
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if(!user) throw new NotFoundException('user not found');

    //creo una nueva orden
    const order = new Order();
    order.user = user;
    order.totalAmount = 0;
    order.status = 'pendinente';

    const newOrder = await this.orderRepository.save(order);

    //proceso los productos y creo los detalles de compra
    let totalAmount = 0;
    for (const item of products) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if(!product){
        throw new NotFoundException(`The product with id ${item.productId} not found`)
      }

      //validar stock
      if(product.quantity < item.quantity){
        throw new BadRequestException('insufficient stock')
      }

      //crear detalle de compra
      const orderDetail = new OrderDetail;
      orderDetail.order = newOrder;
      orderDetail.product = product;
      orderDetail.quantity = item.quantity;
      orderDetail.priceAtPurchase = product.price;
      await this.orderDetailRepository.save(orderDetail);

      //restar el stock del producto
      product.quantity -= item.quantity;
      await this.productRepository.save(product);

      //sumar al total de la orden
      totalAmount += product.price * item.quantity;
    }

    //actualizar el total de la orden
    newOrder.totalAmount = totalAmount;
    return this.orderRepository.save(newOrder);
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
