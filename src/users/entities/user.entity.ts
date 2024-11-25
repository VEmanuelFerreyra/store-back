import { Exclude } from 'class-transformer';
import { Order } from 'src/orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true , nullable: false})
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
