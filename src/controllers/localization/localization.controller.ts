import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { LocalizationService } from 'src/models/localization/localization.service';
import {
  CreateLocalizationDto,
  FindAllLocalizationsDto,
  GenerateJsonLocalizationsDto,
  GetAllLocalizationsDto,
} from './localization.dto';
import { Localization } from 'src/models/localization/localization.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Controller('localizations')
@ApiTags('Internal', 'Localization')
@UseGuards(JWTAuthGuard)
export class LocalizationController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Post()
  async create(@Body() body: CreateLocalizationDto) {
    const exist = await this.localizationService.checkIsFound({
      where: {
        applicationKey: body.applicationKey,
        code: body.code,
      },
    });

    if (exist) {
      throw new BadRequestException(
        `Localization with applicationKey "${body.applicationKey}" and language code "${body.code}" already exists.`,
      );
    }
    const localization = await this.localizationService.create(
      body as Partial<Localization>,
    );
    const response = await this.localizationService.makeResponse(localization);
    return response;
  }

  @Get()
  async findAll(@Query() query: FindAllLocalizationsDto) {
    const { applicationKey, include, page, limit, q } = query;

    return await this.localizationService.makeLocalizationsArrayDataResponse(
      page,
      limit,
      q,
      applicationKey,
      include,
    );
  }

  @Get('/all')
  async getAll(@Query() query: GetAllLocalizationsDto) {
    const { applicationKey } = query;

    const localizations = await this.localizationService.findAll(
      {
        where: {
          applicationKey,
        },
      },
      0,
      0,
      true,
    );
    const response = await this.localizationService.makeResponses(
      localizations.rows,
    );

    return response;
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
    const oldLocalizationCode = localization.code;
    const newLocalizationCode = body.code;

    localization = await this.localizationService.update(localization, body);

    await this.localizationService.updateJsonFileName(
      oldLocalizationCode,
      newLocalizationCode,
      localization.applicationKey,
    );

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

    this.localizationService.deleteJsonFile(
      localization.code,
      localization.applicationKey,
    );
    return response;
  }

  @Post('/generate-jsons')
  async generateDefaultLocalizations(
    @Body() body: GenerateJsonLocalizationsDto,
  ) {
    const response = await this.localizationService.generateLocalizations(body);

    return response.path;
  }

  @Get('/by-application-key/:applicationKey')
  async getLocalizationsByApplicationKey(
    @Param('applicationKey')
    applicationKey: CONSTANTS.Application.ApplicationKeys,
  ) {
    const localizations =
      await this.localizationService.fetchLocalizationsByApplicationKey(
        applicationKey,
      );
    return localizations;
  }
}
