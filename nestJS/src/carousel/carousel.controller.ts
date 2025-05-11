import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Carousel } from '@prisma/client';
import { CarouselDeleteInput } from './interface/delete.input';

@Controller('carousel')
export class CarouselController {
  constructor(private carouselService: CarouselService) {}
  @Get('get_all')
  async getAllCarousel(): Promise<Carousel[]> {
    return await this.carouselService.getAllCarousel();
  }

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const sanitizedFilename = file.originalname.replace(
            /[^a-zA-Z0-9.\-_]/g,
            '_',
          );
          cb(null, sanitizedFilename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          console.error('Invalid file type:', file.mimetype);
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async addCarousel(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('carouselUrl') carouselUrl: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.carouselService.addCarousel(
      title,
      description,
      file,
      carouselUrl,
    );
  }

  @Delete('delete')
  async deleteCarousel(
    @Query('id', ParseIntPipe) id: number, // ParseIntPipeで数値に変換
  ): Promise<string> {
    const deleteDeviceToken: CarouselDeleteInput = { id };
    return await this.carouselService.deleteCarousel(deleteDeviceToken);
  }
}
