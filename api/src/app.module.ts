/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserHelperService } from './user/service/user-helper-service/user-helper-service.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { authMiddleware } from './middleware/auth-middleware';
import path from 'path';

@Module({
  imports: [
    // ... other modules
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .exclude(
        { path: 'api/user', method: RequestMethod.POST },
        { path: 'api/user/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
