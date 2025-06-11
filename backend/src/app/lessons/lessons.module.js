import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schemas/lessons.schema';
import {
  VideoLecture,
  VideoLectureSchema,
} from './schemas/video-lecture.schema';
import {
  QuizExercise,
  QuizExerciseSchema,
} from './schemas/quiz-exercise.schema';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Lesson.name,
        useFactory: () => {
          const schema = LessonSchema;
          schema.discriminator(
            VideoLecture.name.toLowerCase(),
            VideoLectureSchema,
          );
          schema.discriminator(
            QuizExercise.name.toLowerCase(),
            QuizExerciseSchema,
          );
          return schema;
        },
      },
    ]),

    CommentsModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
