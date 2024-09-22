// src/services/projectService.ts
import api from '../api/default';

export const uploadDPGF = async (file: File) => {

  console.log("project.service.uploadDPGF uploading file name: ", file.name, "(size: ", file.size, "bytes)");

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('project/uploadDPGF', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

/*    console.log("File uploaded successfully. Server response:");
    console.log("Response Data:", response.data);*/

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
