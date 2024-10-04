// src/hooks/useSelectDataGridRow.ts
/* ALlows one row to be selected per worksheet */

import { useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import type { RowData, SheetData } from './useExcelToDataGrid';

export interface SelectedRow {
  sheetName: string,
  rowData: RowData;
}

const useRowSelection = () => {
  const [selectedRows, setSelectedRows] = useState<SelectedRow[]>([]);
  const [selectionModel, setSelectionModel] = useState<{ [key: string]: GridRowSelectionModel }>({});
  const [ manuallySelectedSheets, setManuallySelectedSheets ] = useState<string[]>([]);

  const handleRowSelection = (
    rowSelectionModel: GridRowSelectionModel,
    rows: RowData[],
    sheetName: string,
    allSheets: SheetData[] // pass all the worksheets here
  ) => {
    const selectedRowId = rowSelectionModel[rowSelectionModel.length - 1];
    const selectedRow = rows.find((row) => row.id === selectedRowId);

    if (selectedRow) {
      const selectedRowData: SelectedRow = {
        sheetName,
        rowData: selectedRow,
      };

      // Mark this sheet as manually selected if it's the first time
      if (!manuallySelectedSheets.includes(sheetName)) {
        setManuallySelectedSheets((prev) => [...prev, sheetName]);
      }

      const { id, ...selectedRowWithoutId } = selectedRow;

      // Collect all selected rows (initial row and matches from other sheets)
      const newSelectedRows: SelectedRow[] = [selectedRowData];

      // Search other worksheets for same row if not manually selected already
      allSheets.forEach((sheet) => {
        if (sheet.sheetName !== sheetName && !manuallySelectedSheets.includes(sheet.sheetName)) { // Skip manually selected sheets
          const matchingRow = sheet.rows.find((row) =>
            Object.keys(selectedRowWithoutId).every(
              (key) => row[key] === selectedRowWithoutId[key]
            )
          );

          if (matchingRow) {
            // Select the matching row in the other worksheet
            setSelectionModel((prevModel) => ({
              ...prevModel,
              [sheet.sheetName]: [matchingRow.id],
            }));

            // Add the matched row to the newSelectedRows array
            const matchedRowData: SelectedRow = {
              sheetName: sheet.sheetName,
              rowData: matchingRow,
            };
            newSelectedRows.push(matchedRowData);
          } else {
            console.log(`No row found in ${sheet.sheetName}`);
          }
        }
      });

      // Update selected rows with all selected and matched rows
      setSelectedRows((prevSelectedRows) => {
        // Filter out the old selection for the current sheet and other auto-selected sheets
        const filteredRows = prevSelectedRows.filter(
          (prevRow) => !newSelectedRows.some(newRow => newRow.sheetName === prevRow.sheetName)
        );
        return [...filteredRows, ...newSelectedRows];
      });

      // Update selection model for the current sheet
      setSelectionModel((prevModel) => ({
        ...prevModel,
        [sheetName]: [selectedRowId], // One row only
      }));
    }
  };

  console.log("Selected Rows: ", selectedRows);
  return { selectedRows, handleRowSelection, selectionModel };
};

export default useRowSelection;
