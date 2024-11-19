import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';


@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column()
  quantity: number;

  @Column()
  priceAtPurchase: number;
}
