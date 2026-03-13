import React from "react";
import "./personality-info.css";

export default function PersonalityTestInfo() {

const dimensions = [
{
title:"Introversion vs Extroversion",
content:
"Introverts prefer working independently and reflecting before acting, while extroverts are outgoing and enjoy interacting with people and external activities."
},
{
title:"Intuition vs Sensing",
content:
"Intuitive individuals focus on possibilities, ideas and future concepts, while sensing individuals prefer concrete facts, details and practical information."
},
{
title:"Thinking vs Feeling",
content:
"Thinkers make decisions using logic and analysis, while feelers prioritize empathy, values and harmony with others."
},
{
title:"Perceiving vs Judging",
content:
"Perceivers stay flexible and open to new information, while judgers prefer structure, planning and firm decisions."
}
];

const types = [
["ENFP","Enthusiastic, imaginative and energetic. Good at inspiring others."],
["ESFJ","Friendly, cooperative and organized. Focus on harmony with others."],
["ENTP","Innovative and curious thinkers who enjoy solving new problems."],
["ESTJ","Practical organizers who like structure and leadership roles."],
["ESFP","Outgoing, fun-loving people who enjoy social environments."],
["ENFJ","Supportive leaders who care about helping others grow."],
["ESTP","Action-oriented and energetic problem solvers."],
["ENTJ","Strategic leaders who enjoy organizing people and systems."],
["INFP","Idealistic and creative individuals guided by strong values."],
["ISFJ","Reliable and responsible caretakers."],
["INTP","Logical thinkers fascinated by ideas and theories."],
["ISTJ","Serious, dependable and practical planners."],
["ISFP","Gentle, artistic and sensitive individuals."],
["INFJ","Insightful visionaries with strong principles."],
["ISTP","Independent problem solvers who enjoy understanding systems."],
["INTJ","Strategic thinkers with strong long-term planning abilities."]
];

return (

<div className="infoContainer">

<h1 className="gradientTitle">
Personal Style Inventory (MBTI Based)
</h1>

<section className="infoSection">

<h2>About This Personality Test</h2>

<p>
The Personal Style Inventory helps individuals understand their natural
preferences in how they think, interact, make decisions and organize their
lives. The test is based on the Myers-Briggs framework which describes
personality through four pairs of dimensions that combine to form
16 personality types.
</p>

</section>

<section className="infoSection">

<h2>The Four Personality Dimensions</h2>

<div className="dimensionGrid">

{dimensions.map((d,i)=>(
<div key={i} className="dimensionCard">

<h3>{d.title}</h3>

<p>{d.content}</p>

</div>
))}

</div>

</section>

<section className="infoSection">

<h2>Score Interpretation</h2>

<div className="scoreBox">

<p><b>20-21:</b> Balanced preference between the two dimensions.</p>
<p><b>22-24:</b> Moderate strength in one dimension.</p>
<p><b>25-29:</b> Strong preference in one dimension.</p>
<p><b>30-40:</b> Very strong personality tendency.</p>

</div>

</section>

<section className="infoSection">

<h2>Strengths and Weaknesses</h2>

<div className="strengthGrid">

<div className="strengthCard">
<h3>Introvert</h3>
<p>Independent, reflective, careful thinker.</p>
<p className="weak">Weakness: may avoid interaction and opportunities.</p>
</div>

<div className="strengthCard">
<h3>Extrovert</h3>
<p>Outgoing, energetic, social and communicative.</p>
<p className="weak">Weakness: may become impatient with slow tasks.</p>
</div>

<div className="strengthCard">
<h3>Intuitive</h3>
<p>Creative, innovative, enjoys solving complex problems.</p>
<p className="weak">Weakness: may overlook details.</p>
</div>

<div className="strengthCard">
<h3>Sensing</h3>
<p>Detail-oriented, practical and reliable.</p>
<p className="weak">Weakness: may miss the big picture.</p>
</div>

<div className="strengthCard">
<h3>Thinking</h3>
<p>Logical, analytical and objective.</p>
<p className="weak">Weakness: may overlook emotional impact.</p>
</div>

<div className="strengthCard">
<h3>Feeling</h3>
<p>Empathetic, compassionate and supportive.</p>
<p className="weak">Weakness: decisions may rely too much on emotions.</p>
</div>

<div className="strengthCard">
<h3>Perceiving</h3>
<p>Flexible, adaptable and open-minded.</p>
<p className="weak">Weakness: may struggle with finishing tasks.</p>
</div>

<div className="strengthCard">
<h3>Judging</h3>
<p>Organized, decisive and structured.</p>
<p className="weak">Weakness: may become rigid or inflexible.</p>
</div>

</div>

</section>

<section className="infoSection">

<h2>The 16 Personality Types</h2>

<div className="typesGrid">

{types.map((t,i)=>(
<div key={i} className="typeCard">

<h3>{t[0]}</h3>

<p>{t[1]}</p>

</div>
))}

</div>

</section>

</div>

);
}