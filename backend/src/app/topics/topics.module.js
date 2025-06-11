import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Topic.name,
        schema: TopicSchema,
      },
    ]),
    LessonsModule,
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
