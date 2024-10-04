// src/hooks/useExcelToDataGrid.ts
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { GridColDef, GridFilterModel, GridLogicOperator } from '@mui/x-data-grid';

export interface RowData {
  id: number;
  [key: string]: any;
}

export interface SheetData {
  sheetName: string;
  columns: GridColDef[];
  rows: RowData[];
  columnVisibilityModel: { [key: string]: boolean };
}

const useExcelToGrid = () => {
  const [sheets, setSheets] = useState<SheetData[]>([]);

  const handleFileUpload = (file: File) => {

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {

      const data = event.target?.result;

      if (data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetDataList: SheetData[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const dataRows: any[][] = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[sheetName], { header: 1 });
          const maxColumns: number = Math.max(...dataRows.map(row => row.length));

          const gridColumns: GridColDef[] = Array.from(
            { length: maxColumns },
            (_, index) => ({
              field: `col${index}`,
              headerName: `Column ${index + 1}`,
              width: 150,
            })
          );

          // set visibility model to hide empty columns
          const columnVisibilityModel: { [key: string]: boolean } = {};

          gridColumns.forEach((column, colIndex) => {
            const isEmpty = dataRows.every(row => !row[colIndex]);
            columnVisibilityModel[`col${colIndex}`] = !isEmpty;
          })

          const gridRows: RowData[] = dataRows.map((row: any[], index: number) => {
            const rowData: RowData = { id: index };
            gridColumns.forEach((_, colIndex) => {
              rowData[`col${colIndex}`] = row[colIndex] || '';
            });
            return rowData;
          });

          sheetDataList.push({
            sheetName,
            columns: gridColumns,
            rows: gridRows,
            columnVisibilityModel,
          });
        });

        setSheets(sheetDataList);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return { sheets, handleFileUpload };
};

export default useExcelToGrid;
