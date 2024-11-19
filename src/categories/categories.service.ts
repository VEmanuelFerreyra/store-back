import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryExist = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (categoryExist) {
      throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists.`);
    }
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const categoryExist = await this.categoryRepository.findOneBy({ id })
    if (!categoryExist) throw new NotFoundException(`Category with ID ${id} does not exist.`);
    return categoryExist;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: updateCategoryDto.name },
    });
  
    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists.`);
    }
  
    const category = await this.findOne(id);
    const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);

    try {
      await this.categoryRepository.save(updatedCategory);
      return updatedCategory;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while updating the category.');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: `Category with ID ${id} has been removed.` };
  }
}
