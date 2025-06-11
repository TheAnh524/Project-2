import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import {
  CreateQuizExerciseDto,
  CreateVideoLectureDto,
} from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CommentsService } from '../comments/comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../users/enums/role.enum';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RoleGuard)
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post('video')
  @Role(RoleEnum.Teacher)
  createVideo(@Body() createLessonDto: CreateVideoLectureDto) {
    return this.lessonsService.createVideoLecture(createLessonDto);
  }

  @Post('quiz')
  @Role(RoleEnum.Teacher)
  createQuiz(@Body() createLessonDto: CreateQuizExerciseDto) {
    return this.lessonsService.createQuizExercise(createLessonDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Get(':id/comments')
  findAllComments(@Param('id') id: string) {
    return this.commentsService.findAll(id);
  }

  @Patch(':id')
  @Role(RoleEnum.Teacher)
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Role(RoleEnum.Teacher)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
