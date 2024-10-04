// components/dpgf/DisplayDPGFInPlace.tsx

/* Component to upload and display Excel directly in browser with no backend calls yet */

import React, { useState } from 'react';
import {DataGrid, GridColDef, GridRowSelectionModel} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import useExcelToDataGrid from "../../hooks/useExcelToDataGrid";
import useSelectDataGridRow from "../../hooks/useSelectDataGridRow";
import SelectDPGFHeaderRows from "./SelectDPGFHeaderRows";

const ExcelToDataGrid = () => {
  const { sheets, handleFileUpload } = useExcelToDataGrid(); // File upload logic
  const { selectedRows, handleRowSelection, selectionModel } = useSelectDataGridRow(); // Row selection logic
  const [ fileLoaded, setFileLoaded ] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      setFileLoaded(true);
    }
  };

  return (
    <Box>
      {/* File Upload Input */}
      <Box>
        <label>Upload Excel file:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </Box>
      {sheets.map((sheet, index) => (
        <Box key={index} sx={{ marginTop: 4 }}>
          <h3>{sheet.sheetName}</h3>
          <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rowHeight={25}
              rows={sheet.rows}
              columns={sheet.columns}
              checkboxSelection
              // control row selection via model
              rowSelectionModel={selectionModel[sheet.sheetName] || []}
              initialState={{
                columns: {
                  columnVisibilityModel: sheet.columnVisibilityModel,
                },
              }}
              onRowSelectionModelChange={(rowSelectionModel =>
                handleRowSelection(rowSelectionModel, sheet.rows, sheet.sheetName, sheets)
              )}
            />
          </Paper>
        </Box>
      ))}

      {/* Floating Bottom Bar */}
      {fileLoaded && (
            <SelectDPGFHeaderRows selectedRows={selectedRows} sheets={sheets} />
      )}
    </Box>
  );
};

export default ExcelToDataGrid;