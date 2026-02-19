# Opportunities Listing App

A modern React application for displaying opportunities from Excel files with pagination and a beautiful UI.

## Features

- 📊 **Excel File Support**: Upload and parse Excel files (.xlsx, .xls)
- 📄 **Pagination**: Navigate through opportunities with customizable items per page
- 🎨 **Modern UI**: Clean, responsive design with beautiful opportunity cards
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Built with Vite for optimal performance

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your Excel file in the `public/assets/` folder and name it `opportunities.xlsx` (or update `EXCEL_FILE_NAME` in `src/App.jsx`)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Configuration

### Items Per Page
Edit the `ITEMS_PER_PAGE` constant in `src/App.jsx`:
```javascript
const ITEMS_PER_PAGE = 12; // Change this value
```

### Excel File Name
Edit the `EXCEL_FILE_NAME` constant in `src/App.jsx`:
```javascript
const EXCEL_FILE_NAME = 'opportunities.xlsx'; // Change this value
```

## Excel File Format

- First row should contain headers (column names)
- All subsequent rows are opportunity records
- Empty rows will be filtered out automatically

## Project Structure

```
├── public/
│   └── assets/          # Place Excel files here
├── src/
│   ├── components/
│   │   ├── OpportunityCard.jsx
│   │   ├── OpportunityCard.css
│   │   ├── Pagination.jsx
│   │   └── Pagination.css
│   ├── utils/
│   │   └── excelParser.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Technologies Used

- React 18
- Vite
- XLSX (for Excel parsing)
- Modern CSS with CSS Variables
