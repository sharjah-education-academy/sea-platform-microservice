import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { ApplicationService } from 'src/models/application/application.service';
import {
  ApplicationArrayDataResponse,
  FindAllApplicationsDto,
  UpdateApplicationDto,
  UpdateApplicationStatusDto,
} from './application.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { ApplicationResponse } from 'src/models/application/application.dto';
import { File } from 'src/models/file/file.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Controller('applications')
@ApiTags('Internal', 'Application')
@UseGuards(JWTAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageApplicationRead,
    ]),
  )
  @ApiOperation({ summary: 'fetch applications' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of applications',
    type: ApplicationArrayDataResponse,
  })
  async findAll(@Query() query: FindAllApplicationsDto) {
    const response =
      await this.applicationService.makeApplicationArrayDataResponse(
        query.page,
        query.limit,
        query.q,
        query.status,
      );
    return response;
  }

  @Get('/list')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageApplicationRead,
    ]),
  )
  @ApiOperation({ summary: 'fetch list of applications' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a list of applications',
    type: ApplicationResponse,
    isArray: true,
  })
  async findAllWithoutPagination() {
    const { applications } = await this.applicationService.findAll(
      {},
      0,
      0,
      true,
    );
    const applicationsResponse =
      await this.applicationService.makeApplicationsResponse(applications);
    return applicationsResponse;
  }

  @Get('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageApplicationRead,
    ]),
  )
  @ApiOperation({ summary: 'get application details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Application fetched successfully',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async fetchApplicationDetails(@Param('id') id: string) {
    const application = await this.applicationService.checkIsFound({
      where: { id },
      include: [File],
    });
    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }

  @Put('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageApplicationUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update application details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Application updated successfully',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async updateApplicationDetails(
    @Param('id') id: string,
    @Body() body: UpdateApplicationDto,
  ) {
    const { iconFileId, ...data } = body;

    let application = await this.applicationService.checkIsFound({
      where: { id },
    });
    application = await this.applicationService.update(
      application,
      data,
      iconFileId,
    );

    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }

  @Put('/:id/status')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageApplicationUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update application details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Application updated successfully',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: UpdateApplicationStatusDto,
  ) {
    let application = await this.applicationService.checkIsFound({
      where: { id },
    });
    application = await this.applicationService.updateStatus(
      application,
      body.status,
    );

    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }
}
