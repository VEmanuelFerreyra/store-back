import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { name, category, ...rest } = createProductDto;

    const productExist = await this.productRepository.findOne({ where: { name } });
    if (productExist) throw new ConflictException(`the product with the name ${name} already exists`);

    const categoryExist = await this.categoryRepository.findOne({ where: { id: category } });
    if (!categoryExist) throw new NotFoundException(`the category with id ${category} does not exist`);

    try {
      const newProduct = this.productRepository.create({
        ...rest,
        name,
        category: categoryExist
    })
      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the product.');
    }
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const productExist = await this.productRepository.findOneBy({id});
    if(!productExist) throw new NotFoundException(`the product with id ${id} does not exist`);
    return productExist;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
