import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckCallMe } from 'src/guards/check-call-me.guard';
import { FacultyResponse } from 'src/models/faculty/faculty.dto';
import { FacultyService } from 'src/models/faculty/faculty.service';

@Controller('external/faculties')
@ApiTags('External', 'Faculty')
@UseGuards(CheckCallMe)
export class ExternalFacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all faculties' })
  @ApiOkResponse({
    description: 'Faculties fetched successfully',
    type: FacultyResponse,
    isArray: true,
  })
  async fetchAllFaculties() {
    const { rows: faculties } = await this.facultyService.findAll(
      {},
      0,
      0,
      true,
    );
    return await this.facultyService.makeResponses(faculties, 'all');
  }
}
