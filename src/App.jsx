// import React, { useState, useEffect } from 'react';
// import OpportunityCard from './components/OpportunityCard';
// import Pagination from './components/Pagination';
// import ThemeToggle from './components/ThemeToggle';
// import SearchBar from './components/SearchBar';
// import { parseExcelFile, loadExcelFromAssets } from './utils/excelParser';
// import './App.css';

// // Configuration: Set items per page here
// const ITEMS_PER_PAGE = 12;

// // Configuration: Set Excel file name here (should be in assets folder)
// const EXCEL_FILE_NAME = 'Standout Search Data.xlsx';

// // Configuration: Columns to display in opportunity cards
// // Set to null to show all columns, or provide an array of column names to show only specific columns
// // Example: ['Company Name', 'Location', 'Industry'] - only these columns will be shown
// // To see available columns, check the Excel file headers or check browser console after loading
// const COLUMNS_TO_DISPLAY = null; // Set to null to show all columns

// function App() {
//   const [opportunities, setOpportunities] = useState([]);
//   const [filteredOpportunities, setFilteredOpportunities] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fileInput, setFileInput] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     try {
//       const saved = localStorage.getItem('darkMode');
//       return saved ? JSON.parse(saved) : false;
//     } catch (e) {
//       return false;
//     }
//   });

//   // Apply dark mode theme
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.setAttribute('data-theme', 'dark');
//     } else {
//       document.documentElement.removeAttribute('data-theme');
//     }
//     try {
//       localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
//     } catch (e) {
//       console.warn('Could not save dark mode preference:', e);
//     }
//   }, [isDarkMode]);

//   // Load Excel file from assets on component mount
//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   // Filter opportunities based on search query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredOpportunities(opportunities);
//       setCurrentPage(1);
//       return;
//     }

//     const query = searchQuery.toLowerCase().trim();
//     const filtered = opportunities.filter(opportunity => {
//       return Object.values(opportunity).some(value => {
//         if (value === null || value === undefined) return false;
//         return String(value).toLowerCase().includes(query);
//       });
//     });
    
//     setFilteredOpportunities(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, opportunities]);

//   const loadInitialData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await loadExcelFromAssets(EXCEL_FILE_NAME);
//       setOpportunities(data);
//       setFilteredOpportunities(data);
//       // Log available columns for configuration reference
//       if (data.length > 0) {
//         const availableColumns = Object.keys(data[0]).filter(key => key !== 'id');
//         console.log('Available columns:', availableColumns);
//         console.log('To filter columns, update COLUMNS_TO_DISPLAY in App.jsx');
//       }
//     } catch (err) {
//       // If file doesn't exist in assets, that's okay - user can upload
//       console.log('Excel file not found in assets:', err.message);
//       setError('No Excel file found. Please upload one using the button below.');
//       setOpportunities([]);
//       setFilteredOpportunities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReloadOriginal = async () => {
//     setSearchQuery(''); // Clear search when reloading
//     await loadInitialData();
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const validTypes = [
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'application/vnd.ms-excel',
//       'text/csv'
//     ];
    
//     if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
//       setError('Please upload a valid Excel file (.xlsx or .xls)');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const data = await parseExcelFile(file);
//       setOpportunities(data);
//       setFilteredOpportunities(data);
//       setSearchQuery(''); // Clear search when uploading new file
//       setCurrentPage(1); // Reset to first page
//       setFileInput(null); // Reset file input
//       // Log available columns for configuration reference
//       if (data.length > 0) {
//         const availableColumns = Object.keys(data[0]).filter(key => key !== 'id');
//         console.log('Available columns:', availableColumns);
//         console.log('To filter columns, update COLUMNS_TO_DISPLAY in App.jsx');
//       }
//     } catch (err) {
//       setError(`Error parsing Excel file: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate pagination based on filtered opportunities
//   const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentOpportunities = filteredOpportunities.slice(startIndex, endIndex);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="app">
//       <header className="app-header">
//         <div className="container">
//           <div className="header-content">
//             <div>
//               <h1 className="app-title">Opportunities Listing</h1>
//               <p className="app-subtitle">Browse and explore available opportunities</p>
//             </div>
//             <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
//           </div>
//         </div>
//       </header>

//       <main className="app-main">
//         <div className="container">
//           {/* File Upload Section */}
//           <div className="upload-section">
//           <div className="upload-buttons">

// {/* Hidden File Input */}
// <input
//   type="file"
//   accept=".xlsx, .xls"
//   id="excel-upload"
//   style={{ display: "none" }}
//   onChange={handleFileUpload}
// />

// {/* Upload Button */}
// <button
//   type="button"
//   className="upload-button"
//   onClick={() => document.getElementById("excel-upload").click()}
//   title="Excel file from device"
// >
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M10 2V14M10 2L6 6M10 2L14 6M2 16H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
//   Upload Excel File
// </button>

// {/* Reload Button */}
// <button 
//   type="button"
//   className="reload-button"
//   onClick={handleReloadOriginal}
//   disabled={loading}
//   title="Reload original Excel file from assets"
// >
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M10 1V5M10 15V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M1 10H5M15 10H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
//   Reload Original
// </button>

// </div>
//             {opportunities.length > 0 && (
//               <div className="file-info">
//                 <span className="file-count">
//                   {filteredOpportunities.length === opportunities.length 
//                     ? `${opportunities.length} opportunities loaded`
//                     : `Showing ${filteredOpportunities.length} of ${opportunities.length} opportunities`
//                   }
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Search Bar */}
//           {opportunities.length > 0 && (
//             <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="error-message">
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M10 10V14M10 6H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               {error}
//             </div>
//           )}

//           {/* Loading State */}
//           {loading && (
//             <div className="loading-container">
//               <div className="spinner"></div>
//               <p>Loading opportunities...</p>
//             </div>
//           )}

//           {/* Opportunities Grid */}
//           {!loading && filteredOpportunities.length > 0 && (
//             <>
//               <div className="opportunities-grid">
//                 {currentOpportunities.map((opportunity, index) => (
//                   <OpportunityCard 
//                     key={opportunity.id} 
//                     opportunity={opportunity} 
//                     index={startIndex + index}
//                     columnsToDisplay={COLUMNS_TO_DISPLAY}
//                   />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               )}

//               {/* Page Info */}
//               <div className="page-info">
//                 Showing {startIndex + 1} - {Math.min(endIndex, filteredOpportunities.length)} of {filteredOpportunities.length} opportunities
//               </div>
//             </>
//           )}

//           {/* Empty State */}
//           {!loading && opportunities.length === 0 && !error && (
//             <div className="empty-state">
//               <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M32 8L8 20V44L32 56L56 44V20L32 8Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M32 32L8 20M32 32L56 20M32 32V56" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               <h3>No opportunities found</h3>
//               <p>Upload an Excel file to get started</p>
//             </div>
//           )}

//           {/* No Search Results */}
//           {!loading && opportunities.length > 0 && filteredOpportunities.length === 0 && (
//             <div className="empty-state">
//               <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M29 29L35 35M32 24C28.134 24 25 27.134 25 31C25 34.866 28.134 38 32 38C35.866 38 39 34.866 39 31C39 27.134 35.866 24 32 24Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               <h3>No results found</h3>
//               <p>Try adjusting your search query</p>
//             </div>
//           )}
//         </div>
//       </main>

//       <footer className="app-footer">
//         <div className="container">
//           <p>&copy; 2026 Opportunities Listing App</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import Navbar from './components/Navbar';
import ListingPage from './components/ListingPage';
import { HashRouter as Router,Route,Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingPage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}
export default App;