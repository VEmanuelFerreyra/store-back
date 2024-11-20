import { Order } from 'src/orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  confirmPassword: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
