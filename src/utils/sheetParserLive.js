import { google } from 'googleapis';
import serviceAccount from './service_account.json';

/**
 * Parse Google Sheet (service account)
 * @param {string} spreadsheetId - Google Sheet ID
 * @param {string} sheetName - Sheet tab name (case-insensitive)
 * @returns {Promise<Array>} SAME FORMAT as your existing parser
 */
export const parseGoogleSheet = async (spreadsheetId="1uXPkjZVug-va0F67YL035GATEsoLu-8X5QTFxTK_5rA", sheetName = 'Summer Programs Database') => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch metadata to resolve sheet name (case-insensitive / fallback)
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const allSheetNames = meta.data.sheets.map(s => s.properties.title);

    let selectedSheet =
      allSheetNames.find(n => n.toLowerCase() === String(sheetName).toLowerCase()) ||
      allSheetNames.find(n => n.toLowerCase().includes(String(sheetName).toLowerCase())) ||
      allSheetNames[0];

    const range = `${selectedSheet}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const jsonData = response.data.values;

    if (!jsonData || jsonData.length < 2) {
      return [];
    }

    // ---- SAME LOGIC AS YOUR CURRENT PARSER ----
    const headers = jsonData[0]
      .map(h => String(h).trim())
      .filter(h => h);

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

    const opportunities = allOpportunities.map((opp, index) => ({
      ...opp,
      id: index + 1
    }));

    return opportunities;

  } catch (error) {
    console.error('Error reading Google Sheet:', error);
    throw error;
  }
};