import { Injectable } from '@nestjs/common';
import { RemoteERPService } from '../remote-erp.service';
import { AxiosInstance } from 'axios';
import { IERPEmployee } from './employee.dto';
import { IERPArrayListResponse } from '../erp.dto';

@Injectable()
export class EmployeeService {
  private readonly http: AxiosInstance;
  constructor(remoteERPService: RemoteERPService) {
    this.http = remoteERPService.createClient(
      '/hcmRestApi/resources/11.13.18.05/emps',
    );
  }

  // page start from 1
  async fetchAllPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    try {
      console.log(`fetching employees\n`, { page, offset });
      const response = await this.http.get<IERPArrayListResponse<IERPEmployee>>(
        `?offset=${offset}&limit=${limit}`,
      );

      return response.data;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(
        'Error in getting the Employees list from the ERP:\n',
        error.message,
      );
    }
    const data: IERPArrayListResponse<IERPEmployee> = {
      count: 0,
      hasMore: false,
      items: [],
      limit,
      offset,
      totalResults: 0,
    };
    return data;
  }

  async fetchAll() {
    const employees: IERPEmployee[] = [];
    const limit = 200; // choose a reasonable page size
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.fetchAllPagination(page, limit);

      if (!response) {
        break; // or throw an error if you prefer
      }

      employees.push(...response.items);
      hasMore = response.hasMore;
      page++;
    }

    return employees;
  }
}
