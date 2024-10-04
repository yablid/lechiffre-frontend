// components/NewProject.tsx
import React, { useState } from 'react';

import { uploadDPGF } from '../services/dpgf.service';

import InputFileUpload from '../components/InputFileUpload';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';

import DisplayDPGF from '../components/dpgf/DisplayDPGF';
import { UploadDPGFResponseDTO} from "../services/dto/dpgf.dto";
import DisplayDPGFInPlace from "../components/dpgf/DisplayDPGFInPlace";

const NewProject: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadDPGFResponseDTO | null>(null);

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
    setUploadResult(response);
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
      {uploadResult && (
        <Box sx={{ marginTop: 4, width: '100%' }}>
          {/* Display summary info */}
          <Box sx={{ marginBottom: 2 }}>
            <h2>File: {uploadResult.filename}</h2>
            <p>Status: {uploadResult.status}</p>
            <p>Worksheet Count: {uploadResult.details.worksheet_count}</p>
            {/* Summary details */}
            {uploadResult.summary && (
              <div>
                <h3>Summary:</h3>
                {Object.keys(uploadResult.summary).map((key) => (
                  <div key={key}>
                    <strong>{key}: </strong>
                    {Array.isArray(uploadResult.summary[key])
                      ? uploadResult.summary[key].join(', ')
                      : uploadResult.summary[key]}
                  </div>
                ))}
              </div>
            )}
          </Box>

          {/* Display each worksheet */}
          {uploadResult.details.worksheets.map((worksheet: any, index: number) => (
            <Box key={index} sx={{ marginBottom: 4 }}>
              <h3>Worksheet: {worksheet.name}</h3>
              {/* Render each worksheet using DisplayWorksheet */}
              <DisplayDPGF worksheet={worksheet} />
            </Box>
          ))}
        </Box>
      )}
      {/* Temp read in place component */}
      <Box sx={{ width: '100%' }}>
        <DisplayDPGFInPlace />
      </Box>
    </Box>
  );
};

export default NewProject;
