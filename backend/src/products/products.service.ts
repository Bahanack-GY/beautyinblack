import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findAll(query: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    skinType?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.category) {
      filter.category = this.normalizeCategoryName(query.category);
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.skinType) {
      filter.skinTypes = { $in: [query.skinType] };
    }

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(query.search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products: products.map((p) => this.formatProduct(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBestSellers() {
    const products = await this.productModel
      .find()
      .sort({ salesCount: -1 })
      .limit(4)
      .exec();

    return {
      products: products.map((p) => this.formatProduct(p)),
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.formatProduct(product);
  }

  async findByCategory(categoryName: string, query: { skinType?: string; search?: string }) {
    // Normaliser le nom de catégorie pour correspondre aux catégories ensemencées
    const normalizedCategory = this.normalizeCategoryName(categoryName);
    const filter: any = { category: normalizedCategory };

    if (query.skinType) {
      filter.skinTypes = { $in: [query.skinType] };
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const products = await this.productModel
      .find(filter)
      .sort(query.search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .exec();

    return {
      products: products.map((p) => this.formatProduct(p)),
    };
  }

  /**
   * Normaliser le nom de catégorie pour correspondre aux catégories par défaut
   * Gère : homme, femmes/femme, enfants/enfant, mixte
   * Les catégories stockées sont au singulier : 'Homme', 'Femme', 'Enfant', 'Mixte'
   */
  private normalizeCategoryName(categoryName: string): string {
    const normalized = categoryName.toLowerCase().trim();
    
    // Mapper les variations aux noms standards (singulier, comme défini dans le schéma)
    const categoryMap: { [key: string]: string } = {
      'homme': 'Homme',
      'femme': 'Femme',
      'femmes': 'Femme',  // Normaliser au singulier
      'enfant': 'Enfant',
      'enfants': 'Enfant',  // Normaliser au singulier
      'mixte': 'Mixte',
    };

    return categoryMap[normalized] || categoryName; // Retourner l'original si non trouvé
  }

  async search(query: { q: string; category?: string }) {
    const filter: any = {
      $text: { $search: query.q },
    };

    if (query.category) {
      filter.category = this.normalizeCategoryName(query.category);
    }

    const products = await this.productModel
      .find(filter)
      .sort({ score: { $meta: 'textScore' } })
      .exec();

    return {
      products: products.map((p) => this.formatProduct(p)),
    };
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productModel.create(createProductDto);
      return this.formatProduct(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, updateProductDto: CreateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.formatProduct(product);
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'Product deleted successfully',
      id: id,
    };
  }

  async bulkUpdate(updates: any[]) {
    const promises = updates.map((update) =>
      this.productModel.findByIdAndUpdate(update.id, update.data, { new: true }),
    );
    const products = await Promise.all(promises);
    const validProducts = products.filter((p) => p !== null) as ProductDocument[];
    return {
      message: 'Products updated successfully',
      products: validProducts.map((p) => this.formatProduct(p)),
    };
  }

  async bulkDelete(ids: string[]) {
    await this.productModel.deleteMany({ _id: { $in: ids } });
    return {
      message: 'Products deleted successfully',
      count: ids.length,
    };
  }

  private formatProduct(product: ProductDocument) {
    const productObj = product.toObject();
    return {
      id: productObj._id,
      name: productObj.name,
      description: productObj.description,
      price: this.formatPrice(productObj.price),
      priceNumber: productObj.price,
      category: productObj.category,
      sizes: productObj.sizes,
      image: productObj.image,
      images: productObj.images,
      rating: productObj.rating,
      deliveryInfo: productObj.deliveryInfo,
    };
  }

  private formatPrice(price: number): string {
    // Formater le prix en chaîne (ex: "5 000")
    // Le prix est stocké en centimes, on le convertit en unités
    // Le frontend ajoute le symbole FCFA
    const priceInUnits = Math.round(price / 100);
    return priceInUnits.toLocaleString('fr-FR');
  }

  async getProductAnalytics(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productObjectId = new Types.ObjectId(productId);
    
    // Obtenir toutes les commandes contenant ce produit
    const orders = await this.orderModel.find({
      'items.productId': productObjectId,
      status: { $ne: 'annule' }, // Exclure les commandes annulées
    }).exec();

    // Calculer les données de ventes mensuelles (6 derniers mois)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyData: { [key: string]: { sales: number; revenue: number } } = {};
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Initialiser les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]}`;
      monthlyData[key] = { sales: 0, revenue: 0 };
    }

    // Calculer la distribution par taille
    const sizeDistribution: { [key: string]: number } = {};
    let totalSales = 0;
    let totalRevenue = 0;

    orders.forEach((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      const orderDate = new Date((orderObj as any).createdAt || (orderObj as any).createdAt);
      if (orderDate >= sixMonthsAgo) {
        const monthKey = `${monthNames[orderDate.getMonth()]}`;
        
        order.items.forEach((item) => {
          if (item.productId.toString() === productId) {
            const quantity = item.quantity || 1;
            const revenue = (item.price || 0) * quantity;
            
            monthlyData[monthKey].sales += quantity;
            monthlyData[monthKey].revenue += revenue;
            
            totalSales += quantity;
            totalRevenue += revenue;
            
            // Suivre la distribution par taille
            const size = item.size || 'N/A';
            sizeDistribution[size] = (sizeDistribution[size] || 0) + quantity;
          }
        });
      }
    });

    // Formater les données mensuelles pour le graphique
    const salesData = Object.keys(monthlyData).map((month) => ({
      month,
      sales: monthlyData[month].sales,
      revenue: Math.round(monthlyData[month].revenue),
    }));

    // Formater la distribution par taille
    const sizeDistributionData = Object.keys(sizeDistribution).map((size) => {
      const sales = sizeDistribution[size];
      return {
        size,
        sales,
        percentage: totalSales > 0 ? Math.round((sales / totalSales) * 100) : 0,
      };
    });

    // Calculer la croissance (comparer le dernier mois au mois précédent)
    const months = Object.keys(monthlyData);
    const lastMonthSales = monthlyData[months[months.length - 1]]?.sales || 0;
    const prevMonthSales = monthlyData[months[months.length - 2]]?.sales || 0;
    const growth = prevMonthSales > 0 
      ? ((lastMonthSales - prevMonthSales) / prevMonthSales) * 100 
      : 0;

    return {
      totalSales,
      totalRevenue: Math.round(totalRevenue),
      averageRating: product.rating || 4.5,
      growth: Math.round(growth * 10) / 10,
      salesData,
      sizeDistribution: sizeDistributionData,
    };
  }
}

