import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileService } from 'src/models/file/file.service';
import { FileResponse } from 'src/models/file/file.dto';

@Controller('file-manager')
@ApiTags('Internal', 'File Manger')
@UseGuards(JWTAuthGuard)
export class FileManagerController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads', // Directory to store files
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'upload a new file' })
  @ApiCreatedResponse({
    description: 'The file has been successfully uploaded.',
    type: FileResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Use this type
  ) {
    const f = await this.fileService.create({
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
    });

    const fileResponse = await this.fileService.makeFileResponse(f);

    return fileResponse;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete file (force delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the file to delete',
  })
  @ApiNoContentResponse({
    description: 'application file force deleted',
    type: FileResponse,
  })
  @ApiNotFoundResponse({ description: 'file not found' })
  async deleteFile(@Param('id') id: string) {
    const file = await this.fileService.checkIsFound({
      where: { id },
    });

    await this.fileService.delete(file);

    const fileResponse = await this.fileService.makeFileResponse(file);
    return fileResponse;
  }
}
