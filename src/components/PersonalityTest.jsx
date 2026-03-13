import React, { useState } from "react";
import "./mbti-pro.css";

const questions = [
{ id:1,a:"Making decisions after finding out what others think.",b:"Making decisions without consulting others.",dimA:"E",dimB:"I"},
{ id:2,a:"Being called imaginative or intuitive.",b:"Being called factual and accurate.",dimA:"N",dimB:"S"},
{ id:3,a:"Making decisions using analysis.",b:"Making decisions using empathy.",dimA:"T",dimB:"F"},
{ id:4,a:"Allowing commitments to occur.",b:"Pushing for definite commitments.",dimA:"P",dimB:"J"},
{ id:5,a:"Quiet thoughtful time alone.",b:"Active energetic time with people.",dimA:"I",dimB:"E"},
{ id:6,a:"Using known methods.",b:"Trying new methods.",dimA:"S",dimB:"N"},
{ id:7,a:"Logical step-by-step analysis.",b:"Feelings and beliefs.",dimA:"T",dimB:"F"},
{ id:8,a:"Avoid deadlines.",b:"Seek schedules.",dimA:"P",dimB:"J"},
{ id:9,a:"Think quietly first.",b:"Talk freely first.",dimA:"I",dimB:"E"},
{ id:10,a:"Thinking about possibilities.",b:"Dealing with actual facts.",dimA:"N",dimB:"S"},
{ id:11,a:"Being thought of as logical.",b:"Being thought of as caring.",dimA:"T",dimB:"F"},
{ id:12,a:"Consider every angle.",b:"Make quick decisions.",dimA:"P",dimB:"J"},
{ id:13,a:"Private inner thoughts.",b:"Open shared activities.",dimA:"I",dimB:"E"},
{ id:14,a:"Abstract ideas.",b:"Concrete reality.",dimA:"N",dimB:"S"},
{ id:15,a:"Help explore feelings.",b:"Help make logical decisions.",dimA:"F",dimB:"T"},
{ id:16,a:"Keep options open.",b:"Prefer predictability.",dimA:"P",dimB:"J"},
{ id:17,a:"Communicate little.",b:"Communicate freely.",dimA:"I",dimB:"E"},
{ id:18,a:"See overall possibilities.",b:"Focus on details.",dimA:"N",dimB:"S"},
{ id:19,a:"Decide using feelings.",b:"Decide using reason.",dimA:"F",dimB:"T"},
{ id:20,a:"Plan ahead.",b:"Plan when necessary.",dimA:"J",dimB:"P"},
{ id:21,a:"Meeting new people.",b:"Being alone.",dimA:"E",dimB:"I"},
{ id:22,a:"Ideas.",b:"Facts.",dimA:"N",dimB:"S"},
{ id:23,a:"Convictions.",b:"Logical conclusions.",dimA:"F",dimB:"T"},
{ id:24,a:"Keep schedules.",b:"Flexible scheduling.",dimA:"J",dimB:"P"},
{ id:25,a:"Discuss issues in groups.",b:"Think privately first.",dimA:"E",dimB:"I"},
{ id:26,a:"Execute detailed plans.",b:"Design concepts.",dimA:"S",dimB:"N"},
{ id:27,a:"Logical people.",b:"Feeling people.",dimA:"T",dimB:"F"},
{ id:28,a:"Spontaneous.",b:"Planned.",dimA:"P",dimB:"J"},
{ id:29,a:"Centre of attraction.",b:"Reserved.",dimA:"E",dimB:"I"},
{ id:30,a:"Imagine possibilities.",b:"Examine details.",dimA:"N",dimB:"S"},
{ id:31,a:"Emotional experiences.",b:"Analytical thinking.",dimA:"F",dimB:"T"},
{ id:32,a:"Start meetings on time.",b:"Start when ready.",dimA:"J",dimB:"P"}
];

const descriptions={
ENFP:"Warm, imaginative, enthusiastic. Quick to see possibilities and help others.",
ISTJ:"Serious, practical, dependable. Organized and responsible.",
INTJ:"Independent strategic thinkers with strong determination.",
ENTJ:"Confident leaders who enjoy organizing people and systems.",
ISFP:"Quiet, kind, sensitive and flexible."
};

export default function PersonalityTest(){

const [step,setStep]=useState(0);
const [answers,setAnswers]=useState({});
const [result,setResult]=useState(null);

const q=questions[step];

const handleScore=(value)=>{
setAnswers({
...answers,
[q.id]:{
// Score 0..5 for option A (more A = higher), option B is inverse.
a:value,
b:5-value
}
});
};

const next=()=>{
if(step<questions.length-1) setStep(step+1);
};

const prev=()=>{
if(step>0) setStep(step-1);
};

const calculate=()=>{
// Determine the max possible score per dimension (each dimension appears in half of the total questions).
const perDimCount = questions.length / 2; // 16 for 32 questions
const maxDimScore = perDimCount * 5; // max 80

let scores={E:0,I:0,N:0,S:0,T:0,F:0,P:0,J:0};

questions.forEach(q=>{
if(answers[q.id]){
const {a,b} = answers[q.id];
scores[q.dimA]+=a;
scores[q.dimB]+=b;
}
});

const type=
(scores.E>scores.I?"E":"I")+
(scores.N>scores.S?"N":"S")+
(scores.T>scores.F?"T":"F")+
(scores.J>scores.P?"J":"P");

setResult({scores,type,maxDimScore});
};

if(result){
return(
<div className="resultPage">

<h1>Your Personality Type</h1>

<div className="typeBox">{result.type}</div>

<p className="desc">
{descriptions[result.type] || "See personality profile in report."}
</p>

<div className="chart">

{Object.entries(result.scores).map(([k,v])=>(
<div key={k} className="barRow">
<span>{k}</span>
<div className="bar">
<div className="fill" style={{width:(result.maxDimScore ? (v/result.maxDimScore)*100 : 0)+"%"}} />
</div>
<span className="barValue">{v}</span>
</div>
))}

</div>

<button onClick={()=>window.location.reload()} className="restart">
Restart Test
</button>

</div>
)
}

return(

<div className="testPage">

<h1 className="title">Personal Style Inventory</h1>

<div className="progress">
<div style={{width:((step+1)/questions.length)*100+"%"}}></div>
</div>

<div className="card">

<h3>Question {q.id}</h3>

<p className="optionA"><b>A. </b> {q.a}</p>

<div className="scoreBoard">
  <div className="scoreButtons">
    {[0,1,2,3,4,5].map((n)=>(
      <button
        key={n}
        type="button"
        className={`scoreBtn ${answers[q.id]?.a===n ? "active" : ""}`}
        onClick={()=>handleScore(n)}
      >
        {n}
      </button>
    ))}
  </div>
  <div className="scoreSummary">
    <span className="scoreText">A: {answers[q.id]?.a ?? 2}</span>
    <span className="scoreText">B: {5 - (answers[q.id]?.a ?? 2)}</span>
  </div>
</div>

<p className="optionB"><b>B. </b> {q.b}</p>

</div>

<div className="navBtns">

<button onClick={prev} disabled={step===0}>
Back
</button>

{step===questions.length-1 ?
<button onClick={calculate}>See Result</button>
:
<button onClick={next}>Next</button>
}

</div>

</div>
)
}