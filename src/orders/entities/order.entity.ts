import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}