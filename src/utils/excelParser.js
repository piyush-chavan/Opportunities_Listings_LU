import * as XLSX from 'xlsx';

/**
 * Parse Excel file and convert rows to opportunity objects
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Array of opportunity objects
 */
export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON (array of arrays)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        });

        if (jsonData.length < 2) {
          reject(new Error('Excel file must have at least a header row and one data row'));
          return;
        }

        // First row = headers
        const headers = jsonData[0]
          .map(h => String(h).trim())
          .filter(h => h);

        // Convert rows into objects
        const allOpportunities = jsonData
          .slice(1)
          .map((row) => {
            const opportunity = {};

            headers.forEach((header, colIndex) => {
              opportunity[header] =
                row[colIndex] !== undefined
                  ? String(row[colIndex]).trim()
                  : '';
            });

            return opportunity;
          })
          .filter(opp =>
            Object.values(opp).some(val => val !== '')
          );

        // Assign sequential IDs
        const opportunities = allOpportunities.map((opp, index) => ({
          ...opp,
          id: index + 1
        }));

        resolve(opportunities);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};


/**
 * Load Excel file from public/assets folder (CRA + GitHub Pages compatible)
 * @param {string} fileName - Name of Excel file inside public/assets
 * @returns {Promise<Array>} Array of opportunity objects
 */
export const loadExcelFromAssets = async (fileName) => {
  try {
    const filePath = `${process.env.PUBLIC_URL}/assets/${fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}`);
    }

    const blob = await response.blob();

    const file = new File(
      [blob],
      fileName,
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    return await parseExcelFile(file);

  } catch (error) {
    console.error('Error loading Excel from assets:', error);
    throw error;
  }
};