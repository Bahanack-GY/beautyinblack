import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders/schemas/order.schema';
import { Product, ProductDocument } from './products/schemas/product.schema';
import { User, UserDocument } from './auth/schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDashboardStats() {
    // Obtenir la date actuelle et la date d'il y a 6 mois
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Obtenir toutes les commandes (non annulées)
    const orders = await this.orderModel.find({
      status: { $ne: 'annule' },
      createdAt: { $gte: sixMonthsAgo },
    }).sort({ createdAt: 1 });

    // Calculer le total des ventes
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    // Obtenir les totaux
    const totalOrders = orders.length;
    const totalProducts = await this.productModel.countDocuments();
    const totalUsers = await this.userModel.countDocuments();

    // Calculer le mois précédent pour comparaison (approximation simple)
    const previousMonthOrders = orders.filter((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      const orderDate = new Date((orderObj as any).createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return orderDate < lastMonth;
    }).length;
    
    const currentMonthOrders = totalOrders - previousMonthOrders;
    const ordersChange = previousMonthOrders > 0 
      ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100 
      : 0;

    // Générer les données de ventes par mois
    const salesByMonth = this.generateMonthlySalesData(orders);

    // Obtenir la distribution par catégorie
    const categoryDistribution = await this.getCategoryDistribution();

    // Obtenir les commandes récentes (5 dernières)
    const recentOrders = await this.orderModel
      .find({ status: { $ne: 'annule' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name');

    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order._id.toString(),
      customer: (order.userId as any)?.name || 'Unknown',
      product: order.items[0]?.name || 'Multiple items',
      status: this.getStatusText(order.status),
      amount: this.formatPrice(order.total),
    }));

    // Obtenir les produits à stock faible (en supposant que le champ stock existe)
    const lowStockProducts = await this.productModel
      .find({ stock: { $lt: 10, $gt: 0 } })
      .sort({ stock: 1 })
      .limit(5)
      .select('name stock');

    const formattedLowStock = lowStockProducts.map((product) => ({
      name: product.name,
      stock: (product as any).stock || 0,
    }));

    return {
      stats: {
        totalSales: this.formatPrice(totalSales),
        totalSalesNumber: totalSales,
        salesChange: 12.5, // Simplifié pour l'instant
        totalOrders,
        ordersChange: Math.round(ordersChange * 10) / 10,
        totalProducts,
        productsChange: 3.1, // Simplifié
        totalUsers,
        usersChange: 15.3, // Simplifié
      },
      salesData: salesByMonth,
      categoryData: categoryDistribution,
      recentOrders: formattedRecentOrders,
      lowStockProducts: formattedLowStock,
    };
  }

  private generateMonthlySalesData(orders: OrderDocument[]) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const salesData: Array<{ month: string; sales: number; orders: number }> = [];

    // Générer les données pour les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthOrders = orders.filter((order) => {
        const orderObj = order.toObject ? order.toObject() : order;
        const orderDate = new Date((orderObj as any).createdAt);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });

      const sales = monthOrders.reduce((sum, order) => sum + order.total, 0);

      salesData.push({
        month: monthNames[date.getMonth()],
        sales: Math.round(sales / 100), // Convertir en unité monétaire principale
        orders: monthOrders.length,
      });
    }

    return salesData;
  }

  private async getCategoryDistribution() {
    const products = await this.productModel.find();
    const categories = {
      Homme: 0,
      Femme: 0,
      Enfant: 0,
      Mixte: 0,
    };

    products.forEach((product) => {
      if (categories[product.category] !== undefined) {
        categories[product.category]++;
      }
    });

    return [
      { name: 'Homme', value: categories.Homme, color: '#8b5cf6' },
      { name: 'Femme', value: categories.Femme, color: '#ec4899' },
      { name: 'Enfant', value: categories.Enfant, color: '#f59e0b' },
      { name: 'Mixte', value: categories.Mixte, color: '#10b981' },
    ];
  }

  private getStatusText(status: string): string {
    const statusMap = {
      en_cours: 'En traitement',
      livraison: 'Expédié',
      livre: 'Livré',
      annule: 'Annulé',
    };
    return statusMap[status] || status;
  }

  private formatPrice(price: number): string {
    return `$${(price / 100).toFixed(2)}`;
  }

  async getAnalytics() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Obtenir toutes les commandes (non annulées)
    const allOrders = await this.orderModel.find({
      status: { $ne: 'annule' },
    }).sort({ createdAt: 1 });

    // Commandes du mois actuel
    const currentMonthOrders = allOrders.filter((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      const orderDate = new Date((orderObj as any).createdAt || (orderObj as any).createdAt);
      return orderDate >= currentMonthStart;
    });

    // Commandes du mois précédent
    const previousMonthOrders = allOrders.filter((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      const orderDate = new Date((orderObj as any).createdAt || (orderObj as any).createdAt);
      return orderDate >= previousMonthStart && orderDate <= previousMonthEnd;
    });

    // Calculer les métriques du mois actuel
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const currentMonthOrderCount = currentMonthOrders.length;
    const currentMonthProductsSold = currentMonthOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0);
    }, 0);

    // Calculer les métriques du mois précédent
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const previousMonthOrderCount = previousMonthOrders.length;
    const previousMonthProductsSold = previousMonthOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0);
    }, 0);

    // Calculer les changements
    const revenueChange = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;
    const ordersChange = previousMonthOrderCount > 0
      ? ((currentMonthOrderCount - previousMonthOrderCount) / previousMonthOrderCount) * 100
      : 0;
    const productsChange = previousMonthProductsSold > 0
      ? ((currentMonthProductsSold - previousMonthProductsSold) / previousMonthProductsSold) * 100
      : 0;

    // Obtenir les nouveaux utilisateurs ce mois-ci
    const currentMonthUsers = await this.userModel.countDocuments({
      createdAt: { $gte: currentMonthStart },
    });
    const previousMonthUsers = await this.userModel.countDocuments({
      createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
    });
    const usersChange = previousMonthUsers > 0
      ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100
      : 0;

    // Générer la tendance des ventes hebdomadaires (7 dernières semaines)
    const salesTrend = this.generateWeeklySalesTrend(allOrders);

    // Obtenir la performance par catégorie
    const categoryPerformance = await this.getCategoryPerformance(allOrders);

    // Obtenir les meilleurs produits
    const topProducts = await this.getTopProducts(allOrders);

    return {
      metrics: {
        revenue: {
          value: currentMonthRevenue,
          change: Math.round(revenueChange * 10) / 10,
        },
        orders: {
          value: currentMonthOrderCount,
          change: Math.round(ordersChange * 10) / 10,
        },
        newUsers: {
          value: currentMonthUsers,
          change: Math.round(usersChange * 10) / 10,
        },
        productsSold: {
          value: currentMonthProductsSold,
          change: Math.round(productsChange * 10) / 10,
        },
      },
      salesTrend,
      categoryPerformance,
      topProducts,
    };
  }

  private generateWeeklySalesTrend(orders: OrderDocument[]): Array<{ date: string; revenue: number; orders: number }> {
    const now = new Date();
    const trend: Array<{ date: string; revenue: number; orders: number }> = [];
    
    // Générer les 7 dernières semaines
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekOrders = orders.filter((order) => {
        const orderObj = order.toObject ? order.toObject() : order;
        const orderDate = new Date((orderObj as any).createdAt || (orderObj as any).createdAt);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });

      const revenue = weekOrders.reduce((sum, order) => sum + order.total, 0);
      const orderCount = weekOrders.length;

      // Formater la date comme "Jan 1", "Jan 8", etc.
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const dateStr = `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()}`;

      trend.push({
        date: dateStr,
        revenue: Math.round(revenue),
        orders: orderCount,
      });
    }

    return trend;
  }

  private async getCategoryPerformance(orders: OrderDocument[]) {
    const categoryMap: { [key: string]: { sales: number; orders: number } } = {
      'Homme': { sales: 0, orders: 0 },
      'Femmes': { sales: 0, orders: 0 },
      'Femme': { sales: 0, orders: 0 },
      'Enfant': { sales: 0, orders: 0 },
      'Enfants': { sales: 0, orders: 0 },
      'Mixte': { sales: 0, orders: 0 },
    };

    // Obtenir tous les produits pour mapper productId à catégorie
    const products = await this.productModel.find().select('_id category');
    const productCategoryMap = new Map();
    products.forEach((product) => {
      productCategoryMap.set(product._id.toString(), product.category);
    });

    // Traiter les commandes
    orders.forEach((order) => {
      const orderCategories = new Set<string>();
      let orderRevenue = 0;

      order.items.forEach((item) => {
        const productId = item.productId.toString();
        const category = productCategoryMap.get(productId);
        
        if (category) {
          // Normaliser les noms de catégories
          let normalizedCategory = category;
          if (category === 'Femme') normalizedCategory = 'Femmes';
          if (category === 'Enfant') normalizedCategory = 'Enfants';
          
          orderCategories.add(normalizedCategory);
          orderRevenue += (item.price || 0) * (item.quantity || 1);
        }
      });

      // Distribuer le revenu de la commande entre les catégories
      const revenuePerCategory = orderCategories.size > 0 ? orderRevenue / orderCategories.size : 0;
      
      orderCategories.forEach((category) => {
        if (categoryMap[category]) {
          categoryMap[category].sales += revenuePerCategory;
          categoryMap[category].orders += 1 / orderCategories.size; // Distribuer le nombre de commandes
        }
      });
    });

    // Formater et normaliser
    return [
      {
        category: 'Homme',
        sales: Math.round(categoryMap['Homme']?.sales || 0),
        orders: Math.round(categoryMap['Homme']?.orders || 0),
      },
      {
        category: 'Femme',
        sales: Math.round((categoryMap['Femmes']?.sales || 0) + (categoryMap['Femme']?.sales || 0)),
        orders: Math.round((categoryMap['Femmes']?.orders || 0) + (categoryMap['Femme']?.orders || 0)),
      },
      {
        category: 'Enfants',
        sales: Math.round((categoryMap['Enfants']?.sales || 0) + (categoryMap['Enfant']?.sales || 0)),
        orders: Math.round((categoryMap['Enfants']?.orders || 0) + (categoryMap['Enfant']?.orders || 0)),
      },
      {
        category: 'Mixte',
        sales: Math.round(categoryMap['Mixte']?.sales || 0),
        orders: Math.round(categoryMap['Mixte']?.orders || 0),
      },
    ];
  }

  private async getTopProducts(orders: OrderDocument[]) {
    const productSalesMap = new Map<string, { name: string; sales: number; units: number }>();

    // Obtenir tous les produits pour les noms
    const products = await this.productModel.find().select('_id name');
    const productNameMap = new Map();
    products.forEach((product) => {
      productNameMap.set(product._id.toString(), product.name);
    });

    // Traiter les commandes
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId.toString();
        const productName = productNameMap.get(productId) || item.name || 'Unknown Product';
        const quantity = item.quantity || 1;
        const revenue = (item.price || 0) * quantity;

        if (productSalesMap.has(productId)) {
          const existing = productSalesMap.get(productId);
          if (existing) {
            existing.sales += revenue;
            existing.units += quantity;
          }
        } else {
          productSalesMap.set(productId, {
            name: productName,
            sales: revenue,
            units: quantity,
          });
        }
      });
    });

    // Convertir en tableau, trier par ventes et prendre le top 5
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((product) => ({
        name: product.name,
        sales: Math.round(product.sales),
        units: product.units,
      }));

    return topProducts;
  }
}
