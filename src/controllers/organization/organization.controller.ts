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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { OrganizationService } from 'src/models/organization/organization.service';
import {
  CreateDepartmentDto,
  CreateOrganizationDto,
  FindAllDepartmentsDto,
  FindAllOrganizationsDto,
  UpdateDepartmentDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import {
  OrganizationArrayDataResponse,
  OrganizationResponse,
} from 'src/models/organization/organization.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { DepartmentService } from 'src/models/department/department.service';
import {
  DepartmentArrayDataResponse,
  DepartmentResponse,
} from 'src/models/department/department.dto';
import { Department } from 'src/models/department/department.model';

@Controller('organizations')
@ApiTags('Internal', 'Organization')
@UseGuards(JWTAuthGuard)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly departmentService: DepartmentService,
  ) {}

  @Post()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageOrganizationCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiCreatedResponse({
    description: 'The organization has been successfully created.',
    type: OrganizationResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateOrganizationDto) {
    const organization = await this.organizationService.create(body);
    return await this.organizationService.makeOrganizationResponse(
      organization,
    );
  }

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageOrganizationRead,
    ]),
  )
  @ApiOperation({ summary: 'fetch organizations' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of organizations',
    type: OrganizationArrayDataResponse,
  })
  async findAll(@Query() query: FindAllOrganizationsDto) {
    const response =
      await this.organizationService.makeOrganizationArrayDataResponse(
        query.page,
        query.limit,
        query.q,
      );
    return response;
  }

  @Get('/list')
  // @UseGuards(
  //   new JWTAuthorizationGuard([
  //     CONSTANTS.Permission.PermissionKeys.ManageOrganizationRead,
  //   ]),
  // )
  @ApiOperation({ summary: 'fetch all organizations' })
  @ApiResponse({
    status: 200,
    description: 'get all organizations without pagination',
    type: OrganizationResponse,
    isArray: true,
  })
  async findAllWithoutPagination() {
    const response = await this.organizationService.findAll({});
    return await this.organizationService.makeOrganizationsResponse(
      response.organizations,
    );
  }

  @Get('/departments')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageDepartmentRead,
    ]),
  )
  @ApiOperation({ summary: 'get departments' })
  @ApiOkResponse({
    description: 'departments fetched successfully',
    type: DepartmentArrayDataResponse,
  })
  async fetchDepartments(@Query() query: FindAllDepartmentsDto) {
    const departmentsResponse =
      await this.departmentService.makeDepartmentArrayDataResponse(
        query.page,
        query.limit,
        query.q,
        query.organizationId,
      );
    return departmentsResponse;
  }

  @Get('/:id/departments/list')
  @ApiOperation({ summary: 'get departments list' })
  @ApiOkResponse({
    description: 'departments list fetched successfully',
    type: DepartmentResponse,
    isArray: true,
  })
  async fetchDepartmentsList(@Param('id') id: string) {
    const organization = await this.organizationService.checkIsFound({
      where: { id },
      include: [Department],
    });

    const departmentsResponse =
      await this.departmentService.makeDepartmentsResponse(
        organization.departments,
      );

    return departmentsResponse;
  }

  @Post('/departments')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageDepartmentCreate,
    ]),
  )
  @ApiOperation({ summary: 'create new department' })
  @ApiOkResponse({
    description: 'department created successfully',
    type: DepartmentResponse,
  })
  async createDepartment(@Body() body: CreateDepartmentDto) {
    const department = await this.departmentService.create(body);

    return await this.departmentService.makeDepartmentResponse(department);
  }

  @Get('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageOrganizationRead,
    ]),
  )
  @ApiOperation({ summary: 'get organization details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Organization fetched successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async fetchOrganizationDetails(@Param('id') id: string) {
    const organization = await this.organizationService.checkIsFound({
      where: { id },
    });
    const organizationResponse =
      await this.organizationService.makeOrganizationResponse(organization);
    return organizationResponse;
  }

  @Get('/departments/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageDepartmentRead,
    ]),
  )
  @ApiOperation({ summary: 'get department details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'department fetched successfully',
    type: DepartmentResponse,
  })
  @ApiNotFoundResponse({ description: 'department not found' })
  async fetchDepartmentDetails(@Param('id') id: string) {
    const department = await this.departmentService.checkIsFound({
      where: { id },
    });
    const departmentResponse =
      await this.departmentService.makeDepartmentResponse(department);
    return departmentResponse;
  }

  @Put('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageOrganizationUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update organization details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Organization updated successfully',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async updateOrganizationDetails(
    @Param('id') id: string,
    @Body() body: UpdateOrganizationDto,
  ) {
    let organization = await this.organizationService.checkIsFound({
      where: { id },
    });
    organization = await this.organizationService.update(organization, body);

    const organizationResponse =
      await this.organizationService.makeOrganizationResponse(organization);
    return organizationResponse;
  }

  @Put('/departments/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageDepartmentUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update department details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'department updated successfully',
    type: DepartmentResponse,
  })
  @ApiNotFoundResponse({ description: 'Department not found' })
  async updateDepartmentDetails(
    @Param('id') id: string,
    @Body() body: UpdateDepartmentDto,
  ) {
    let department = await this.departmentService.checkIsFound({
      where: { id },
    });
    department = await this.departmentService.update(department, body);

    const departmentResponse =
      await this.departmentService.makeDepartmentResponse(department);
    return departmentResponse;
  }

  @Delete('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageOrganizationDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete organization (force delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the organization to delete',
  })
  @ApiNoContentResponse({
    description: 'organization successfully force deleted',
    type: OrganizationResponse,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async delete(@Param('id') id: string) {
    const organization = await this.organizationService.checkIsFound({
      where: { id },
    });
    await this.organizationService.delete(organization);
    const organizationResponse =
      await this.organizationService.makeOrganizationResponse(organization);
    return organizationResponse;
  }

  @Delete('/departments/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      CONSTANTS.Permission.PermissionKeys.ManageDepartmentDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete department (force delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the department to delete',
  })
  @ApiNoContentResponse({
    description: 'department successfully force deleted',
    type: DepartmentResponse,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async deleteDepartment(@Param('id') id: string) {
    const department = await this.departmentService.checkIsFound({
      where: { id },
    });
    await this.departmentService.delete(department);
    const departmentResponse =
      await this.departmentService.makeDepartmentResponse(department);
    return departmentResponse;
  }
}
