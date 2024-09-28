import React from 'react';

// Helper function to transpose the data
const transposeData = (df) => {
  const keys = Object.keys(df);
  const numRows = df[keys[0]].length;  // Assuming all columns have the same length
  const transposed = [];

  for (let i = 0; i < numRows; i++) {
    const row = keys.map((key) => df[key][i]);  // Create a row from each column
    transposed.push(row);
  }

  return transposed;
};

const WorksheetTable = ({ worksheets }) => {
  return (
    <div>
      {worksheets.map((worksheet, index) => {
        const transposedData = transposeData(worksheet.df);

        return (
          <div key={index}>
            <h2>Worksheet {index + 1}</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
              <thead>
                <tr>
                  <th>Column</th>
                  {Object.keys(worksheet.df).map((colKey, idx) => (
                    <th key={idx}>{colKey}</th>  // Column headers: column_0, column_1, etc.
                  ))}
                </tr>
              </thead>
              <tbody>
                {transposedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>Row {rowIndex + 1}</td> {/* Row index or any other identifier */}
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>  // Render each cell in the transposed row
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default WorksheetTable;
