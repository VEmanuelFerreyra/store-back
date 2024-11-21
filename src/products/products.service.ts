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
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
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

  async findOne(id: number):Promise<Product> {
    const productExist = await this.productRepository.findOneBy({id});
    if(!productExist) throw new NotFoundException(`the product with id ${id} does not exist`);
    return productExist;
  }

  async update(id: number, updateProductDto: UpdateProductDto):Promise<Product> {
    const {category, ...rest} = updateProductDto;

    //verifico que el producto no tenga un nombre que ya este en otro producto
    const existingProduct = await this.productRepository.findOne({where: {name: updateProductDto.name}});
    if(existingProduct && existingProduct.id !== id) throw new ConflictException('the product name is already exist');
    
    //verifico si existe el producto que se desea modificar y lo modifico
    const product = await this.findOne(id);

    const categoryObject = await this.categoryRepository.findOne({ where: { id: updateProductDto.category } });

    if(!categoryObject) throw new NotFoundException(`the category with id ${updateProductDto.category} does not exist`)

    const updatedProduct = {
      category: categoryObject,
      ...rest
    }

    const finalProduct = this.productRepository.merge(product, updatedProduct);

    try {
      return this.productRepository.save(finalProduct)
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while updating the product')
    }
  }

  async remove(id: number):Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `Product with ID ${id} has been removed.` };
  }
}
