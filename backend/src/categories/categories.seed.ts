import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesSeed implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  async seedCategories() {
    const defaultCategories = [
      {
        name: 'Homme',
        slug: 'homme',
        image: 'https://images.unsplash.com/photo-1627476098709-f410bf2ae024?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJsYWNrbWFufGVufDB8fDB8fHww',
        color: '#3B82F6', // Bleu
      },
      {
        name: 'Femmes',
        slug: 'femmes',
        image: 'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
        color: '#EC4899', // Rose
      },
      {
        name: 'Enfants',
        slug: 'enfants',
        image: 'https://images.unsplash.com/photo-1507514217837-da7e39d37edd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJsYWNrJTIwa2lkfGVufDB8fDB8fHww',
        color: '#FBBF24', // Jaune
      },
      {
        name: 'Mixte',
        slug: 'mixte',
        image: 'https://images.unsplash.com/photo-1585144374720-64d181405b1c?q=80&w=1095&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: '#A78BFA', // Violet
      },
    ];

    for (const categoryData of defaultCategories) {
      const existingCategory = await this.categoryModel.findOne({
        slug: categoryData.slug,
      });

      if (!existingCategory) {
        await this.categoryModel.create(categoryData);
        console.log(`✓ Catégorie créée : ${categoryData.name} (${categoryData.slug})`);
      } else {
        // Mettre à jour la catégorie existante pour s'assurer qu'elle a les bonnes données
        await this.categoryModel.findOneAndUpdate(
          { slug: categoryData.slug },
          categoryData,
          { upsert: true },
        );
        console.log(`✓ La catégorie existe déjà : ${categoryData.name} (${categoryData.slug})`);
      }
    }

    console.log('✓ Ensemencement des catégories terminé');
  }
}

