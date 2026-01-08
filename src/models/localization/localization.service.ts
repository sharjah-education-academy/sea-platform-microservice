import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';

import { Services } from 'sea-backend-helpers';
import { Localization } from './localization.model';
import {
  LocalizationArrayDataResponse,
  LocalizationResponse,
} from './localization.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';
import * as fs from 'fs';
import * as path from 'path';
import { ApplicationService } from '../application/application.service';

@Injectable()
export class LocalizationService extends Services.SequelizeCRUDService<
  Localization,
  LocalizationResponse,
  CONSTANTS.Localization.LocalizationIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.LocalizationRepository)
    private localizationRepository: typeof Localization,

    private readonly applicationService: ApplicationService,
  ) {
    super(localizationRepository, 'Localization');
  }

  async makeResponse(
    localization: Localization,
    include?: IncludeQuery<CONSTANTS.Localization.LocalizationIncludes>,
  ): Promise<LocalizationResponse> {
    if (!localization) return undefined;

    return new LocalizationResponse(localization);
  }

  async generateLocalizations(options: {
    applicationId: string;
    values: Array<{
      code: string;
      translations: Array<{ key: string; value: string }>;
    }>;
  }) {
    // Fetch the application to get its name
    const application = await this.applicationService.findOne({
      where: { id: options.applicationId },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with ID ${options.applicationId} not found`,
      );
    }

    // Define the base directory for localization files
    const baseDir = path.join(
      process.cwd(),
      'public',
      'localization',
      application.key,
    );

    // Create the directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    // Generate a JSON file for each language
    for (const languageData of options.values) {
      const { code, translations } = languageData;

      // Convert translations array to object
      const translationObject = translations.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});

      // Create the JSON structure
      const jsonContent = translationObject;

      // Define the file path
      const filePath = path.join(baseDir, `${code}.json`);

      // Write the JSON file
      fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf-8');
    }

    return {
      success: true,
      message: `Generated ${options.values.length} localization files for application ${application.name}`,
      path: baseDir,
    };
  }

  async fetchLocalizationsByApplicationKey(
    applicationKey: CONSTANTS.Application.ApplicationKeys,
  ) {
    // Define the directory path for the application's localization files
    const baseDir = path.join(
      process.cwd(),
      'public',
      'localization',
      applicationKey,
    );

    // Check if the directory exists
    if (!fs.existsSync(baseDir)) {
      await fs.mkdirSync(baseDir, { recursive: true });
    }

    // Read all files in the directory
    const files = fs.readdirSync(baseDir);

    // Filter and read JSON files
    const localizations = {};

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(baseDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        const languageCode = file.replace('.json', ''); // Extract language code from filename
        localizations[languageCode] = jsonData;
      }
    }

    if ('en' in localizations) {
      console.log(
        'English localization founded. No Need to fetch from constants.',
      );
    } else {
      localizations['en'] = CONSTANTS.Application.Applications.find(
        (app) => app.key == applicationKey,
      )?.localization;
    }

    const result = {
      applicationKey,
      localizations,
    };

    return result;
  }

  async makeLocalizationsArrayDataResponse(
    page: number,
    limit: number,
    q: string,
    applicationKey: CONSTANTS.Application.ApplicationKeys,
    include?: CONSTANTS.Global.IncludeQuery<CONSTANTS.Localization.LocalizationIncludes>,
  ) {
    const { rows, totalCount } = await this.findAll(
      {
        where: {
          applicationKey,
        },
      },
      0,
      0,
      true,
    );

    const localizationsResponse = await this.makeResponses(rows, include);

    return new LocalizationArrayDataResponse(
      totalCount,
      localizationsResponse,
      page,
      limit,
    );
  }

  async updateJsonFileName(
    oldLocalizationCode: string,
    newLocalizationCode: string,
    applicationKey: CONSTANTS.Application.ApplicationKeys,
  ) {
    const baseDir = path.join(
      process.cwd(),
      'public',
      'localization',
      applicationKey,
    );

    const oldFilePath = path.join(baseDir, `${oldLocalizationCode}.json`);
    const newFilePath = path.join(baseDir, `${newLocalizationCode}.json`);
    if (fs.existsSync(oldFilePath)) {
      fs.renameSync(oldFilePath, newFilePath);
    }

    return;
  }

  async deleteJsonFile(
    localizationCode: string,
    applicationKey: CONSTANTS.Application.ApplicationKeys,
  ) {
    const baseDir = path.join(
      process.cwd(),
      'public',
      'localization',
      applicationKey,
    );
    const filePath = path.join(baseDir, `${localizationCode}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return;
  }
}
