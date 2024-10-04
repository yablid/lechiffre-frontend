// src/services/dpgf.service.ts
import api from '../api/default';
import { UploadDPGFResponseDTO } from './dto/dpgf.dto';

export const uploadDPGF = async (file: File): Promise<UploadDPGFResponseDTO> => {

  console.log("project.service.uploadDPGF uploading file name: ", file.name, "(size: ", file.size, "bytes)");

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('project/dpgf/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("File uploaded successfully. Server response:");
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
