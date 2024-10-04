// components/dpgf/ConfirmRowSelectionModal.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import type { SelectedRow } from '../../hooks/useSelectDataGridRow';
import type { SheetData } from '../../hooks/useExcelToDataGrid';

interface ConfirmRowSelectionModalProps {
  selectedRows: SelectedRow[];
  sheets: SheetData[];
  onClose: () => void;
}

const ConfirmRowSelectionModal: React.FC<ConfirmRowSelectionModalProps> = ({ selectedRows, sheets, onClose }) => {

  // Find row range up to first empty row
  const getRowRanges = () => {
    return selectedRows.map((selectedRow) => {
      const sheet = sheets.find(
            (sheet) => sheet.sheetName === selectedRow.sheetName
      );
      if (!sheet) return null;

      const selectedRowIndex = selectedRow.rowData.id;
      let endRowIndex = selectedRowIndex;

      // Find the first empty row after the selected row
      for (let i = selectedRowIndex + 1; i < sheet.rows.length; i++) {

        const { id, ...rowWithoutId } = sheet.rows[i];
        const isEmptyRow = Object.values(rowWithoutId).every(value => value === '');

        if (isEmptyRow) {
          break;
        }
        endRowIndex = i;
      }

      // Return the worksheet name and the range of rows (1-indexed)
      return {
        sheetName: selectedRow.sheetName,
        headerRowData: selectedRow.rowData,  // The selected header row
        range: `${selectedRowIndex + 1}-${endRowIndex + 1}` // Convert to 1-indexed
      };
    }).filter(Boolean); // Remove null values
  };

  const rowRanges = getRowRanges();

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="confirm-row-selection-modal"
      aria-describedby="confirm-row-selection-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4
      }}>
        <Typography id="confirm-row-selection-modal" variant="h6" component="h2">
          Confirm Row Selection
        </Typography>
        <Box sx={{ mt: 2 }}>
          {rowRanges.length > 0 ? (
            rowRanges.map((range, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                {/* Worksheet Name */}
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {range?.sheetName}
                </Typography>

                {/* Header Row Data */}
                <Typography variant="body1">
                  <strong>Header:</strong> {Object.values(range?.headerRowData || '').join(', ')}
                </Typography>

                {/* Range of Rows */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Rows {range?.range}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No rows selected</Typography>
          )}
        </Box>

        {/* Modal buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmRowSelectionModal;
