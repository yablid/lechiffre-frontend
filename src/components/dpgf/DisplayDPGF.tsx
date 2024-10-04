// components/dpgf/DisplayDPGF.tsx
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

// All rows must have same number of columns

// Define the type for the worksheet prop
interface Worksheet {
  df: {
    [key: string]: string[]; // The keys are rows (e.g., row_0, row_1, etc.)
  };
}

interface DisplayWorksheetProps {
  worksheet: Worksheet;
}

const DisplayWorksheet: React.FC<DisplayWorksheetProps> = ({ worksheet }) => {
  const { df } = worksheet;

  const rowKeys = Object.keys(df);
  const numCols = df[rowKeys[0]].length;

  const columns: GridColDef[] = Array.from({ length: numCols }, (_, colIndex) => ({
    field: `column_${colIndex}`,
    headerName: `Column ${colIndex + 1}`, // Naming columns "Column 1", "Column 2", etc.
    width: 150, // Set a default width for columns
  }));

  const rows = rowKeys.map((key, rowIndex) => {
    const rowData: { id: number; [key: string]: string | number } = { id: rowIndex }; // DataGrid requires unique key

    df[key].forEach((cell, colIndex) => {
      rowData[`column_${colIndex}`] = cell; // key should match field from GridColDef
    });

    return rowData;
  });

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default DisplayWorksheet;
