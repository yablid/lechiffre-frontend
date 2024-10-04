// components/dpgf/SelectDPGFHeaderRows.tsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { SelectedRow } from '../../hooks/useSelectDataGridRow';
import type { SheetData } from '../../hooks/useExcelToDataGrid';
import ConfirmRowSelectionModal from './ConfirmRowSelectionModal';

interface SelectDPGFHeaderRowsProps {
  selectedRows: SelectedRow[];
  sheets: SheetData[];
}

const SelectDPGFHeaderRows: React.FC<SelectDPGFHeaderRowsProps> = ({ selectedRows, sheets }) => {
  const [isModalOpen, setIsModalOpen ] = useState(false);

  const handleConfirmClick = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'primary.dark',
        p: 2,
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      <Typography variant="h6">Please select header rows for each worksheet</Typography>
      {sheets.map((sheet, index) => {
        // Find all selected rows for the current worksheet and display the first one
        const selectedRow = selectedRows.find((row) => row.sheetName === sheet.sheetName);
        return (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">{sheet.sheetName}:</Typography>
            {selectedRow ? (
              <Typography variant="body1" sx={{ ml: 2 }}>
                {Object.values(selectedRow.rowData).join(', ')}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ ml: 2 }}>No row selected</Typography>
            )}
          </Box>
        );
      })}

      {/* Confirm Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedRows.length === 0}
          onClick={handleConfirmClick}
        >
          Confirm
        </Button>
      </Box>

      {/* Render the modal */}
      {isModalOpen && (
        <ConfirmRowSelectionModal
          selectedRows={selectedRows}
          sheets={sheets}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default SelectDPGFHeaderRows;
