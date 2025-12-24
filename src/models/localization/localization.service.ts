import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';

import { Services } from 'sea-backend-helpers';
import { Localization } from './localization.model';
import { LocalizationResponse } from './localization.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';
import * as fs from 'fs';
import * as path from 'path';
import { Application } from '../application/application.model';

@Injectable()
export class LocalizationService extends Services.SequelizeCRUDService<
  Localization,
  LocalizationResponse,
  CONSTANTS.Localization.LocalizationIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.LocalizationRepository)
    private localizationRepository: typeof Localization,
    @Inject(Constants.Database.DatabaseRepositories.ApplicationRepository)
    private applicationRepository: typeof Application,
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
    const application = await this.applicationRepository.findByPk(
      options.applicationId,
    );

    if (!application) {
      throw new Error(`Application with ID ${options.applicationId} not found`);
    }

    // Define the base directory for localization files
    const baseDir = path.join(
      process.cwd(),
      'public',
      'localization',
      application.name,
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
      const jsonContent = {
        applicationKey: application.key,
        localization: {
          [code]: translationObject,
        },
      };

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
}
