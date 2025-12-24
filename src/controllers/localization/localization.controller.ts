import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { LocalizationService } from 'src/models/localization/localization.service';
import {
  CreateLocalizationDto,
  GenerateJsonLocalizationsDto,
} from './localization.dto';
import { Localization } from 'src/models/localization/localization.model';

@Controller('localizations')
@ApiTags('Internal', 'Localization')
@UseGuards(JWTAuthGuard)
export class LocalizationController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Post()
  async create(@Body() body: CreateLocalizationDto) {
    const localization = await this.localizationService.create(
      body as Partial<Localization>,
    );
    const response = await this.localizationService.makeResponse(localization);
    return response;
  }

  @Get()
  async findAll() {
    // const localizations = await this.localizationService.findAll();
    // return await this.localizationService.makeResponses(localizations);
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    const localization = await this.localizationService.findOne({
      where: { id },
    });

    const response = await this.localizationService.makeResponse(localization);
    return response;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: CreateLocalizationDto) {
    let localization = await this.localizationService.checkIsFound({
      where: { id },
    });

    localization = await this.localizationService.update(localization, body);
    const response = await this.localizationService.makeResponse(localization);
    return response;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    let localization = await this.localizationService.checkIsFound({
      where: { id },
    });

    await this.localizationService.delete(localization);

    const response = await this.localizationService.makeResponse(localization);

    return response;
  }

  @Post('/generate-jsons')
  async generateDefaultLocalizations(
    @Body() body: GenerateJsonLocalizationsDto,
  ) {
    console.log('Generating localizations with data:', body);
    await this.localizationService.generateLocalizations(body);

    return { message: 'Localizations generated successfully' };
  }
}
