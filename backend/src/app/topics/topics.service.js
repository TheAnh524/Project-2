// src/app/topics/topics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const newTopic = new this.topicModel(createTopicDto);
    return newTopic.save();
  }

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().exec();
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException(`Không tìm thấy topic với id: ${id}`);
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const updatedTopic = await this.topicModel
      .findByIdAndUpdate(id, updateTopicDto, {
        new: true, // Trả về bản ghi sau khi update
      })
      .exec();

    if (!updatedTopic) {
      throw new NotFoundException(
        `Không tìm thấy topic để cập nhật với id: ${id}`,
      );
    }

    return updatedTopic;
  }

  async remove(id: string): Promise<void> {
    const result = await this.topicModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Không tìm thấy topic để xoá với id: ${id}`);
    }
  }
}
