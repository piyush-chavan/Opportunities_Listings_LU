import { useState, useEffect } from 'react';
import CourseTableCard from './CourseTableCard';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import { loadExcelSheetFromAssets } from '../utils/excelParser';
import '../App.css';
import './courses.css';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 12;
const EXCEL_FILE_NAME = 'LU Mastersheet.xlsx';
const SHEET_NAME = 'Courses Database';

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

function CoursesListing() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    subjectStream: '',
    grade: '',
    applicationBefore: '',
    country: '',
    format: '',
    cost: '',
    selectivity: '',
    competitionType: '',
    teamSize: '',
    geographicAccess: '',
    residency: '',
    citizenship: '',
    age: '',
    enrollmentRule: '',
    subject: ''
  });
  const [uiFilters, setUiFilters] = useState(() => ({
    subjectStream: '', grade: '', applicationBefore: '', country: '', format: '', cost: '', selectivity: '', competitionType: '', teamSize: '', geographicAccess: '', residency: '', citizenship: '', age: '', enrollmentRule: '', subject: ''
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
      subjectStream: searchParams.get('subjectStream') || '',
      grade: searchParams.get('grade') || '',
      applicationBefore: searchParams.get('applicationBefore') || '',
      country: searchParams.get('country') || '',
      format: searchParams.get('format') || '',
      cost: searchParams.get('cost') || '',
      selectivity: searchParams.get('selectivity') || '',
      competitionType: searchParams.get('competitionType') || '',
      teamSize: searchParams.get('teamSize') || '',
      geographicAccess: searchParams.get('geographicAccess') || '',
      residency: searchParams.get('residency') || '',
      citizenship: searchParams.get('citizenship') || '',
      age: searchParams.get('age') || '',
      enrollmentRule: searchParams.get('enrollmentRule') || '',
      subject: searchParams.get('subject') || ''
    });
  }, [searchParams]);

  useEffect(() => { loadInitialData(); }, []);

  useEffect(() => {
    let result = opportunities || [];
    if (filters.subjectStream) result = result.filter(o => (o['Subject Stream'] || '').toLowerCase().includes(filters.subjectStream.toLowerCase()));
    if (filters.grade) {
      const sel = Number(filters.grade);
      result = result.filter(o => Array.isArray(o._gradeList) && o._gradeList.includes(sel));
    }
    if (filters.applicationBefore) {
      result = result.filter(o => {
        const dl = o['Application Deadline'] || o['All Deadlines'] || '';
        const m = String(dl).match(/\b(20\d{2})\b/);
        if (!m) return false;
        const year = Number(m[1]);
        return year < Number(filters.applicationBefore);
      });
    }
    if (filters.country) result = result.filter(o => (o['Country'] || '').toLowerCase().includes(filters.country.toLowerCase()));
    if (filters.format) result = result.filter(o => (o['Format'] || o['Format Details'] || '').toLowerCase().includes(filters.format.toLowerCase()));
    if (filters.cost) result = result.filter(o => (o['Cost'] || '').toLowerCase().includes(filters.cost.toLowerCase()));
    if (filters.selectivity) result = result.filter(o => (o['Selectivity'] || '').toLowerCase().includes(filters.selectivity.toLowerCase()));
    if (filters.competitionType) result = result.filter(o => (o['Competition Type'] || '').toLowerCase().includes(filters.competitionType.toLowerCase()));
    if (filters.teamSize) result = result.filter(o => (o['Team Size'] || '').toLowerCase().includes(filters.teamSize.toLowerCase()));
    if (filters.geographicAccess) result = result.filter(o => (o['Geographic Access'] || '').toLowerCase().includes(filters.geographicAccess.toLowerCase()));
    if (filters.residency) result = result.filter(o => (o['Residency'] || '').toLowerCase().includes(filters.residency.toLowerCase()));
    if (filters.citizenship) result = result.filter(o => (o['Citizenship'] || '').toLowerCase().includes(filters.citizenship.toLowerCase()));
    if (filters.age) {
      const sel = Number(filters.age);
      result = result.filter(o => Array.isArray(o._ageList) && o._ageList.includes(sel));
    }
    if (filters.enrollmentRule) result = result.filter(o => (o['Enrollment Rule (School)'] || '').toLowerCase().includes(filters.enrollmentRule.toLowerCase()));
    if (filters.subject) result = result.filter(o => (o['Subject'] || '').toLowerCase().includes(filters.subject.toLowerCase()));

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
        console.log('Courses columns:', availableColumns);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load courses sheet. Confirm LU Mastersheet.xlsx exists in public/assets and has a sheet named "Courses"');
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
  const allowedSubjectStreams = ['Mathematics', 'STEM', 'Humanities', 'Commerce', 'Business', 'Arts & Media', 'Miscellaneous', 'Leadership', 'Multidisciplinary'];
  const uniqueSubjectStreams = Array.from(
    new Set(
      opportunities
        .flatMap(o =>
          (o['Subject Stream'] || '')
            .split(',')                 // split by comma
            .map(s => s.trim())        // clean spaces
            .filter(Boolean)           // remove empty
            .filter(s => allowedSubjectStreams.includes(s)) // only allowed categories
        )
    )
  ).sort();
  const uniqueSubjects = Array.from(
    new Set(
      opportunities
        .flatMap(o =>
          (o['Subject'] || '')
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
  const uniqueCosts = Array.from(new Set(opportunities.map(o => ((o['Cost'] || o['Cost Details'] || '')).trim()).filter(Boolean))).sort();
  const uniqueCompetitionTypes = Array.from(new Set(opportunities.map(o => (o['Competition Type'] || '').trim()).filter(Boolean))).sort();
  const uniqueTeamSizes = Array.from(new Set(opportunities.map(o => (o['Team Size'] || '').trim()).filter(Boolean))).sort();
  const uniqueGeographicAccess = Array.from(new Set(opportunities.map(o => (o['Geographic Access'] || '').trim()).filter(Boolean))).sort();
  const uniqueResidency = Array.from(new Set(opportunities.map(o => (o['Residency'] || '').trim()).filter(Boolean))).sort();
  const uniqueCitizenship = Array.from(new Set(opportunities.map(o => (o['Citizenship'] || '').trim()).filter(Boolean))).sort();
  const uniqueEnrollment = Array.from(new Set(opportunities.map(o => (o['Enrollment Rule (School)'] || '').trim()).filter(Boolean))).sort();

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div style={{flex:2}}>
              <p className="app-subtitle">Courses</p>
              {opportunities.length > 0 && (
            <div className="file-info"><span className="file-count">
              {filteredOpportunities.length === opportunities.length
                ? `Showing ${opportunities.length} courses`
                : `Showing ${filteredOpportunities.length} of ${opportunities.length} courses`
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
      <div className='courses-body-container'>
        <div className="sidebar-toggle">
          <i onClick={()=>setSidebarOpen(!sidebarOpen)} style={{cursor:'pointer'}} class="fa-solid fa-bars"></i>
        </div>
        <div className={`courses-sidebar ${sidebarOpen?"":"sidebar-closed"}`}>

          </div>

          <div style={{ position: 'sticky', top: 0, borderRadius: '20px', backgroundColor: '#413f3f7d', backdropFilter: 'blur(10px)', padding: '20px 10px' }}>

            {opportunities.length > 0 && (<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />)}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="navbar-btn" style={{ backgroundColor: '#c56224' }} onClick={clearUiFilters}><i class="fa-solid fa-times"></i> Clear Filters</button>
            </div>
          </div>
          {opportunities.length > 0 && (
            <div className="file-info"><span className="file-count">
              {filteredOpportunities.length === opportunities.length
                ? `${opportunities.length} courses loaded`
                : `Showing ${filteredOpportunities.length} of ${opportunities.length} courses`
              }
            </span></div>
          )}
          <br />
          <div className="filters-container courses-filters-container">
            <h4>Top Priority Filters</h4>
            <select value={uiFilters.subjectStream} onChange={(e) => setUiFilters({ ...uiFilters, subjectStream: e.target.value })}>
              <option value="">All Subject Streams</option>
              {uniqueSubjectStreams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={uiFilters.grade} onChange={(e) => setUiFilters({ ...uiFilters, grade: e.target.value })}>
              <option value="">All Grades</option>
              {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input type="number" placeholder="Deadline Before Year" value={uiFilters.applicationBefore} onChange={(e) => setUiFilters({ ...uiFilters, applicationBefore: e.target.value })} />
            <select value={uiFilters.country} onChange={(e) => setUiFilters({ ...uiFilters, country: e.target.value })}>
              <option value="">All Countries</option>
              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={uiFilters.format} onChange={(e) => setUiFilters({ ...uiFilters, format: e.target.value })}>
              <option value="">All Formats</option>
              {uniqueFormats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            <h4>Second Priority Filters</h4>
            <select value={uiFilters.cost} onChange={(e) => setUiFilters({ ...uiFilters, cost: e.target.value })}>
              <option value="">All Costs</option>
              {uniqueCosts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={uiFilters.selectivity} onChange={(e) => setUiFilters({ ...uiFilters, selectivity: e.target.value })}>
              <option value="">All Selectivity</option>
              {uniqueSelectivity.map(s => <option key={s} value={s}>{selectivity_mapping[s] || s}</option>)}
            </select>
            <select value={uiFilters.competitionType} onChange={(e) => setUiFilters({ ...uiFilters, competitionType: e.target.value })}>
              <option value="">All Competition Types</option>
              {uniqueCompetitionTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={uiFilters.teamSize} onChange={(e) => setUiFilters({ ...uiFilters, teamSize: e.target.value })}>
              <option value="">All Team Sizes</option>
              {uniqueTeamSizes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <h4>Advanced Filters</h4>
            <select value={uiFilters.geographicAccess} onChange={(e) => setUiFilters({ ...uiFilters, geographicAccess: e.target.value })}>
              <option value="">All Geographic Access</option>
              {uniqueGeographicAccess.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={uiFilters.residency} onChange={(e) => setUiFilters({ ...uiFilters, residency: e.target.value })}>
              <option value="">All Residency</option>
              {uniqueResidency.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={uiFilters.citizenship} onChange={(e) => setUiFilters({ ...uiFilters, citizenship: e.target.value })}>
              <option value="">All Citizenship</option>
              {uniqueCitizenship.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={uiFilters.age} onChange={(e) => setUiFilters({ ...uiFilters, age: e.target.value })}>
              <option value="">All Ages</option>
              {uniqueAges.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={uiFilters.enrollmentRule} onChange={(e) => setUiFilters({ ...uiFilters, enrollmentRule: e.target.value })}>
              <option value="">All Enrollment Rules</option>
              {uniqueEnrollment.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <h4>Subject Filter</h4>
            <select value={uiFilters.subject} onChange={(e) => setUiFilters({ ...uiFilters, subject: e.target.value })}>
              <option value="">All Subjects</option>
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <main className="courses-content-container">
          <div>


            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-container"><div className="spinner"></div><p>Loading courses...</p></div>}

            {!loading && filteredOpportunities.length > 0 && (
              <>
                <div className="opportunities-grid">
                  {currentOpportunities.map((opportunity, index) => (
                    <CourseTableCard key={opportunity.id} opportunity={opportunity} index={startIndex + index} />
                  ))}
                </div>
                {totalPages > 1 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />)}
              </>
            )}

            {!loading && opportunities.length === 0 && !error && (
              <div className="empty-state"><h3>No courses found</h3><p>Reload or add LU Mastersheet.xlsx with an "Courses" sheet.</p></div>
            )}
          </div>
        </main>
      </div>
    
  );
}

export default CoursesListing;