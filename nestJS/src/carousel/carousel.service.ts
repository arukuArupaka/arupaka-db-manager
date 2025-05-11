import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as path from 'path';
import { CarouselDeleteInput } from './interface/delete.input';
@Injectable()
export class CarouselService {
  constructor(private customPrismaService: CustomPrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async getAllCarousel(): Promise<any[]> {
    return this.customPrismaService.carousel.findMany();
  }

  async addCarousel(
    title: string,
    description: string,
    file: Express.Multer.File,
    carouselUrl: string,
  ): Promise<any> {
    try {
      const imagePath = file.path;

      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
        imagePath,
        {
          folder: 'carousel',
        },
      );

      if (
        !uploadResult ||
        !uploadResult.secure_url ||
        !uploadResult.public_id
      ) {
        throw new BadRequestException();
      }

      const imageUrl = uploadResult.secure_url;
      const publicId = uploadResult.public_id;

      return await this.customPrismaService.carousel.create({
        data: {
          title,
          description,
          imageUrl,
          publicId,
          carouselUrl,
        },
      });
    } catch (error) {
      console.error(
        'Error uploading to Cloudinary or saving to database:',
        error,
      );
      throw new BadRequestException(error);
    }
  }

  async deleteCarousel(deleteDeviceToken: CarouselDeleteInput): Promise<any> {
    try {
      const carouselItem = await this.customPrismaService.carousel.findUnique({
        where: {
          id: deleteDeviceToken.id,
        },
      });

      if (!carouselItem) {
        throw new NotFoundException();
      }

      const publicId = carouselItem.publicId;

      const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

      if (cloudinaryResult.result !== 'ok') {
        throw new BadRequestException();
      }

      console.log(
        `File with publicId ${publicId} successfully deleted from Cloudinary`,
      );

      await this.customPrismaService.carousel.delete({
        where: {
          id: deleteDeviceToken.id,
        },
      });
      return 'Carousel item deleted successfully';
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      throw new Error('Failed to delete carousel item');
    }
  }
}
