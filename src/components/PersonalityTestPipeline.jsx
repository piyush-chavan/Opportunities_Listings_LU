import React, { useState } from "react";
import "./mbti-pro.css";
import "./learningStyle.css";
import { toast } from 'react-toastify';

const questions = [
  { id: 1, a: "Making decisions after finding out what others think.", b: "Making decisions without consulting others.", dimA: "E", dimB: "I" },
  { id: 2, a: "Being called imaginative or intuitive.", b: "Being called factual and accurate.", dimA: "N", dimB: "S" },
  { id: 3, a: "Making decisions using analysis.", b: "Making decisions using empathy.", dimA: "T", dimB: "F" },
  { id: 4, a: "Allowing commitments to occur.", b: "Pushing for definite commitments.", dimA: "P", dimB: "J" },
  { id: 5, a: "Quiet thoughtful time alone.", b: "Active energetic time with people.", dimA: "I", dimB: "E" },
  { id: 6, a: "Using known methods.", b: "Trying new methods.", dimA: "S", dimB: "N" },
  { id: 7, a: "Logical step-by-step analysis.", b: "Feelings and beliefs.", dimA: "T", dimB: "F" },
  { id: 8, a: "Avoid deadlines.", b: "Seek schedules.", dimA: "P", dimB: "J" },
  { id: 9, a: "Think quietly first.", b: "Talk freely first.", dimA: "I", dimB: "E" },
  { id: 10, a: "Thinking about possibilities.", b: "Dealing with actual facts.", dimA: "N", dimB: "S" },
  { id: 11, a: "Being thought of as logical.", b: "Being thought of as caring.", dimA: "T", dimB: "F" },
  { id: 12, a: "Consider every angle.", b: "Make quick decisions.", dimA: "P", dimB: "J" },
  { id: 13, a: "Private inner thoughts.", b: "Open shared activities.", dimA: "I", dimB: "E" },
  { id: 14, a: "Abstract ideas.", b: "Concrete reality.", dimA: "N", dimB: "S" },
  { id: 15, a: "Help explore feelings.", b: "Help make logical decisions.", dimA: "F", dimB: "T" },
  { id: 16, a: "Keep options open.", b: "Prefer predictability.", dimA: "P", dimB: "J" },
  { id: 17, a: "Communicate little.", b: "Communicate freely.", dimA: "I", dimB: "E" },
  { id: 18, a: "See overall possibilities.", b: "Focus on details.", dimA: "N", dimB: "S" },
  { id: 19, a: "Decide using feelings.", b: "Decide using reason.", dimA: "F", dimB: "T" },
  { id: 20, a: "Plan ahead.", b: "Plan when necessary.", dimA: "J", dimB: "P" },
  { id: 21, a: "Meeting new people.", b: "Being alone.", dimA: "E", dimB: "I" },
  { id: 22, a: "Ideas.", b: "Facts.", dimA: "N", dimB: "S" },
  { id: 23, a: "Convictions.", b: "Logical conclusions.", dimA: "F", dimB: "T" },
  { id: 24, a: "Keep schedules.", b: "Flexible scheduling.", dimA: "J", dimB: "P" },
  { id: 25, a: "Discuss issues in groups.", b: "Think privately first.", dimA: "E", dimB: "I" },
  { id: 26, a: "Execute detailed plans.", b: "Design concepts.", dimA: "S", dimB: "N" },
  { id: 27, a: "Logical people.", b: "Feeling people.", dimA: "T", dimB: "F" },
  { id: 28, a: "Spontaneous.", b: "Planned.", dimA: "P", dimB: "J" },
  { id: 29, a: "Centre of attraction.", b: "Reserved.", dimA: "E", dimB: "I" },
  { id: 30, a: "Imagine possibilities.", b: "Examine details.", dimA: "N", dimB: "S" },
  { id: 31, a: "Emotional experiences.", b: "Analytical thinking.", dimA: "F", dimB: "T" },
  { id: 32, a: "Start meetings on time.", b: "Start when ready.", dimA: "J", dimB: "P" }
];

const personalityDescriptions = {
  ENFP: `Warmly enthusiastic, high-spirited, ingenious, imaginative. Able to do almost anything that interests them. Quick with a solution for any difficulty and ready to help anyone with a problem. Often rely on their ability to improvise instead of preparing in advance. Can usually find compelling reason for whatever they want.`,

  ESFJ: `Warm-hearted, talkative, popular, conscientious, born co-operators, and active committee members. Need harmony and may be good at creating it. Always doing something nice for someone. Work best with encouragement and praise. Little interest in abstract thinking or technical subjects. Main interest is in things that directly and visibly affect people's lives.`,

  ENTP: `Quick, ingenious, good at many things. Stimulating company, alert and outspoken. May argue for fun on either side of a question. Resourceful in solving new and challenging problems, but may neglect routine assignments. Apt to turn to one new interest after another. Skilful in finding logical reasons for what they want.`,

  ESTJ: `Practical, realistic, matter-of- fact, with a natural head for business or mechanics. Not interested in subjects they see no use for, but can apply themselves when necessary. Like to organise and run activities. May make good administrators, especially if they remember to consider others' feelings and points of view.`,

  ESFP: `Outgoing, easygoing, accepting, friendly, enjoy everything and make things more fun for others by their enjoyment. Like sports and making things. Know what's going on and join in eagerly. Find remembering facts easier than mastering theories. Are best in situations that need sound common sense and practical ability with people as well as with things.`,

  ENFJ: `Responsive and responsible. Generally feel real concern for what others think or want, and try to handle things with due regard for other people's feelings. Can present a proposal or lead a group discussion with ease and tact. Sociable, popular, active in school affairs, but put time enough on their studies to do good work.`,

  ESTP: `Matter-of-fact, do not worry or hurry, enjoy whatever comes along. Tend to like mechanical things and sports with friends on the side. May be a bit blunt or insensitive. Can do math or science when they see the need. Dislike long explanations. Are best with real things that can be worked, handled, taken apart, or put together.`,

  ENTJ: `Hearty, frank, able in studies, leader in activities. Usually good in anything that requires reasoning and intelligent talk, such as public speaking. Are usually well informed and enjoy adding to their fund of knowledge. May sometimes be more positive and confident than their experience in an area warrants.`,

  INFP: `Full of enthusiasms and loyalties, but seldom talk of these until they know you well. Care about learning, ideas, language, and independent projects of their own. Tend to undertake too much, then somehow get it done. Friendly, but often too absorbed in what they are doing to be sociable. Little concern with possessions or physical surroundings.`,

  ISFJ: `Quiet, friendly, responsible and conscientious. Work devotedly to meet their obligations and serve their friends and communities. Thorough, painstaking, accurate. May need time to master technical subjects, as their interests are usually not technical. Patient with detail and routine. Loyal, considerate, concerned with how other people feel.`,

  INTP: `Quiet, reserved, brilliant in exams, especially in theoretical or scientific subjects. Logical to the point of hair splitting. Usually interested mainly in ideas, with little liking for parties or small talk. Tend to have sharply defined interests. Need to choose careers where some strong interest can be used and is useful.`,

  ISTJ: `Serious, quiet, earn success by concentration and thoroughness. Practical, orderly, matter-of-fact, logical, realistic and dependable. See to it that everything is well organised. Take responsibility. Make up their own minds as to what should be accomplished and work toward it steadily, regardless of protests or distractions.`,

  ISFP: `Retiring quietly friendly, sensitive, kind, modest about their abilities. Shun disagreements, do not force opinions or values on others. Usually do not care to lead but are loyal to followers. Relaxed about getting things done as they enjoy the moment and don't want to spoil it by haste or exertion.`,

  INFJ: `Succeed by perseverance, originality and desire to do whatever is needed or wanted. Put their best efforts into their work. Quietly forceful, conscientious, concerned for others, respected for firm principles. Are likely to be honoured/followed for their clear convictions on how best to serve the common good.`,

  ISTP: `Cool, quiet, reserved, detached curiosity. Observers with unexpected flashes of original humour. Interested in principles. Exert themselves no more than necessary because waste of energy is inefficient.`,

  INTJ: `Usually have original minds and great drive for own ideas. Have ability to organise a job, can carry through with little help. Sceptical, critical, independent, determined, stubborn. Must learn to yield lesser points to win more important points.`
};

export default function PersonalityTestPipeline({ onComplete, testNumber, totalTests }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const q = questions[step];

  const handleScore = (value) => {
    setAnswers({
      ...answers,
      [q.id]: {
        a: value,
        b: 5 - value
      }
    });
  };

  const next = () => {
    if (!answers[q.id]) {
      toast.error("Please answer the current question before proceeding");
      return;
    }
    if (step < questions.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Autofill for testing
  const autofill = () => {
    const filledAnswers = {};
    questions.forEach(q => {
      filledAnswers[q.id] = {
        a: 3,
        b: 2
      };
    });
    setAnswers(filledAnswers);
    setTimeout(() => {
      const perDimCount = questions.length / 2;
      const maxDimScore = perDimCount * 5;
      let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, P: 0, J: 0 };
      questions.forEach(q => {
        const { a, b } = filledAnswers[q.id];
        scores[q.dimA] += a;
        scores[q.dimB] += b;
      });
      const type =
        (scores.E > scores.I ? "E" : "I") +
        (scores.N > scores.S ? "N" : "S") +
        (scores.T > scores.F ? "T" : "F") +
        (scores.J > scores.P ? "J" : "P");
      setResult({ scores, type, maxDimScore, testType: "personality" });
    }, 100);
  };

  const calculate = () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    const perDimCount = questions.length / 2;
    const maxDimScore = perDimCount * 5;

    let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, P: 0, J: 0 };

    questions.forEach(q => {
      if (answers[q.id]) {
        const { a, b } = answers[q.id];
        scores[q.dimA] += a;
        scores[q.dimB] += b;
      }
    });

    const type =
      (scores.E > scores.I ? "E" : "I") +
      (scores.N > scores.S ? "N" : "S") +
      (scores.T > scores.F ? "T" : "F") +
      (scores.J > scores.P ? "J" : "P");

    setResult({ scores, type, maxDimScore, testType: "personality" });
  };

  if (result) {
    return (
      <div className="test-container">
        <div className="test-header">
          <h1>Personality Test (MBTI) Results</h1>
          <p className="test-progress">Test {testNumber} of {totalTests}</p>
        </div>

        <div className="resultPage">
          <div className="typeBox">{result.type}</div>

          <div style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'justify' }} className="style-card highlight">
            <div className="style-header">
              <h4 style={{ fontSize: '1.5rem' }}>Your Personality Type</h4>
            </div>
            <p style={{ fontSize: '1rem' }} className="desc">
              {personalityDescriptions[result.type] || "See personality profile in report."}
            </p>
          </div>

          <div style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'justify' }} className="style-card highlight">
            <div className="style-header">
              <h4 style={{ fontSize: '1.5rem' }}>Key Letter Meaning</h4>
            </div>
            <p style={{ fontSize: '0.9rem' }} className="desc">
              <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                    <li>• <strong>I:</strong> Introversion</li>
                    <li>• <strong>N:</strong> Intuition</li>
                    <li>• <strong>T:</strong> Thinking</li>
                    <li>• <strong>P:</strong> Perceiving</li>
                  </ul>
                </div>
                <div style={{ flex: 1 }}>
                  <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                    <li>• <strong>E:</strong> Extroversion</li>
                    <li>• <strong>S:</strong> Sensing</li>
                    <li>• <strong>F:</strong> Feeling</li>
                    <li>• <strong>J:</strong> Judging</li>
                  </ul>
                </div>
              </div>
            </p>
          </div>

          <button className="submit-btn" onClick={() => onComplete(result)}>
            Proceed to Next Test →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <h1>Personality Test (MBTI)</h1>
        <p className="test-progress">Test {testNumber} of {totalTests}</p>
        <p className="test-description">
          Rate your preference for each statement. Question {step + 1} of {questions.length}
        </p>
      </div>

      <div className="testPage">
        <div className="progress">
          <div style={{ width: ((step + 1) / questions.length) * 100 + "%" }}></div>
        </div>
        <button onClick={autofill} className="submit-btn" style={{backgroundColor: '#999'}}>
                Auto-fill (Testing)
              </button>

        <div className="card" style={{color:'white',backgroundColor:'#000000cf'}}>
          <h3>Question {q.id}</h3>
          <h3>I Prefer : </h3>

          <p className="optionA" style={{color:'black'}}><b>A. </b> {q.a}</p>

          <div className="scoreBoard">
            <div className="scoreButtons">
              <p><b>A. Preference</b></p>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`scoreBtn ${answers[q.id]?.a === n ? "active" : ""}`}
                  onClick={() => handleScore(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <br /><br />
            <div className="scoreButtons">
              <p><b>B. Preference </b></p>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`scoreBtn ${answers[q.id]?.a === (5-n) ? "active" : ""}`}
                  onClick={() => handleScore(5-n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <p className="optionB" style={{color:'black'}}><b>B. </b> {q.b}</p>
        </div>

        <div className="navBtns">
          <button onClick={prev} disabled={step === 0} className="navBtn">
            ← Previous
          </button>

          {step === questions.length - 1 ? (
            <>
              <button onClick={calculate} className="submit-btn">
                Submit Test
              </button>
              <button onClick={autofill} className="submit-btn" style={{backgroundColor: '#999'}}>
                Auto-fill (Testing)
              </button>
            </>
          ) : (
            <button onClick={next} className="navBtn">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}