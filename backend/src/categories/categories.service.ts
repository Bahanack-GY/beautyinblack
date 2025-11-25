import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll() {
    const categories = await this.categoryModel.find().exec();
    return {
      categories: categories.map((cat) => this.formatCategory(cat)),
    };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.formatCategory(category);
  }

  async create(createCategoryDto: any) {
    const category = await this.categoryModel.create(createCategoryDto);
    return this.formatCategory(category);
  }

  async update(id: string, updateCategoryDto: any) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.formatCategory(category);
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      message: 'Category deleted successfully',
      id: id,
    };
  }

  private formatCategory(category: CategoryDocument) {
    const catObj = category.toObject();
    return {
      id: catObj._id.toString(),
      name: catObj.name,
      slug: catObj.slug,
      image: catObj.image,
      color: catObj.color,
    };
  }
}

