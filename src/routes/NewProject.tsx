// components/NewProject.tsx
import React, { useState } from 'react';

import { uploadDPGF } from '../services/dpgf.service';

import InputFileUpload from '../components/InputFileUpload';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';


const NewProject: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!file) {
    console.log("No file selected");
    return;
  }

  try {
    const response = await uploadDPGF(file);
    console.log('File uploaded successfully:', response);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

  return (
    <Box sx={{
          padding: '20px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
    }}>
      <FormControl component="fieldset" sx={{ }}>
        <FormLabel component="legend" sx={{ marginBottom: 2 }}>
          Upload Excel File
        </FormLabel>
        <FormGroup
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          <InputFileUpload onFileSelect={handleFileChange} />
          {file && (
            <Box sx={{ padding: 4, fontSize: 18, color: 'primary.main' }}>
              Selected file: {file.name}
            </Box>
          )}
          <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!file}
                sx={{ marginLeft: 4, borderRadius: '24px' }}
                onClick={handleSubmit}  // Attach the submit handler here
          >
            Add Project
        </Button>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default NewProject;
