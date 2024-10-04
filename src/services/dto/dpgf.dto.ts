// /src/services/dto/dpgf.dto.ts

export interface Worksheet {
  name: string;
  head: { [key: string]: string[] }; // Assuming head contains rows in key-value pairs
  df: { [key: string]: string[] };    // df also contains rows, each mapped by row_x
}

export interface UploadDPGFResponseDTO {
  status: string;
  filename: string;
  file_key: string;
  summary: { [key: string]: (string | null)[] }; // Summary object where each key is a string and values are arrays of strings or nulls
  details: {
    worksheet_count: number;
    worksheets: Worksheet[];
  };
}