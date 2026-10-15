import ExcelJS from 'exceljs';
import type { Response } from 'express';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Generate and send Excel file as response
 */
export async function exportToExcel(
  res: Response,
  sheetName: string,
  columns: ExcelColumn[],
  data: Record<string, unknown>[],
  fileName?: string,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = columns;

  data.forEach((item) => {
    sheet.addRow(item);
  });

  // Auto-adjust column widths
  sheet.columns.forEach((column) => {
    if (!column.header) {
      return;
    }

    let maxLength = 0;

    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value;
      let cellText = '';

      if (value === null || value === undefined) {
        cellText = '';
      } else if (typeof value === 'string' || typeof value === 'number') {
        cellText = value.toString();
      } else if (typeof value === 'boolean') {
        cellText = value ? 'TRUE' : 'FALSE';
      } else if (value instanceof Date) {
        cellText = value.toISOString();
      } else if ('richText' in value) {
        cellText = value.richText.map((item) => item.text).join('');
      }

      maxLength = Math.max(maxLength, cellText.length);
    });

    column.width = Math.max(column.width ?? 10, maxLength + 2);
  });

  const finalFileName =
    fileName ?? `${sheetName}_${new Date().toISOString()}.xlsx`;

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${finalFileName}"`,
  );

  await workbook.xlsx.write(res);

  res.end();
}
