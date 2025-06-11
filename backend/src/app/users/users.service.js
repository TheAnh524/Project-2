import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const filter = search
      ? { name: { $regex: search, $options: 'i' } } // Tìm kiếm không phân biệt hoa thường
      : {};

    const [results, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data: plainToInstance(UserResponseDto, results, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new Error('Email already in use');
      }
      throw error;
    }
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
