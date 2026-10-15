import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import ExcelJS from 'exceljs';
import type { Response } from 'express';
import { exportToExcel, type ExcelColumn } from '../../excel/excel.util';

describe('exportToExcel', () => {
  let response: {
    setHeader: jest.Mock<(name: string, value: string) => void>;
    end: jest.Mock<() => void>;
  };

  beforeEach(() => {
    response = {
      setHeader: jest.fn<(name: string, value: string) => void>(),
      end: jest.fn<() => void>(),
    };
  });

  it('should create an Excel workbook and send it as a response', async () => {
    const columns: ExcelColumn[] = [
      { header: 'Name', key: 'name', width: 10 },
      { header: 'Age', key: 'age', width: 5 },
    ];

    const data: Record<string, unknown>[] = [
      { name: 'Godfrey', age: 30 },
      { name: 'Neema', age: 25 },
    ];

    const writeSpy = jest
      .spyOn(ExcelJS.Workbook.prototype.xlsx, 'write')
      .mockResolvedValue(undefined);

    await exportToExcel(
      response as unknown as Response,
      'Users',
      columns,
      data,
      'users.xlsx',
    );

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="users.xlsx"',
    );
    expect(writeSpy).toHaveBeenCalledWith(response);
    expect(response.end).toHaveBeenCalledTimes(1);

    writeSpy.mockRestore();
  });

  it('should generate a default filename when none is provided', async () => {
    const writeSpy = jest
      .spyOn(ExcelJS.Workbook.prototype.xlsx, 'write')
      .mockResolvedValue(undefined);

    const dateSpy = jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-10-15T12:00:00.000Z');

    await exportToExcel(
      response as unknown as Response,
      'Users',
      [{ header: 'Name', key: 'name' }],
      [{ name: 'Godfrey' }],
    );

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="Users_2026-10-15T12:00:00.000Z.xlsx"',
    );

    writeSpy.mockRestore();
    dateSpy.mockRestore();
  });

  it('should support empty data', async () => {
    const writeSpy = jest
      .spyOn(ExcelJS.Workbook.prototype.xlsx, 'write')
      .mockResolvedValue(undefined);

    await expect(
      exportToExcel(
        response as unknown as Response,
        'EmptySheet',
        [{ header: 'Name', key: 'name' }],
        [],
        'empty.xlsx',
      ),
    ).resolves.toBeUndefined();

    expect(response.end).toHaveBeenCalledTimes(1);

    writeSpy.mockRestore();
  });

  it('should propagate errors when writing the workbook fails', async () => {
    const error = new Error('Excel generation failed');

    const writeSpy = jest
      .spyOn(ExcelJS.Workbook.prototype.xlsx, 'write')
      .mockRejectedValue(error);

    await expect(
      exportToExcel(
        response as unknown as Response,
        'Users',
        [{ header: 'Name', key: 'name' }],
        [{ name: 'Godfrey' }],
        'users.xlsx',
      ),
    ).rejects.toThrow('Excel generation failed');

    expect(response.end).not.toHaveBeenCalled();

    writeSpy.mockRestore();
  });
});
