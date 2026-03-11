import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { ArrayDataResponse } from 'src/common/global.dto';
import { CheckCallMe } from 'src/guards/check-call-me.guard';
import { Account } from 'src/models/account/account.model';
import { AccountService } from 'src/models/account/account.service';
import { Student } from 'src/models/student/student.model';
import { DTO } from 'sea-platform-helpers';
import { FindAttendanceStudentsDto } from './external-students.dto';

@Controller('external/students')
@ApiTags('External', 'Student')
@UseGuards(CheckCallMe)
export class ExternalStudentsController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated student accounts for attendance' })
  @ApiOkResponse({ description: 'Student accounts fetched successfully' })
  async fetchStudentsForAttendance(@Query() query: FindAttendanceStudentsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const all = query.all === true || `${query.all}`.toLowerCase() === 'true';

    const where: WhereOptions<Account> = {};

    if (query.q) {
      const normalizedQ = query.q.toLowerCase();
      where[Op.or] = ['id', 'name', 'email'].map((column) =>
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col(`Account.${column}`)),
          {
            [Op.like]: `%${normalizedQ}%`,
          },
        ),
      );
    }

    if (query.studentAccountIds?.length) {
      where.id = {
        [Op.in]: query.studentAccountIds,
      };
    }

    const { rows: accounts, totalCount } = await this.accountService.findAll(
      {
        where,
        include: [
          {
            model: Student,
            as: 'student',
            required: true,
          },
        ],
        distinct: true,
      },
      all ? 0 : page,
      all ? 0 : limit,
      all,
    );

    const data: DTO.StudentAttendance.Statistics.IAdminAttendanceRow[] =
      accounts.map((account) => ({
        id: account.id,
        studentAccountId: account.id,
        studentName: account.name,
        studentEmail: account.email,
        studentSsn: account.student?.SSNNo,
      }));

    if (all) {
      return new ArrayDataResponse(totalCount, data, 1, totalCount || 1);
    }

    return new ArrayDataResponse(totalCount, data, page, limit);
  }
}
