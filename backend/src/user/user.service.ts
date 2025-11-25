import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Address, AddressDocument } from './schemas/address.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userObj = user.toObject();
    return {
      id: userObj._id.toString(),
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone,
      profileImage: userObj.profileImage,
      membershipType: userObj.membershipType,
      emailVerified: userObj.emailVerified,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateProfileDto },
      { new: true },
    ).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    };
  }

  async getAddresses(userId: string) {
    const addresses = await this.addressModel.find({
      userId: new Types.ObjectId(userId),
    });

    return {
      addresses: addresses.map((addr) => ({
        id: addr._id.toString(),
        street: addr.street,
        city: addr.city,
        country: addr.country,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
        fullAddress: `${addr.street}, ${addr.city}, ${addr.country}`,
      })),
    };
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    // Si celle-ci est définie comme par défaut, désactiver les autres par défaut
    if (createAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId) },
        { $set: { isDefault: false } },
      );
    }

    const address = await this.addressModel.create({
      userId: new Types.ObjectId(userId),
      ...createAddressDto,
    });

    return {
      message: 'Address added successfully',
      address: {
        id: address._id.toString(),
        street: address.street,
        city: address.city,
        fullAddress: `${address.street}, ${address.city}, ${address.country}`,
      },
    };
  }

  async updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressModel.findOne({
      _id: addressId,
      userId: new Types.ObjectId(userId),
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Si définir comme par défaut, désactiver les autres par défaut
    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId), _id: { $ne: addressId } },
        { $set: { isDefault: false } },
      );
    }

    Object.assign(address, updateAddressDto);
    await address.save();

    return { message: 'Address updated successfully' };
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.addressModel.findOneAndDelete({
      _id: addressId,
      userId: new Types.ObjectId(userId),
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return { message: 'Address deleted successfully' };
  }

  // Méthodes admin
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.role) {
      filter.role = query.role;
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        membershipType: u.membershipType,
        registrationDate: (u as any).createdAt?.toISOString(),
        status: u.emailVerified ? 'active' : 'pending',
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats() {
    const total = await this.userModel.countDocuments();
    const premium = await this.userModel.countDocuments({ membershipType: 'premium' });
    const regular = await this.userModel.countDocuments({ membershipType: 'regular' });
    
    return {
      total,
      premium,
      regular,
      active: await this.userModel.countDocuments({ emailVerified: true }),
    };
  }

  async remove(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Supprimer aussi les adresses de l'utilisateur
    await this.addressModel.deleteMany({ userId: new Types.ObjectId(userId) });

    return {
      message: 'User deleted successfully',
      id: userId,
    };
  }
}

