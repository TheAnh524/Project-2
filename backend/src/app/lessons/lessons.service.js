import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Lesson } from './schemas/lessons.schema';
import {
  CreateQuizExerciseDto,
  CreateVideoLectureDto,
} from './dto/create-lesson.dto';
import { LessonType } from './enums/lesson-type.enum';
import { QuizExercise } from './schemas/quiz-exercise.schema';
import { VideoLecture } from './schemas/video-lecture.schema';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
  ) {}

  async createQuizExercise(dto: CreateQuizExerciseDto): Promise<QuizExercise> {
    const QuizExerciseModel =
      this.lessonModel.discriminators?.[QuizExercise.name.toLowerCase()];
    if (!QuizExerciseModel) throw new Error('QuizExercise model not defined');

    const latestLesson = await this.lessonModel
      .findOne({ topic: dto.topic })
      .sort({ number: -1 })
      .exec();

    const quiz = new QuizExerciseModel({
      ...dto,
      type: LessonType.QuizExercise,
      number: latestLesson ? latestLesson.number + 1 : 1,
    });
    return quiz.save();
  }

  async createVideoLecture(dto: CreateVideoLectureDto): Promise<VideoLecture> {
    const VideoLectureModel =
      this.lessonModel.discriminators?.[VideoLecture.name.toLowerCase()];
    if (!VideoLectureModel) throw new Error('VideoLecture model not defined');

    const latestLesson = await this.lessonModel
      .findOne({ topic: dto.topic })
      .sort({ number: -1 }) // Sắp xếp giảm dần theo `number`
      .exec();

    const video = new VideoLectureModel({
      ...dto,
      type: LessonType.VideoLecture,
      number: latestLesson ? latestLesson.number + 1 : 1,
    });
    return video.save();
  }

  async findAll(topicId: string): Promise<Lesson[]> {
    return this.lessonModel
      .find({ topic: topicId })
      .sort({
        number: 1,
      })
      .exec();
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    // Lúc này TypeScript đã hiểu lesson chắc chắn không phải null
    return lesson;
  }

  async update(id: string, updateDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy lesson với id: ${id}`);
    }

    const LessonModel = this.lessonModel.discriminators?.[lesson.type];
    if (!LessonModel) {
      throw new Error(
        `Không tìm thấy model discriminator cho type: ${lesson.type}`,
      );
    }

    const oldNumber = lesson.number;
    const newNumber = updateDto.number;

    if (newNumber !== undefined && newNumber !== oldNumber) {
      if (newNumber > oldNumber) {
        // Dời các bài giữa oldNumber+1 đến newNumber lùi xuống 1
        await this.lessonModel.updateMany(
          {
            topic: lesson.topic,
            number: { $gt: oldNumber, $lte: newNumber },
          },
          { $inc: { number: -1 } },
        );
      } else {
        // Dời các bài từ newNumber đến oldNumber-1 lên 1
        await this.lessonModel.updateMany(
          {
            topic: lesson.topic,
            number: { $gte: newNumber, $lt: oldNumber },
          },
          { $inc: { number: 1 } },
        );
      }
    }

    const updatedLesson = await LessonModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    }).exec();

    if (!updatedLesson) {
      throw new NotFoundException(
        `Không tìm thấy lesson để cập nhật với id: ${id}`,
      );
    }

    return updatedLesson;
  }

  async remove(id: string) {
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy lesson với id: ${id}`);
    }

    await this.lessonModel.findByIdAndDelete(id).exec();

    await this.lessonModel.updateMany(
      {
        topic: lesson.topic,
        number: { $gt: lesson.number },
      },
      { $inc: { number: -1 } },
    );
  }
}
