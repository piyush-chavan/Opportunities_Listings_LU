import { useState, useEffect } from 'react';
import OpportunityCardInternship from './OpportunityCardInternship';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import { loadExcelSheetFromAssets } from '../utils/excelParser';
import '../App.css';
import './summerPrograms.css';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 12;
const EXCEL_FILE_NAME = 'LU Mastersheet (1).xlsx';
const SHEET_NAME = 'Summer Programs';

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
const selectivity_mapping = {
  "Highly Selective": "Highly Recommended",
  "Selective": "Recommended",
  "General": "Can be considered",
  "Open": "Not Recommended"
}

function SummerProgramsListing() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

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

  useEffect(() => {
    let result = opportunities || [];
    if (filters.luRating) result = result.filter(o => (o['LU Rating'] || '').toLowerCase().includes(filters.luRating.toLowerCase()));
    if (filters.luRemarks) result = result.filter(o => (o['LU Remarks'] || '').toLowerCase().includes(filters.luRemarks.toLowerCase()));
    if (filters.programValue) result = result.filter(o => (o['Program Value'] || '').toLowerCase().includes(filters.programValue.toLowerCase()));
    if (filters.host) result = result.filter(o => (o['Host Institution / Organizer'] || '').toLowerCase().includes(filters.host.toLowerCase()));
    if (filters.country) result = result.filter(o => (o['Country'] || '').toLowerCase().includes(filters.country.toLowerCase()));
    if (filters.subjectStream) result = result.filter(o => (o['Subject Stream'] || '').toLowerCase().includes(filters.subjectStream.toLowerCase()));
    if (filters.subject) result = result.filter(o => (o['Subject'] || '').toLowerCase().includes(filters.subject.toLowerCase()));
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
    if (filters.format) result = result.filter(o => (o['Format'] || o['Format Details'] || '').toLowerCase().includes(filters.format.toLowerCase()));
    if (filters.duration) result = result.filter(o => (o['Duration/Timeline'] || o['Duration / Timeline'] || '').toLowerCase().includes(filters.duration.toLowerCase()));
    if (filters.selectivity) result = result.filter(o => (o['Selectivity'] || '').toLowerCase().includes(filters.selectivity.toLowerCase()));
    if (filters.cost) result = result.filter(o => (o['Cost'] || '').toLowerCase().includes(filters.cost.toLowerCase()));
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
  }, [searchQuery, filters, opportunities]);

  // Apply UI filters when user clicks Apply
  const applyUiFilters = () => {
    setFilters({ ...uiFilters });
    toast("Filters Applied");
  };

  const clearUiFilters = () => {
    const empty = Object.keys(uiFilters).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
    setUiFilters(empty);
    setFilters(empty);
    toast("Filters Cleared");
  };

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadExcelSheetFromAssets(EXCEL_FILE_NAME, SHEET_NAME);
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
        const rawDl = copy['Application Deadline'] || copy['All Deadlines'] || '';
        copy['Application Deadline'] = normalizeDeadline(rawDl);
        copy['All Deadlines'] = normalizeDeadline(copy['All Deadlines'] || '');
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
      setError('Could not load summer programs sheet. Confirm LU Mastersheet.xlsx exists in public/assets and has a sheet named "Summer Program"');
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
  // const uniqueSubjects = Array.from(new Set(opportunities.map(o => ((o['Subject Stream']||o['Subject(s) Details from SOURCE']||'')).trim()).filter(Boolean))).sort();
  const uniqueSubjects = Array.from(
    new Set(
      opportunities
        .flatMap(o =>
          (o['Subject Stream'] || '')
            .split(',')                 // split by comma
            .map(s => s.trim())        // clean spaces
            .filter(Boolean)           // remove empty
        )
    )
  ).sort();
  const uniqueFormats = Array.from(new Set(opportunities.map(o => ((o['Format'] || o['Format Details'] || '')).trim()).filter(Boolean))).sort();
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
            <div>
              <p className="app-subtitle">Summer Programs</p>
            </div>
            <div className="upload-buttons">
              <button type="button" className="reload-button" onClick={handleReloadOriginal} disabled={loading}><i class="fa-solid fa-arrow-rotate-right"></i> Reload Summer Programs</button>
            </div>
          </div>
        </div>
      </header>
      <div className='summer-programs-body-container'>
        <div className="summer-programs-sidebar">
          <div className="upload-section">

          </div>

          <div style={{ position: 'sticky', top: 0, borderRadius: '20px', backgroundColor: '#413f3f7d', backdropFilter: 'blur(10px)', padding: '20px 10px' }}>

            {opportunities.length > 0 && (<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />)}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="navbar-btn" style={{ backgroundColor: '#24c542' }} onClick={applyUiFilters}><i class="fa-solid fa-filter"></i> Apply Filters</button>
              <button className="navbar-btn" style={{ backgroundColor: '#c56224' }} onClick={clearUiFilters}><i class="fa-solid fa-times"></i> Clear Filters</button>
            </div>
          </div>
          {opportunities.length > 0 && (
            <div className="file-info"><span className="file-count">
              {filteredOpportunities.length === opportunities.length
                ? `${opportunities.length} summer programs loaded`
                : `Showing ${filteredOpportunities.length} of ${opportunities.length} summer programs`
              }
            </span></div>
          )}
          <br />
          <div className="filters-container summer-programs-filters-container">
            <select value={uiFilters.subject} onChange={(e) => setUiFilters({ ...uiFilters, subject: e.target.value })}>
              <option value="">All Subjects</option>
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={uiFilters.grade} onChange={(e) => setUiFilters({ ...uiFilters, grade: e.target.value })}>
              <option value="">All Grades</option>
              {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={uiFilters.country} onChange={(e) => setUiFilters({ ...uiFilters, country: e.target.value })}>
              <option value="">All Countries</option>
              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={uiFilters.format} onChange={(e) => setUiFilters({ ...uiFilters, format: e.target.value })}>
              <option value="">All Formats</option>
              {uniqueFormats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={uiFilters.selectivity} onChange={(e) => setUiFilters({ ...uiFilters, selectivity: e.target.value })}>
              <option value="">All Selectivity</option>
              {uniqueSelectivity.map(s => <option key={s} value={s}>{selectivity_mapping[s]}</option>)}
            </select>



            <select value={uiFilters.age} onChange={(e) => setUiFilters({ ...uiFilters, age: e.target.value })}>
              <option value="">All Ages</option>
              {uniqueAges.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
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

            {/* <select value={uiFilters.duration} onChange={(e)=> setUiFilters({...uiFilters, duration: e.target.value})}>
              <option value="">All Durations</option>
              {uniqueDurations.map(v => <option key={v} value={v}>{v}</option>)}
            </select> */}



            <select value={uiFilters.dataYear} onChange={(e) => setUiFilters({ ...uiFilters, dataYear: e.target.value })}>
              <option value="">Data Years</option>
              {uniqueDataYears.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <select value={uiFilters.cost} onChange={(e) => setUiFilters({ ...uiFilters, cost: e.target.value })}>
              <option value="">All Costs</option>
              {uniqueCosts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>





          </div>
        </div>

        <main className="summer-programs-content-container">
          <div>


            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-container"><div className="spinner"></div><p>Loading summer programs...</p></div>}

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
