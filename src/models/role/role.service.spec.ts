import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getModelToken } from '@nestjs/sequelize';
import { Role } from './role.model';
import { PermissionService } from '../permission/permission.service';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { ApplicationService } from '../application/application.service';
import { AuthService } from '../auth/auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CONSTANTS } from 'sea-platform-helpers';

// ===== MOCK ROLE INSTANCE =====
const mockRoleInstance = {
  id: '1',
  name: 'Admin',
  applicationId: 'app1',
  isDeletable: true,
  accounts: [],
  rolePermissions: [],
  application: { id: 'app1', key: 'APP' },
  save: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockImplementation(async function (data) {
    Object.assign(this, data);
    return this;
  }),
  destroy: jest.fn().mockResolvedValue(true),
  $get: jest.fn().mockResolvedValue({ id: 'app1', key: 'APP' }),
  $add: jest.fn(),
  $remove: jest.fn(),
};

// ===== MOCK ROLE MODEL =====
const mockRoleModel = {
  create: jest.fn().mockImplementation(async (data) => ({
    ...mockRoleInstance,
    ...data,
  })),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
};

// ===== MOCK SERVICES =====
const mockPermissionService = { makePermissionResponseForRole: jest.fn() };
const mockRolePermissionService = {
  createMultiForRole: jest.fn(),
  updateKeysForRole: jest.fn(),
  delete: jest.fn(),
};
const mockApplicationService = {
  checkIsFound: jest.fn(),
  makeApplicationResponse: jest.fn(),
};
const mockAuthService = { invalidateTokensForRole: jest.fn() };

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: getModelToken(Role), useValue: mockRoleModel },
        { provide: PermissionService, useValue: mockPermissionService },
        { provide: RolePermissionService, useValue: mockRolePermissionService },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== findOne & checkIsFound ====================
  describe('findOne', () => {
    it('should return a role if found', async () => {
      mockRoleModel.findOne.mockResolvedValue({ id: '1', name: 'Admin' });
      const result = await service.findOne({ where: { id: '1' } });
      expect(result).toEqual({ id: '1', name: 'Admin' });
    });

    it('should return null if role not found', async () => {
      mockRoleModel.findOne.mockResolvedValue(null);
      const result = await service.findOne({ where: { id: '2' } });
      expect(result).toBeNull();
    });
  });

  describe('checkIsFound', () => {
    it('should return role if found', async () => {
      mockRoleModel.findOne.mockResolvedValue({ id: '1', name: 'Admin' });
      const result = await service.checkIsFound({ where: { id: '1' } });
      expect(result).toEqual({ id: '1', name: 'Admin' });
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRoleModel.findOne.mockResolvedValue(null);
      await expect(
        service.checkIsFound({ where: { id: '2' } }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== CREATE ====================
  //   describe('create', () => {
  //     it('should create a new role', async () => {
  //       mockApplicationService.checkIsFound.mockResolvedValue({ id: 'app1' });
  //       mockRolePermissionService.createMultiForRole.mockResolvedValue(true);

  //       const result = await service.create(
  //         { name: 'Admin' } as any,
  //         [CONSTANTS.Permission.PermissionKeys.ManageRolesCreate],
  //         'APP_KEY' as any,
  //       );

  //       expect(result.name).toEqual('Admin');
  //       expect(result.applicationId).toEqual('app1');
  //       expect(mockRolePermissionService.createMultiForRole).toHaveBeenCalled();
  //       expect(mockRoleModel.create).toHaveBeenCalledWith(
  //         expect.objectContaining({ name: 'Admin' }),
  //       );
  //     });
  //   });

  // ==================== UPDATE ====================
  //   describe('update', () => {
  //     it('should update role and invalidate tokens if permissions changed', async () => {
  //       const role = { ...mockRoleInstance };
  //       mockRolePermissionService.updateKeysForRole.mockResolvedValue({
  //         permissionsUpdated: true,
  //       });

  //       const result = await service.update(
  //         role as any,
  //         { name: 'Updated Admin' } as any,
  //         [CONSTANTS.Permission.PermissionKeys.ManageRolesUpdateDetails],
  //       );

  //       expect(result.name).toEqual('Updated Admin');
  //       expect(mockRolePermissionService.updateKeysForRole).toHaveBeenCalled();
  //       expect(mockAuthService.invalidateTokensForRole).toHaveBeenCalledWith(
  //         role,
  //       );
  //     });
  //   });

  // ==================== DELETE ====================
  describe('delete', () => {
    it('should throw BadRequestException if role is not deletable', async () => {
      const role = { ...mockRoleInstance, isDeletable: false };
      await expect(service.delete(role as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if role has accounts', async () => {
      const role = { ...mockRoleInstance, accounts: [{ id: 'acc1' }] };
      jest
        .spyOn(service, 'getAccounts')
        .mockResolvedValue(role.accounts as any);
      await expect(service.delete(role as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should delete role and invalidate tokens', async () => {
      const role = { ...mockRoleInstance, accounts: [] };
      jest.spyOn(service, 'getAccounts').mockResolvedValue([]);
      jest.spyOn(service, 'getRolePermissions').mockResolvedValue([]);
      role.destroy = jest.fn().mockResolvedValue(true);

      await service.delete(role as any);

      expect(role.destroy).toHaveBeenCalledWith({ force: true });
      expect(mockAuthService.invalidateTokensForRole).toHaveBeenCalledWith(
        role,
      );
    });
  });

  // ==================== makeRoleFullResponse ====================
  //   describe('makeRoleFullResponse', () => {
  //     it('should return full role response', async () => {
  //       const role = {
  //         ...mockRoleInstance,
  //         rolePermissions: [{ permissionKey: 'PERM1' }],
  //       };
  //       mockApplicationService.makeApplicationResponse.mockResolvedValue({
  //         key: 'APP',
  //       });
  //       mockPermissionService.makePermissionResponseForRole.mockResolvedValue([
  //         {
  //           key: 'PERM1',
  //           hasPermission: true,
  //         },
  //       ]);

  //       const result = await service.makeRoleFullResponse(role as any);

  //       expect(result).toBeDefined();
  //       expect(mockApplicationService.makeApplicationResponse).toHaveBeenCalled();
  //       expect(
  //         mockPermissionService.makePermissionResponseForRole,
  //       ).toHaveBeenCalled();
  //     });
  //   });
});
