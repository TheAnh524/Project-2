import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsModule } from './app/topics/topics.module';
import { CommentsModule } from './app/comments/comments.module';
import { LessonsModule } from './app/lessons/lessons.module';
import { UploadsModule } from './app/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    // app modules
    UsersModule,
    AuthModule,
    TopicsModule,
    LessonsModule,
    CommentsModule,
    UploadsModule,
  ],
})
export class AppModule {}
