import {
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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EmailTemplateService } from 'src/models/email-template/email-template.service';
import {
  CreateEmailTemplateDto,
  CreateEmailTemplateVersionDto,
  FindAllEmailTemplatesDto,
  UpdateEmailTemplateDto,
  UpdateEmailTemplateVersionDto,
} from './email-template.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { CONSTANTS } from 'sea-platform-helpers';

@Controller('/email-templates')
@ApiTags('Email Template')
@UseGuards(JWTAuthGuard)
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateRead,
    ]),
  )
  @ApiOperation({ summary: 'fetch email templates' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of templates',
    type: Object,
    isArray: true,
  })
  async findAll(@Query() query: FindAllEmailTemplatesDto) {
    const response = await this.emailTemplateService.findAll(
      query.page,
      query.limit,
      query.q,
    );
    return response;
  }

  @Post()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create email template' })
  @ApiCreatedResponse({
    description: 'The email template has been successfully created.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateEmailTemplateDto) {
    const template = await this.emailTemplateService.create(body);

    return template;
  }

  @Get('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateRead,
    ]),
  )
  @ApiOperation({ summary: 'get email template details' })
  @ApiCreatedResponse({
    description: 'get email template details successfully.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async getOne(@Param('id') id: string) {
    const template = await this.emailTemplateService.checkFindById(id);

    return template;
  }

  @Get('/:id/versions')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateRead,
    ]),
  )
  @ApiOperation({ summary: 'get email template versions' })
  @ApiCreatedResponse({
    description: 'get email template versions successfully.',
    type: Object,
    isArray: true,
  })
  async getTemplateVersions(@Param('id') id: string) {
    const templates = await this.emailTemplateService.fetchTemplateVersions(id);

    return templates;
  }

  @Put('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update email template' })
  @ApiCreatedResponse({
    description: 'The email template has been successfully updated.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() body: UpdateEmailTemplateDto) {
    const template = await this.emailTemplateService.update(id, body);
    return template;
  }

  @Delete('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete email template details' })
  @ApiCreatedResponse({
    description: 'delete email template successfully.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async delete(@Param('id') id: string) {
    const template = await this.emailTemplateService.remove(id);
    return template;
  }

  @Post('/versions')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create email template version' })
  @ApiCreatedResponse({
    description: 'The email template version has been successfully created.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async createVersion(@Body() body: CreateEmailTemplateVersionDto) {
    return await this.emailTemplateService.createVersion(body);
  }

  @Get('/versions/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateRead,
    ]),
  )
  @ApiOperation({ summary: 'get email template version details' })
  @ApiCreatedResponse({
    description: 'The version details has fetched successfully.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async getVersionDetails(@Param('id') id: string) {
    return await this.emailTemplateService.checkVersionFindById(id);
  }

  @Put('/versions/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'Update email template version' })
  @ApiCreatedResponse({
    description: 'The email template version has been successfully updated.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async updateVersion(
    @Param('id') id: string,
    @Body() body: UpdateEmailTemplateVersionDto,
  ) {
    return await this.emailTemplateService.updateVersion(id, body);
  }

  @Delete('/versions/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageEmailTemplateDelete,
    ]),
  )
  @ApiOperation({ summary: 'Delete email template version' })
  @ApiCreatedResponse({
    description: 'The email template version has been successfully deleted.',
    type: Object,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async deleteVersion(@Param('id') id: string) {
    return await this.emailTemplateService.removeVersion(id);
  }
}
