import {useState} from 'react'
import TestPage from './TestPage';
import ResultPage from './ResultPage';
import GradeSelector from './GradeSelector';

export default function AptitudeTestEntry() {
  const [grade, setGrade] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div className="app">
      {!grade && <GradeSelector setGrade={setGrade} />}

      {grade && !result && (
        <TestPage grade={grade} setResult={setResult} />
      )}

      {result && <ResultPage result={result} />}
    </div>
  );
}
