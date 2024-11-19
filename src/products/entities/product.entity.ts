import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
