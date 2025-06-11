import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from './enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Role(RoleEnum.Teacher)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiCreatedResponse({ description: 'Tạo thành công', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Không có quyền thực hiện' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Role(RoleEnum.Teacher)
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách người dùng',
    type: [UserResponseDto],
  })
  @ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
  async findAll(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.findAll(
      getAllUsersDto.page,
      getAllUsersDto.limit,
      getAllUsersDto.search,
    );
  }

  @Get(':id')
  @Role(RoleEnum.Teacher)
  @ApiOperation({ summary: 'Lấy thông tin một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @Role(RoleEnum.Teacher)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiBadRequestResponse({ description: 'Dữ liệu cập nhật không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Không có quyền chỉnh sửa' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Role(RoleEnum.Teacher)
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiForbiddenResponse({ description: 'Không có quyền xóa' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
