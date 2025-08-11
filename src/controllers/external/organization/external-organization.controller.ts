import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationService } from 'src/models/organization/organization.service';

import { OrganizationResponse } from 'src/models/organization/organization.dto';
import { CheckCallMe } from 'src/guards/check-call-me.guard';
import { DepartmentResponse } from 'src/models/department/department.dto';
import { DepartmentService } from 'src/models/department/department.service';

@Controller('external/organizations')
@ApiTags('External', 'Organization')
@UseGuards(CheckCallMe)
export class ExternalOrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly departmentService: DepartmentService,
  ) {}

  @Get('/:id')
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
}
