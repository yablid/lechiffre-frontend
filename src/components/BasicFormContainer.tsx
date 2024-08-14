import React, { useState, ReactNode } from 'react';
import { Box, Button } from '@mui/material';

interface BasicFormContainerProps {
  formComponent: ReactNode;
}

const BasicFormContainer: React.FC<BasicFormContainerProps> = ({ formComponent }) => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', // Center vertically
        padding: '2rem 2rem',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        sx={{ marginRight: '1rem' }}
      >
        {showForm ? 'Add User' : 'Add User'}
      </Button>
      {showForm && (
        <Box sx={{ marginLeft: '1rem' }}>
          {formComponent}
        </Box>
      )}
    </Box>
  );
};

export default BasicFormContainer;
