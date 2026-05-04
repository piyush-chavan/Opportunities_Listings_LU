import { useState, useEffect } from 'react';
import OpportunityCardInternship from './OpportunityCardInternship';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import { processBackendResponse } from '../utils/apiResponseProcessor';
import '../App.css';
import './summerPrograms.css';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SkeletonGrid from './Skeleton/SkeletonGrid';
import HomePageSkeleton from './Skeleton/HomePageSkeleton';

const ITEMS_PER_PAGE = 12;
const EXCEL_FILE_NAME = 'LU Mastersheet.xlsx';
const SHEET_NAME = 'Summer Programs Database';

// Helper: parse age strings into array of integers (individual ages)
const parseAgeString = (s) => {
  if (!s) return [];
  const raw = String(s).trim();
  const nums = raw.match(/\d+/g) || [];
  // handle formats like '13-15'
  if (raw.includes('-') && nums.length >= 2) {
    const start = Number(nums[0]);
    const end = Number(nums[1]);
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      const out = [];
      for (let i = start; i <= end; i++) out.push(i);
      return out;
    }
  }
  // handle '16+' etc. cap upper limit to 18
  if (raw.includes('+') && nums.length >= 1) {
    const start = Number(nums[0]);
    const upper = 18;
    if (Number.isFinite(start)) {
      const out = [];
      for (let i = start; i <= upper; i++) out.push(i);
      return out;
    }
  }
  // handle '<8' style: keep lower limit to 6 and upper to num-1
  if (/^\s*<\s*\d+/.test(raw) && nums.length >= 1) {
    const limit = Number(nums[0]);
    const lower = 6;
    const upper = Math.max(lower, limit - 1);
    const out = [];
    for (let i = lower; i <= upper; i++) out.push(i);
    return out;
  }
  // comma separated or list of numbers
  if (nums.length >= 1) {
    return Array.from(new Set(nums.map(n => Number(n)).filter(n => Number.isFinite(n)))).sort((a, b) => a - b);
  }
  return [];
};

// Helper: parse grade strings into array of integers (individual grades)
const parseGradeString = (s) => {
  if (!s) return [];
  const raw = String(s).trim();
  const nums = raw.match(/\d+/g) || [];
  if (raw.includes('-') && nums.length >= 2) {
    const start = Number(nums[0]);
    const end = Number(nums[1]);
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      const out = [];
      for (let i = start; i <= end; i++) out.push(i);
      return out;
    }
  }
  if (raw.includes('+') && nums.length >= 1) {
    const start = Number(nums[0]);
    const upper = 12; // assume grade cap at 12
    if (Number.isFinite(start)) {
      const out = [];
      for (let i = start; i <= upper; i++) out.push(i);
      return out;
    }
  }
  if (nums.length >= 1) {
    return Array.from(new Set(nums.map(n => Number(n)).filter(n => Number.isFinite(n)))).sort((a, b) => a - b);
  }
  return [];
};

// Helper: normalize deadline strings to YYYY-MM-DD when possible, fallback to year or original trimmed
const monthMap = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
const normalizeDeadline = (s) => {
  if (!s) return '';
  const raw = String(s).trim();
  // try month name patterns like 'Aug 15 2024' or '15 Aug 2024'
  let m = raw.match(/([A-Za-z]+)\s+(\d{1,2}),?\s*(20\d{2})/);
  if (m) {
    const mon = monthMap[m[1].toLowerCase().slice(0, 3)];
    const day = Number(m[2]);
    const year = Number(m[3]);
    if (mon && day && year) return `${year.toString().padStart(4, '0')}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  m = raw.match(/(\d{1,2})\s+([A-Za-z]+)\s*(20\d{2})/);
  if (m) {
    const day = Number(m[1]);
    const mon = monthMap[m[2].toLowerCase().slice(0, 3)];
    const year = Number(m[3]);
    if (mon && day && year) return `${year.toString().padStart(4, '0')}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  // try numeric D/M/Y or M/D/Y formats like 15/08/2024 or 08-15-2024
  m = raw.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})/);
  if (m) {
    // we can't be sure of order; assume day/month/year if day>12 else month/day/year is ambiguous.
    let a = Number(m[1]);
    let b = Number(m[2]);
    const year = Number(m[3]);
    let day = a, mon = b;
    if (a > 12) { day = a; mon = b; } else if (b > 12) { day = b; mon = a; } else { day = a; mon = b; }
    return `${year.toString().padStart(4, '0')}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  // try to extract a year
  m = raw.match(/(20\d{2})/);
  if (m) return m[1];
  return raw;
};
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; // seconds
  const date_info = new Date(utc_value * 1000);

  return date_info;
}
function getDeadlineStatus(date) {
  const today = new Date();
  const diffTime = date - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "passed";
  if (diffDays <= 15) return "urgent";
  return "normal";
}

const selectivity_mapping = {
  "Highly Selective": "Highly Recommended",
  "Selective": "Recommended",
  "General": "Can be considered",
  "Open": "Not Recommended"
}

// Helper: categorize cost values
const categorizeCost = (costStr) => {
  if (!costStr) return 'Other';
  const lower = costStr.toLowerCase().trim();
  if (lower.includes('free') || lower === '0') return 'Free';
  const nums = (costStr.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return 'Other';
  const maxNum = Math.max(...nums);
  if (maxNum < 5000) return 'Under 5000';
  if (maxNum >= 5000) return 'Over 5000';
  return 'Other';
};

// Helper: parse format values separated by /
const parseFormats = (formatStr) => {
  if (!formatStr) return [];
  return formatStr
    .split('/')
    .map(f => f.trim())
    .filter(f => f.length > 0)
    .map(f => {
      const lower = f.toLowerCase();
      if (lower.includes('residential')) return 'Residential';
      if (lower.includes('online')) return 'Online';
      if (lower.includes('commuter')) return 'Commuter';
      if (lower.includes('hybrid')) return 'Hybrid';
      return f;
    });
};

// Helper: categorize geographic access based on eligibility fields
const categorizeGeographicAccess = (opp) => {
  const eligibility = (opp['Eligibility Details from SOURCE'] || opp['Eligibility'] || '').toLowerCase();
  const residency = (opp['Residency'] || '').toLowerCase();
  const citizenship = (opp['Citizenship'] || '').toLowerCase();
  const geographicAccess = (opp['Geographic Access'] || '').toLowerCase();
  
  // Check for Global indicators
  if (geographicAccess.includes('global') || eligibility.includes('international') || eligibility.includes('global') || citizenship.includes('any')) {
    return ['Global'];
  }
  
  // Check for Region-Specific indicators
  if (geographicAccess.includes('region') || eligibility.includes('region') || residency.includes('region')) {
    return ['Region-Specific'];
  }
  
  // Check for Country-Specific indicators
  if (geographicAccess.includes('country') || residency.includes('country') || citizenship.includes('country') || eligibility.includes('resident')) {
    return ['Country-Specific'];
  }
  
  // Default to Global if no specific indicators
  return ['Global'];
};

function SummerProgramsListing() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen,setSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({
    luRating: '',
    luRemarks: '',
    programValue: '',
    notes: '',
    programName: '',
    host: '',
    country: '',
    subjectStream: '',
    subjectDetails: '',
    subject: '',
    dataYear: '',
    eligibility: '',
    geographicAccess: '',
    residency: '',
    citizenship: '',
    enrollmentRule: '',
    age: '',
    grade: '',
    format: '',
    formatDetails: '',
    duration: '',
    applicationBefore: '',
    allDeadlines: '',
    officialLink: '',
    cost: '',
    costDetails: '',
    selectivity: '',
    source: '',
    tagging: ''
  });
  const [uiFilters, setUiFilters] = useState(() => ({
    luRating: '', luRemarks: '', programValue: '', notes: '', programName: '', host: '', country: '', subjectStream: '', subjectDetails: '', subject: '', dataYear: '', eligibility: '', geographicAccess: '', residency: '', citizenship: '', enrollmentRule: '', age: '', grade: '', format: '', formatDetails: '', duration: '', applicationBefore: '', allDeadlines: '', officialLink: '', cost: '', costDetails: '', selectivity: '', source: '', tagging: ''
  }));

  // Filter UI State
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  
  // Multi-select filters (open by default, not in dropdown)
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedGeographicAccess, setSelectedGeographicAccess] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  
  // Other filters
  const [subjectStreamFilter, setSubjectStreamFilter] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
  }, [filters]);

  useEffect(() => {

    // keep UI in sync with filters when route params change
    setUiFilters({
      luRating: searchParams.get('luRating') || '',
      luRemarks: searchParams.get('luRemarks') || '',
      programValue: searchParams.get('programValue') || '',
      host: searchParams.get('host') || '',
      country: searchParams.get('country') || '',
      subjectStream: searchParams.get('subjectStream') || '',
      subject: searchParams.get('subject') || '',
      dataYear: searchParams.get('dataYear') || '',
      residency: searchParams.get('residency') || '',
      citizenship: searchParams.get('citizenship') || '',
      age: searchParams.get('age') || '',
      grade: searchParams.get('grade') || '',
      format: searchParams.get('format') || '',
      duration: searchParams.get('duration') || '',
      applicationBefore: searchParams.get('applicationBefore') || '',
      cost: searchParams.get('cost') || '',
      selectivity: searchParams.get('selectivity') || '',
      source: searchParams.get('source') || '',
      tagging: searchParams.get('tagging') || ''
    });
  }, [searchParams]);

  useEffect(() => { loadInitialData(); }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const countryDropdown = document.querySelector('.country-dropdown-container');
      const subjectDropdown = document.querySelector('.subject-dropdown-container');
      
      if (countryDropdown && !countryDropdown.contains(e.target)) {
        setCountryDropdownOpen(false);
      }
      if (subjectDropdown && !subjectDropdown.contains(e.target)) {
        setSubjectDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    let result = opportunities || [];
    if (filters.luRating) result = result.filter(o => (o['LU Rating'] || '').toLowerCase().includes(filters.luRating.toLowerCase()));
    if (filters.luRemarks) result = result.filter(o => (o['LU Remarks'] || '').toLowerCase().includes(filters.luRemarks.toLowerCase()));
    if (filters.programValue) result = result.filter(o => (o['Program Value'] || '').toLowerCase().includes(filters.programValue.toLowerCase()));
    if (filters.host) result = result.filter(o => (o['Host Institution / Organizer'] || '').toLowerCase().includes(filters.host.toLowerCase()));
    if (filters.dataYear) result = result.filter(o => (o['Data Year'] || '').toLowerCase().includes(filters.dataYear.toLowerCase()));
    if (filters.residency) result = result.filter(o => (o['Residency'] || '').toLowerCase().includes(filters.residency.toLowerCase()));
    if (filters.citizenship) result = result.filter(o => (o['Citizenship'] || '').toLowerCase().includes(filters.citizenship.toLowerCase()));
    if (filters.age) {
      const sel = Number(filters.age);
      result = result.filter(o => Array.isArray(o._ageList) && o._ageList.includes(sel));
    }
    if (filters.grade) {
      const sel = Number(filters.grade);
      result = result.filter(o => Array.isArray(o._gradeList) && o._gradeList.includes(sel));
    }
    
    // NEW MULTI-SELECT FILTERS
    
    // Cost filter: check if any selected cost category matches the program's cost category
    if (selectedCosts && selectedCosts.length > 0) {
      result = result.filter(o => {
        const costCategory = categorizeCost(o['Cost'] || o['Cost Details'] || '');
        return selectedCosts.includes(costCategory);
      });
    }
    
    // Geographic Access filter
    if (selectedGeographicAccess && selectedGeographicAccess.length > 0) {
      result = result.filter(o => {
        const progAccess = categorizeGeographicAccess(o);
        return selectedGeographicAccess.some(sel => progAccess.some(pa => pa.toLowerCase() === sel.toLowerCase()));
      });
    }
    
    // Format filter: check if any selected format matches any of the program's formats
    if (selectedFormats && selectedFormats.length > 0) {
      result = result.filter(o => {
        const programFormats = parseFormats(o['Format'] || o['Format Details'] || '');
        return selectedFormats.some(sf => programFormats.some(pf => pf.toLowerCase() === sf.toLowerCase()));
      });
    }
    
    // Subject Stream (single select dropdown)
    if (subjectStreamFilter && subjectStreamFilter !== 'All streams') {
      result = result.filter(o => {
        const subjectStream = (o['Subject Stream'] || '').toLowerCase();
        return subjectStream.includes(subjectStreamFilter.toLowerCase());
      });
    }
    
    // Subjects (multi-select)
    if (selectedSubjects && selectedSubjects.length > 0) {
      result = result.filter(o => {
        const subjects = (o['Subject'] || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        return selectedSubjects.some(sel => 
          subjects.some(subj => subj.toLowerCase() === sel.toLowerCase())
        );
      });
    }
    
    // Countries (multi-select)
    if (selectedCountries && selectedCountries.length > 0) {
      result = result.filter(o => {
        const country = (o['Country'] || '').trim();
        return selectedCountries.some(sel => sel.toLowerCase() === country.toLowerCase());
      });
    }
    
    // Upcoming Programs Only filter
    if (upcomingOnly) {
      result = result.filter(o => {
        const deadline = o['Application Deadline'];
        if (!deadline) return true;
        const today = new Date();
        return deadline > today;
      });
    }
    
    if (filters.duration) result = result.filter(o => (o['Duration/Timeline'] || o['Duration / Timeline'] || '').toLowerCase().includes(filters.duration.toLowerCase()));
    if (filters.selectivity) result = result.filter(o => (o['Selectivity'] || '').toLowerCase().includes(filters.selectivity.toLowerCase()));
    if (filters.source) result = result.filter(o => (o['Source'] || '').toLowerCase().includes(filters.source.toLowerCase()));
    if (filters.tagging) result = result.filter(o => (o['Tagging'] || '').toLowerCase().includes(filters.tagging.toLowerCase()));
    if (filters.applicationBefore) {
      result = result.filter(o => {
        const dl = o['Application Deadline'] || o['All Deadlines'] || '';
        const m = String(dl).match(/\b(20\d{2})\b/);
        if (!m) return false;
        const year = Number(m[1]);
        return year < Number(filters.applicationBefore);
      });
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(opportunity => Object.values(opportunity).some(v => String(v || '').toLowerCase().includes(q)));
    }

    setFilteredOpportunities(result);
    setCurrentPage(1);
  }, [searchQuery, filters, opportunities, selectedCosts, selectedGeographicAccess, selectedFormats, subjectStreamFilter, selectedSubjects, selectedCountries, upcomingOnly]);

  // Auto-apply filters whenever UI filters change
  useEffect(() => {
    setFilters({ ...uiFilters });
  }, [uiFilters]);

  const clearUiFilters = () => {
    const empty = Object.keys(uiFilters).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
    setUiFilters(empty);
    setSelectedCosts([]);
    setSelectedGeographicAccess([]);
    setSelectedFormats([]);
    setSelectedSubjects([]);
    setSelectedCountries([]);
    setSubjectStreamFilter('All streams');
    setUpcomingOnly(true);
    setCountrySearch('');
    setSubjectSearch('');
    toast("Filters Cleared");
  };

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://googlesheetdata-backend.onrender.com/sheet?type=Summer Programs Database');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const jsonData = await response.json();
      const data = processBackendResponse(jsonData);
      
      // Normalize ages, grades and deadlines for consistent filtering/display
      const processed = data.map((opp) => {
        const copy = { ...opp };
        try {
          copy._ageList = parseAgeString(copy['Age'] || copy['Ages'] || '');
        } catch (e) { copy._ageList = []; }
        try {
          copy._gradeList = parseGradeString(copy['Grade'] || '');
        } catch (e) { copy._gradeList = []; }
        // Normalize deadlines
        const rawDl = copy['Application Deadline'] || '';
        copy['Application Deadline'] = excelDateToJSDate(rawDl);
        // copy['All Deadlines'] = normalizeDeadline(copy['All Deadlines'] || '');
        return copy;
      });

      setOpportunities(processed);
      setFilteredOpportunities(processed);
      if (data.length > 0) {
        const availableColumns = Object.keys(data[0]).filter(k => k !== 'id');
        console.log('Summer Program columns:', availableColumns);
      }
    } catch (err) {
      console.error(err);
      setError(`Could not load summer programs data from backend: ${err.message}`);
      setOpportunities([]);
      setFilteredOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadOriginal = async () => { setSearchQuery(''); await loadInitialData(); };

  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  const uniqueCountries = Array.from(new Set(opportunities.map(o => (o['Country'] || '').trim()).filter(Boolean))).sort();
  
  // Extract individual subjects from Subject field (comma-separated)
  const uniqueSubjects = Array.from(
    new Set(
      opportunities
        .flatMap(o =>
          (o['Subject'] || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        )
    )
  ).sort();
  
  // Extract unique subject streams
  const subjectStreams = ['All streams', 'STEM', 'Mathematics', 'Commerce', 'Business', 'Humanities', 'Media', 'Leadership', 'Multidisciplinary'];
  
  // Extract unique geographic access categories
  const uniqueGeographicAccess = Array.from(
    new Set(
      opportunities
        .flatMap(o => categorizeGeographicAccess(o))
    )
  ).sort();
  
  // Extract unique formats from / separated values
  const uniqueFormats = Array.from(
    new Set(
      opportunities
        .flatMap(o => parseFormats(o['Format'] || o['Format Details'] || ''))
    )
  ).sort();
  
  // Extract unique cost categories
  const uniqueCostCategories = Array.from(
    new Set(
      opportunities.map(o => categorizeCost(o['Cost'] || o['Cost Details'] || ''))
    )
  ).sort();
  const allGrades = opportunities.flatMap(o => (o._gradeList || []));
  const uniqueGrades = Array.from(new Set(allGrades)).sort((a, b) => a - b).map(String);
  // derive individual ages from parsed age lists
  const allAges = opportunities.flatMap(o => (o._ageList || []));
  const uniqueAges = Array.from(new Set(allAges)).sort((a, b) => a - b).map(String);
  const uniqueSelectivity = Array.from(new Set(opportunities.map(o => (o['Selectivity'] || '').trim()).filter(Boolean))).sort();
  const uniqueHosts = Array.from(new Set(opportunities.map(o => (o['Host Institution / Organizer'] || '').trim()).filter(Boolean))).sort();
  const uniqueEligibility = Array.from(new Set(opportunities.map(o => (o['Eligibility Details from SOURCE'] || o['Eligibility'] || '').trim()).filter(Boolean))).sort();
  const uniqueResidency = Array.from(new Set(opportunities.map(o => (o['Residency'] || '').trim()).filter(Boolean))).sort();
  const uniqueCitizenship = Array.from(new Set(opportunities.map(o => (o['Citizenship'] || '').trim()).filter(Boolean))).sort();
  const uniqueEnrollment = Array.from(new Set(opportunities.map(o => (o['Enrollment Rule (School)'] || '').trim()).filter(Boolean))).sort();
  const uniqueDurations = Array.from(new Set(opportunities.map(o => ((o['Duration/Timeline'] || o['Duration / Timeline'] || '')).trim()).filter(Boolean))).sort();
  const uniqueProgramValues = Array.from(new Set(opportunities.map(o => (o['Program Value'] || '').trim()).filter(Boolean))).sort();
  const uniqueDataYears = Array.from(new Set(opportunities.map(o => (o['Data Year'] || '').trim()).filter(Boolean))).sort();
  const uniqueCosts = Array.from(new Set(opportunities.map(o => ((o['Cost'] || o['Cost Details'] || '')).trim()).filter(Boolean))).sort();

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div style={{flex:2}}>
              <p className="app-subtitle">Summer Programs</p>
              {opportunities.length > 0 && (
            <div className="file-info"><span className="file-count">
              {filteredOpportunities.length === opportunities.length
                ? `Showing ${opportunities.length} summer programs`
                : `Showing ${filteredOpportunities.length} of ${opportunities.length} summer programs`
              }
            </span></div>
          )}
            </div>
            <div  style={{flex:4,maxHeight:'100%'}}>
              {opportunities.length > 0 && (<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />)}
            </div>
            <div style={{flex:1}} className="upload-buttons">
              <button type="button" className="reload-button" onClick={handleReloadOriginal} disabled={loading}><i class="fa-solid fa-arrow-rotate-right"></i></button>
            </div>
          </div>
        </div>
      </header>
      <div className='summer-programs-body-container'>
        <div className="sidebar-toggle">
          <i onClick={()=>setSidebarOpen(!sidebarOpen)} style={{cursor:'pointer'}} class="fa-solid fa-bars"></i>
        </div>
        <div className={`summer-programs-sidebar ${sidebarOpen?"":"sidebar-closed"}`}>
          
          {opportunities.length > 0 && (
            <div className="file-info"><span className="file-count">
              {filteredOpportunities.length === opportunities.length
                ? `Showing ${opportunities.length} summer programs`
                : `Showing ${filteredOpportunities.length} of ${opportunities.length} summer programs`
              }
            </span></div>
          )}
          <div className="filters-container summer-programs-filters-container">
            <div className="filters-header">
              <span style={{ cursor: 'pointer' }} onClick={clearUiFilters}><i className="fa-solid fa-times"></i> Clear Filters</span>
            </div>

            {/* 1. Cost Filter - Open Checkboxes */}
            <div className="filter-section">
              <div className="filter-title">💰 Cost</div>
              <div className="filter-helper-text">How expensive the program is</div>
              <div className="checkbox-group">
                {uniqueCostCategories.map(c => (
                  <label key={c} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCosts.includes(c)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCosts([...selectedCosts, c]);
                        } else {
                          setSelectedCosts(selectedCosts.filter(sc => sc !== c));
                        }
                      }}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Geographic Access Filter - Open Checkboxes */}
            <div className="filter-section">
              <div className="filter-title">🌍 Geographic Access</div>
              <div className="filter-helper-text">Where students can apply from</div>
              <div className="checkbox-group">
                {uniqueGeographicAccess.length > 0 ? (
                  uniqueGeographicAccess.map(g => (
                    <label key={g} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedGeographicAccess.includes(g)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGeographicAccess([...selectedGeographicAccess, g]);
                          } else {
                            setSelectedGeographicAccess(selectedGeographicAccess.filter(sg => sg !== g));
                          }
                        }}
                      />
                      <span>{g}</span>
                    </label>
                  ))
                ) : (
                  ['Global', 'Region-Specific', 'Country-Specific'].map(g => (
                    <label key={g} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedGeographicAccess.includes(g)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGeographicAccess([...selectedGeographicAccess, g]);
                          } else {
                            setSelectedGeographicAccess(selectedGeographicAccess.filter(sg => sg !== g));
                          }
                        }}
                      />
                      <span>{g}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 3. Format Filter - Open Checkboxes */}
            <div className="filter-section">
              <div className="filter-title">🎓 Format</div>
              <div className="filter-helper-text">How the program is delivered</div>
              <div className="checkbox-group">
                {uniqueFormats.map(f => (
                  <label key={f} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(f)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFormats([...selectedFormats, f]);
                        } else {
                          setSelectedFormats(selectedFormats.filter(sf => sf !== f));
                        }
                      }}
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Subject Stream Filter - Single Select Dropdown */}
            <div className="filter-section">
              <div className="filter-title">📚 Subject Stream</div>
              <div className="filter-helper-text">Broad academic category</div>
              <select value={subjectStreamFilter} onChange={(e) => setSubjectStreamFilter(e.target.value)} className="filter-select">
                {subjectStreams.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 5. Subject Filter - Searchable Multi-Select Dropdown */}
            <div className="filter-section subject-dropdown-container">
              <div className="filter-title">📖 Subject</div>
              <div className="filter-helper-text">Specific academic subject</div>
              <button 
                className="dropdown-trigger"
                onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
              >
                {selectedSubjects.length > 0 ? `${selectedSubjects.length} selected` : 'Search subjects…'} ▼
              </button>
              {subjectDropdownOpen && (
                <div className="dropdown-menu">
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    className="dropdown-search"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                  />
                  <div className="dropdown-options">
                    {uniqueSubjects
                      .filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()))
                      .map(s => (
                        <label key={s} className="dropdown-option">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(s)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubjects([...selectedSubjects, s]);
                              } else {
                                setSelectedSubjects(selectedSubjects.filter(ss => ss !== s));
                              }
                            }}
                          />
                          {s}
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Country Filter - Searchable Multi-Select Dropdown */}
            <div className="filter-section country-dropdown-container">
              <div className="filter-title">🌐 Country</div>
              <div className="filter-helper-text">Program's host country</div>
              <button 
                className="dropdown-trigger"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              >
                {selectedCountries.length > 0 ? `${selectedCountries.length} selected` : 'Search countries…'} ▼
              </button>
              {countryDropdownOpen && (
                <div className="dropdown-menu">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="dropdown-search"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                  <div className="dropdown-options">
                    {uniqueCountries
                      .filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
                      .map(c => (
                        <label key={c} className="dropdown-option">
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(c)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCountries([...selectedCountries, c]);
                              } else {
                                setSelectedCountries(selectedCountries.filter(sc => sc !== c));
                              }
                            }}
                          />
                          {c}
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* 7. Upcoming Programs Only - Single Checkbox */}
            <div className="filter-section">
              <div className="filter-title">📅 Upcoming Programs</div>
              <div className="filter-helper-text">Hide programs with passed deadlines</div>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={upcomingOnly}
                  onChange={(e) => setUpcomingOnly(e.target.checked)}
                />
                <span>Show only upcoming</span>
              </label>
            </div>

            {/* Additional Filters - Collapsed */}
            <details>
              <summary style={{ cursor: 'pointer' }}>More Filters</summary>
              <select value={uiFilters.host} onChange={(e) => setUiFilters({ ...uiFilters, host: e.target.value })}>
                <option value="">All Hosts</option>
                {uniqueHosts.map(h => <option key={h} value={h}>{h}</option>)}
              </select>

              <select value={uiFilters.residency} onChange={(e) => setUiFilters({ ...uiFilters, residency: e.target.value })}>
                <option value="">All Residency</option>
                {uniqueResidency.map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <select value={uiFilters.citizenship} onChange={(e) => setUiFilters({ ...uiFilters, citizenship: e.target.value })}>
                <option value="">All Citizenship</option>
                {uniqueCitizenship.map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <select value={uiFilters.dataYear} onChange={(e) => setUiFilters({ ...uiFilters, dataYear: e.target.value })}>
                <option value="">Data Years</option>
                {uniqueDataYears.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </details>

          </div>
        </div>

        <main className="summer-programs-content-container">
          <div>


            {error && <div className="error-message">{error}</div>}
            {/* {loading && <div className="loading-container"><div className="spinner"></div><p>Loading summer programs...</p></div>} */}
            {loading && <SkeletonGrid count={12}/>}

            {!loading && filteredOpportunities.length > 0 && (
              <>
                <div className="opportunities-grid">
                  {currentOpportunities.map((opportunity, index) => (
                    <OpportunityCardInternship key={opportunity.id} opportunity={opportunity} index={startIndex + index} />
                  ))}
                </div>
                {totalPages > 1 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />)}
              </>
            )}

            {!loading && opportunities.length === 0 && !error && (
              <div className="empty-state"><h3>No summer programs found</h3><p>Reload or add LU Mastersheet.xlsx with an "Summer Programs" sheet.</p></div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SummerProgramsListing;
