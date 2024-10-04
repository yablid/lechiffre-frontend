// src/hooks/useSelectDataGridRow.ts
/* allows multiple row selection - doesn't control display */
import { useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import type { RowData } from '../useExcelToDataGrid';

export interface SelectedRow {
  sheetName: string,
  rowData: RowData;
}

const useRowSelection = () => {
  const [ selectedRows, setSelectedRows ] = useState<SelectedRow[]>([]);

  const handleRowSelection = (
    rowSelectionModel: GridRowSelectionModel,
    rows: RowData[],
    sheetName: string
  ) => {

    const selectedRowData = rowSelectionModel.map((selectedId) => {
      const selectedRow = rows.find((row) => row.id === selectedId);

      if (selectedRow) {
        return {
          sheetName,
          rowData: selectedRow,
        };
      }
      return null;
    }).filter(Boolean) as SelectedRow[]; // filter out null values if row not found?

    setSelectedRows((prevSelectedRows) => {

      // Allows multiple rows from multiple worksheets
      const newSelectedRows = prevSelectedRows.filter(
        (prevRow) =>
          prevRow.sheetName !== sheetName || rowSelectionModel.includes(prevRow.rowData.id)
      );
      const rows = [...newSelectedRows, ...selectedRowData]
      console.log("Selected Rows: ", rows)
      return rows;
    });
  };

  return { selectedRows, handleRowSelection };
};

export default useRowSelection;
