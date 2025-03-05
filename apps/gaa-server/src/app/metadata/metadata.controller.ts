import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadatumDto } from './dto/create-metadatum.dto';
import { UpdateMetadatumDto } from './dto/update-metadatum.dto';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}


  @Get("/meta-data")
  async getMetadata(
    @Body()
    createMetadatumDto: CreateMetadatumDto
    // @Query("crudQuery") crudQuery: string
  ) {
    console.log(
      "createMetadatumDto controller",
      createMetadatumDto

    );

    const data =
      await this.metadataService.getMetadataService(
        createMetadatumDto
      );
    return data;
  }
}
