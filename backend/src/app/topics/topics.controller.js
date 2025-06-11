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
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { LessonsService } from '../lessons/lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../users/enums/role.enum';

@Controller('topics')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly lessonsService: LessonsService,
  ) {}

  @Post()
  @Role(RoleEnum.Teacher)
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Get(':id/lessons')
  findAllLessons(@Param('id') id: string) {
    return this.lessonsService.findAll(id);
  }

  @Patch(':id')
  @Role(RoleEnum.Teacher)
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @Role(RoleEnum.Teacher)
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
