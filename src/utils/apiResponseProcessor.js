/**
 * Convert backend API response format to opportunities object format
 * Backend returns: { data: [[header1, header2, ...], [value1, value2, ...], ...] }
 * Convert to: [{ header1: value1, header2: value2, ... }, ...]
 * @param {Object} apiResponse - Response from backend API with { data: [...] }
 * @returns {Array} Array of opportunity objects
 */
export const processBackendResponse = (apiResponse) => {
  try {
    // Extract data array from response
    const rows = apiResponse.data || [];
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }
    
    // First row contains headers
    const headers = rows[0]
      .map(h => String(h).trim())
      .filter(h => h);
    
    if (headers.length === 0) {
      return [];
    }
    
    // Convert remaining rows to objects
    const opportunities = rows
      .slice(1)
      .map((row, index) => {
        const opportunity = {};
        
        headers.forEach((header, colIndex) => {
          opportunity[header] = 
            row[colIndex] !== undefined && row[colIndex] !== null
              ? String(row[colIndex]).trim()
              : '';
        });
        
        return opportunity;
      })
      .filter(opp => 
        // Filter out completely empty rows
        Object.values(opp).some(val => val !== '')
      )
      .map((opp, index) => ({
        ...opp,
        id: index + 1
      }));
    
    return opportunities;
  } catch (error) {
    console.error('Error processing backend response:', error);
    return [];
  }
};
