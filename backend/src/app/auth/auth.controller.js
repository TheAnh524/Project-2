import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' }) // Mô tả ngắn gọn API
  @ApiOkResponse({ description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký' }) // Mô tả API
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return this.authService.login(user);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng' })
  @ApiResponse({ status: 403, description: 'Chưa đăng nhập' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async profile(@Req() req) {
    return plainToInstance(UserResponseDto, req.user, {
      excludeExtraneousValues: true,
    });
  }
}
