/* Namiq Bağırlı Test Platform - static demo; no remote storage or teacher dashboard. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const state={type:null,student:null,questions:[],answers:[],index:0,lastResult:null};
const CATEGORIES={vocab:'Vocabulary Tests',grammar:'Grammar & Sentence Building',dim:'DİM English Exam'};
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const sample=(items,n)=>shuffle(items).slice(0,n);
const unique=a=>[...new Set(a)];
const plain=s=>String(s??'').toLowerCase().normalize('NFKC').replace(/[‘’´`]/g,"'").replace(/[.,!?;:]+/g,'').replace(/\s+/g,' ').trim();
const mc=(prompt,answer,wrong,tag='Test',extra='',audio='')=>({type:'mc',prompt,answer,options:shuffle(unique([answer,...wrong.filter(x=>x!==answer)]).slice(0,4)),tag,extra,audio});
const spoken=(prompt,answer,acceptable=[],tag='Grammar')=>({type:'text',prompt,answer,acceptable:[answer,...acceptable],tag});
const bank=(window.NB_VOCAB_BANK||[]).filter(w=>w.en&&w.az&&w.definition&&w.grade>=5&&w.grade<=11);
$('bank-count').textContent=bank.length.toLocaleString('az-AZ')+'+';
$('year').textContent=String(new Date().getFullYear());
$('menu-toggle').addEventListener('click',()=>{const nav=$('main-nav'),v=nav.classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(v));});
for(const a of document.querySelectorAll('#main-nav a'))a.addEventListener('click',()=>$('main-nav').classList.remove('open'));
const pairs={
  synonym:[
    [5,'great','awesome'],[5,'picture','photo'],[5,'father','dad'],[5,'hi','hello'],[5,'hard','difficult'],[5,'excellent','fantastic'],[5,'mother','mom'],[5,'little','small'],[5,'big','large'],[5,'beautiful','pretty'],[5,'clever','smart'],[5,'quick','fast'],[5,'happy','glad'],[5,'easy','simple'],
    [6,'awful','horrible'],[6,'torch','lantern'],[6,'photograph','photo'],[6,'large','huge'],[6,'shop','store'],[6,'aeroplane','plane'],[6,'trousers','pants'],[6,'trainers','sneakers'],[6,'film','movie'],[6,'flat','apartment'],[6,'brilliant','clever'],
    [7,'famous','well-known'],[7,'brave','courageous'],[7,'terrible','awful'],[7,'begin','start'],[7,'strange','unusual'],[7,'amazing','fantastic'],
    [8,'essential','important'],[8,'enormous','huge'],[8,'delicious','tasty'],[8,'rapid','quick'],[8,'purchase','buy'],[8,'assist','help'],
    [9,'accurate','correct'],[9,'explore','investigate'],[9,'intelligent','clever'],[9,'significant','important'],[9,'creative','imaginative'],
    [10,'generous','kind'],[10,'achieve','accomplish'],[10,'confident','self-assured'],[10,'encourage','support'],[10,'prevent','stop'],
    [11,'broaden','expand'],[11,'foster','encourage'],[11,'crucial','essential'],[11,'inevitable','unavoidable'],[11,'resolve','solve'],[11,'obtain','get']
  ],
  antonym:[
    [5,'hot','cold'],[5,'big','small'],[5,'happy','sad'],[5,'true','false'],[5,'tall','short'],[5,'start','finish'],[5,'old','new'],[5,'early','late'],[5,'love','hate'],[5,'inside','outside'],[5,'remember','forget'],[5,'day','night'],[5,'easy','difficult'],[5,'good','bad'],[5,'young','old'],[5,'long','short'],
    [6,'win','lose'],[6,'wrong','correct'],[6,'heavy','light'],[6,'solid','liquid'],[6,'lazy','active'],[6,'brave','afraid'],[6,'near','far'],[6,'quiet','loud'],[6,'arrive','leave'],[6,'soft','hard'],
    [7,'safe','dangerous'],[7,'success','failure'],[7,'polite','rude'],[7,'poor','rich'],[7,'possible','impossible'],
    [8,'include','exclude'],[8,'private','public'],[8,'natural','artificial'],[8,'generous','selfish'],[8,'agree','disagree'],
    [9,'increase','decrease'],[9,'advantage','disadvantage'],[9,'optimistic','pessimistic'],[9,'certain','uncertain'],[9,'modern','ancient'],
    [10,'protect','destroy'],[10,'temporary','permanent'],[10,'expand','shrink'],[10,'independent','dependent'],[10,'efficient','inefficient'],
    [11,'optimism','pessimism'],[11,'reluctant','willing'],[11,'accept','reject'],[11,'flexible','rigid'],[11,'frequent','rare'],[11,'conscious','unconscious']
  ]
};
const fillItems=[
  [5,'She ___ to school every day.','goes',['go','going','gone']],
  [5,'Please open your ___. We will read page 10.','book',['shoe','kitchen','teacher']],
  [5,'The grass is ___.','green',['blue','red','black']],
  [5,'There are seven days in a ___.','week',['month','year','minute']],
  [5,'I write with a ___.','pen',['door','chair','garden']],
  [5,'My ___ is a doctor. She works in a hospital.','mother',['table','window','car']],
  [5,'We use our ears to ___.','listen',['write','run','draw']],
  [5,'January is the first ___ of the year.','month',['day','week','hour']],
  [5,'Students sit in the ___.','classroom',['kitchen','garage','garden']],
  [5,'I drink water when I am ___.','thirsty',['sleeping','yellow','open']],
  [5,'The opposite of hot is ___.','cold',['warm','loud','bright']],
  [5,'There are twelve ___ in a year.','months',['hours','weeks','days']],
  [6,'She put her clothes in the ___.','wardrobe',['pavement','station','lake']],
  [6,'The children watched a ___ at the cinema.','film',['ticket','garden','table']],
  [6,'We travelled to another city by ___.','train',['fork','brush','eraser']],
  [6,'I bought a ___ for the museum entrance.','ticket',['pillow','cloud','spoon']],
  [6,'The ___ helped us find our hotel.','receptionist',['pencil','ferry','window']],
  [6,'They decided to ___ plastic bottles.','recycle',['forget','destroy','borrow']],
  [6,'The mountain is very ___.','high',['tiny','quiet','soft']],
  [7,'The ___ saved the child from danger.','firefighter',['artist','journalist','musician']],
  [7,'We watched a ___ about wild animals.','documentary',['dictionary','uniform','envelope']],
  [7,'The detective tried to ___ the crime.','investigate',['decorate','celebrate','whisper']],
  [7,'The audience enjoyed the ___ at the theatre.','performance',['address','factory','hospital']],
  [7,'The climbers reached the ___ of the mountain.','top',['bottom','floor','river']],
  [8,'The ___ destroyed several houses during the storm.','flood',['recipe','museum','concert']],
  [8,'You should ___ your seat belt in the car.','fasten',['paint','borrow','forget']],
  [8,'She enjoys collecting colourful ___.','beads',['clouds','stairs','trees']],
  [8,'We should ___ the environment.','protect',['pollute','waste','ignore']],
  [8,'The meal was ___. Everyone wanted more.','delicious',['awful','empty','late']],
  [9,'The satellite is travelling in ___ around Earth.','orbit',['traffic','library','routine']],
  [9,'Astronauts wear a ___ during a spacewalk.','spacesuit',['raincoat','uniform','dress']],
  [9,'The scientist collected ___ for the experiment.','data',['tickets','flowers','shoes']],
  [9,'She was selected to ___ her country abroad.','represent',['repair','remove','remember']],
  [9,'They launched a ___ into space.','rocket',['ferry','bicycle','scooter']],
  [10,'The organisation made a ___ to help the children.','donation',['decision','prediction','complaint']],
  [10,'A ___ helps people by giving money to charity.','philanthropist',['mechanic','astronaut','driver']],
  [10,'We must ___ natural resources for future generations.','preserve',['waste','pollute','ignore']],
  [10,'Volunteers provided ___ to people after the earthquake.','assistance',['danger','noise','stress']],
  [10,'Good teachers ___ their students to do their best.','encourage',['punish','interrupt','confuse']],
  [11,'Reading widely can ___ your knowledge.','broaden',['reduce','forget','close']],
  [11,'Teachers should ___ creativity in the classroom.','foster',['prevent','reject','destroy']],
  [11,'Good decisions require ___ thinking.','critical',['careless','random','confused']],
  [11,'He finally decided to ___ his mistake.','admit',['deny','hide','ignore']],
  [11,'When the project became too difficult, they chose to ___ instead of quitting.','persevere',['surrender','hesitate','complain']]
];
function vocabQuestions(grade,mode,count=10){
 const pool=bank.filter(w=>w.grade===grade && /^[\p{L}][\p{L} .!?,()'-]*$/u.test(w.en) && w.en.length<42 && w.az.length<72 && w.definition.length>6);
 if(pool.length<20)throw Error('Bu sinif üçün yetərli söz tapılmadı.');
 const options=(correct,key,w)=>{const others=sample(unique(pool.filter(x=>x.en!==w.en && x[key]!==correct && x[key].length<85).map(x=>x[key])),3);return others.length===3?others:[];};
 const make=(m,n)=>{
  if(m==='synonym'||m==='antonym'){
   const available=pairs[m].filter(row=>row[0]<=grade);
   return sample(available,n).map(([_,a,b])=>{
    const other=sample(unique(available.map(x=>x[2]).filter(x=>x!==b&&x!==a)),3);
    return mc(`Choose the ${m==='synonym'?'synonym':'antonym'} of “${a}”.`,b,other,m==='synonym'?'Sinonim':'Antonim');
   });
  }
  if(m==='fill')return sample(fillItems.filter(row=>row[0]<=grade),n).map(row=>mc(row[1],row[2],row[3],'Boşluğu doldur'));
  return sample(pool,n).map(w=>{
   if(m==='definition')return mc(`Which definition matches “${w.en}”?`,w.definition,options(w.definition,'definition',w),'Definition matching');
   if(Math.random()<.5)return mc(`“${w.en}” sözünün Azərbaycan dilində mənası hansıdır?`,w.az,options(w.az,'az',w),'Tərcümə · EN → AZ');
   return mc(`“${w.az}” sözünün ingilis dilində qarşılığı hansıdır?`,w.en,options(w.en,'en',w),'Tərcümə · AZ → EN');
  });
 };
 const q=mode==='mixed'?shuffle(['translation','definition','synonym','antonym','fill'].flatMap(m=>make(m,2))):make(mode,count);
 if(q.length!==count||q.some(x=>x.options.length!==4))throw Error('Suallar hazırlana bilmədi. Başqa variant seçin.');
 return q;
}
const a1=[
 spoken('Put the words in the correct order:  am / I / a / student','I am a student.'),
 spoken('Make the sentence negative: She is happy.','She is not happy.',['She isn\'t happy.']),
 spoken('Make a question: You are from Baku.','Are you from Baku?'),
 spoken('Complete the sentence: He ___ a teacher.','is'),
 spoken('Correct the mistake: They is in the park.','They are in the park.'),
 spoken('Put the words in the correct order: plays / every / Tom / football / day','Tom plays football every day.'),
 spoken('Make a question: She likes coffee.','Does she like coffee?'),
 spoken('Make the sentence negative: I can swim.','I cannot swim.',['I can\'t swim.']),
 spoken('Complete: There ___ two books on the table.','are'),
 spoken('Put the words in the correct order: watching / we / TV / are','We are watching TV.'),
 spoken('Make a question: He has a car.','Does he have a car?'),
 spoken('Correct the mistake: I goes to school.','I go to school.'),
 spoken('Make negative: We have a dog.','We do not have a dog.',['We don\'t have a dog.']),
 spoken('Complete: There ___ an apple in the bag.','is'),
 spoken('Complete: My birthday is ___ May.','in'),
 spoken('Put the words in order: at / starts / nine / school','School starts at nine.'),
 spoken('Make a question: They are reading.','Are they reading?'),
 spoken('Correct the mistake: She don\'t like apples.','She does not like apples.',['She doesn\'t like apples.']),
 spoken('Complete the sentence: ___ you speak English?','Can'),
 spoken('Put the words in order: has / brother / my / a / bike','My brother has a bike.')
];
const a2=[
 spoken('Make a question: They visited the museum yesterday.','Did they visit the museum yesterday?'),
 spoken('Make negative: She went to London.','She did not go to London.',['She didn\'t go to London.']),
 spoken('Complete: If it rains, we ___ stay at home.','will'),
 spoken('Correct the mistake: He is taller then his brother.','He is taller than his brother.'),
 spoken('Put the words in order: never / been / I / to / Paris / have','I have never been to Paris.'),
 spoken('Complete: This book was ___ by Charles Dickens.','written'),
 spoken('Make a question: She has finished her homework.','Has she finished her homework?'),
 spoken('Correct the mistake: I am interested on music.','I am interested in music.'),
 spoken('Complete: This is the ___ interesting book I have read.','most'),
 spoken('Make negative: They were playing tennis.','They were not playing tennis.',['They weren\'t playing tennis.']),
 spoken('Put the words in order: usually / to / she / walks / school','She usually walks to school.'),
 spoken('Complete: I have lived here ___ 2020.','since'),
 spoken('Correct the mistake: He has visited us last week.','He visited us last week.'),
 spoken('Complete: She is good ___ solving problems.','at'),
 spoken('Make a question: You should study tonight.','Should you study tonight?'),
 spoken('Put the words in order: would / I / like / some / tea','I would like some tea.'),
 spoken('Correct the mistake: This is more easier than that.','This is easier than that.'),
 spoken('Make negative: You must use your phone here.','You must not use your phone here.',['You mustn\'t use your phone here.']),
 spoken('Complete: We were walking when it ___ to rain.','started'),
 spoken('Make a question: He used to live in Quba.','Did he use to live in Quba?')
];
const dimGrammar=[
 ['If I ___ time, I will help you.','have',['had','has','having']],
 ['My sister ___ English for five years.','has studied',['study','is study','studied yesterday']],
 ['You ___ smoke in the hospital.','must not',['must','may','should']],
 ['She asked me where I ___.','lived',['do live','living','will live']],
 ['The letter ___ yesterday.','was sent',['is send','sent by','has send']],
 ['He is ___ taller than his brother.','much',['most','many','few']],
 ['By the time we arrived, the film ___.','had started',['starts','will start','has start']],
 ['There is ___ information in this article.','a lot of',['many','few','a few']],
 ['I enjoy ___ books in English.','reading',['read','to reading','reads']],
 ['He suggested ___ earlier.','leaving',['to leave','leave','left']],
 ['Neither of the answers ___ correct.','is',['are','be','were']],
 ['I wish I ___ more free time.','had',['have','will have','having']],
 ['The girl ___ is standing there is my cousin.','who',['which','whose','where']],
 ['They are interested ___ history.','in',['on','at','with']],
 ['Despite ___ tired, she continued working.','being',['be','was','is']],
 ['This is the house ___ we grew up.','where',['which','who','whose']],
 ['You should ___ the instructions carefully.','read',['reading','to read','reads']],
 ['He has been absent ___ Monday.','since',['for','during','at']],
 ['If she had called me, I ___ helped her.','would have',['will have','would','had']],
 ['The teacher made the students ___ the exercise.','repeat',['to repeat','repeating','repeated']],
 ['You ___ bring a dictionary; we have extra copies.','need not',['must','cannot','ought']],
 ['Her new car is ___ expensive than mine.','more',['most','many','muchest']],
 ['I have not seen him ___ last summer.','since',['for','by','during']],
 ['Not only the teacher but also the students ___ ready.','are',['is','be','was']],
 ['I look forward to ___ from you soon.','hearing',['hear','heard','to hear']]
];
const listening=[
 {text:'Hello, my name is Jack. I am fifteen years old. I usually go to school by bus, but today my father drove me because it was raining.',prompt:'How did Jack get to school today?',answer:'By car',wrong:['By bus','On foot','By train']},
 {text:'Good morning. The museum opens at ten o’clock on weekdays and closes at five. On Sunday it is closed.',prompt:'When does the museum open on weekdays?',answer:'At 10:00',wrong:['At 9:00','At 8:00','At 12:00']},
 {text:'Mia: What would you like to drink? Tom: A glass of water, please. I have already had two cups of coffee today.',prompt:'What does Tom ask for?',answer:'Water',wrong:['Coffee','Tea','Juice']},
 {text:'Sara lives in a small village near a forest. Every summer she visits her grandparents, who have a little farm with chickens and sheep.',prompt:'Where does Sara visit her grandparents?',answer:'On a farm',wrong:['At the beach','In a city flat','At a hotel']},
 {text:'Attention, passengers. The train to Ganja will leave at quarter past four from platform three. Please keep your tickets ready.',prompt:'Which platform does the train leave from?',answer:'Platform 3',wrong:['Platform 1','Platform 2','Platform 4']},
 {text:'Ben: Did you buy a new phone? Lily: No, I bought a tablet for my younger brother. His birthday is on Friday.',prompt:'What did Lily buy?',answer:'A tablet',wrong:['A phone','A laptop','A camera']}
];
const readings=[
 {text:'Amina has always enjoyed science. Last year she joined a school club that builds simple robots. At first, her team made many mistakes, but they kept trying. Their latest robot can carry books from one classroom to another. Amina says the experience taught her that teamwork is more important than being the smartest person in the room.',questions:[['What club did Amina join?','A robotics club',['A music club','A sports club','A drama club']],['What can the latest robot do?','Carry books',['Cook meals','Clean windows','Grow plants']],['What happened at first?','They made mistakes',['They won a prize','They sold the robot','They moved schools']],['What lesson did Amina learn?','Teamwork matters',['Robots are always dangerous','Science is boring','Studying alone is best']]]},
 {text:'Last weekend, Murad and his family visited a national park. A guide explained why visitors should stay on marked paths: small plants and animal habitats can be damaged easily. The family carried reusable water bottles and took all their rubbish home. Murad took photographs but did not pick any flowers. He hopes to return in spring to see the park in bloom.',questions:[['Where did Murad go?','A national park',['A shopping mall','A cinema','An airport']],['Why should visitors stay on paths?','To protect nature',['To buy tickets','To avoid photographs','To find shops']],['What did the family do with their rubbish?','Took it home',['Left it in the forest','Burned it','Put it in the river']],['When does Murad hope to return?','In spring',['In winter','Tomorrow morning','In autumn']]]},
 {text:'An online library in a small town lets students borrow digital books for free. Students sign in with a school card, choose a title and read it on a phone or computer. The books return automatically after two weeks, so nobody has to pay a late fee. The librarian says the service is useful for students who live far from town.',questions:[['What is free?','Borrowing digital books',['Buying a phone','Printing books','The school bus']],['What do students need to sign in?','A school card',['A passport','A bank card','A paper ticket']],['When do the books return automatically?','After two weeks',['After one day','After one month','After a year']],['Who especially benefits?','Students living far away',['Only teachers','Tourists','Only very young children']]]},
 {text:'Researchers studied how short breaks affect learning. One group of students studied continuously for an hour, while another group took a five-minute break after each twenty minutes. Both groups studied the same material. In a later quiz, the students who took breaks remembered more information. Researchers say breaks may help attention, but they do not replace regular study.',questions:[['What did researchers study?','Short breaks and learning',['Food prices','Sports injuries','Travel habits']],['How long were the breaks?','Five minutes',['One minute','Ten minutes','An hour']],['Which group remembered more?','Students who took breaks',['Students with no breaks','Both equally','None of them']],['What do researchers say?','Breaks do not replace studying',['Breaks replace all study','Students should never stop','Only adults need breaks']]]}
];
const essayTopics=[
 'Write about the advantages and disadvantages of learning a foreign language.',
 'Describe a person who has influenced your life and explain why.',
 'How can young people protect the environment in everyday life?',
 'Do you prefer studying alone or with classmates? Give reasons.',
 'What are the benefits and risks of using technology at school?',
 'Describe a memorable journey and what you learned from it.'
];
function dimQuestions(){
 const g=sample(dimGrammar,13).map(x=>mc(x[0],x[1],x[2],'Grammar & Vocabulary'));
 const l=sample(listening,4).map(x=>mc(x.prompt,x.answer,x.wrong,'Listening · sintez edilmiş səs','Audio is not displayed as text until after the test.',x.text));
 const passages=sample(readings,2);
 const r=passages.flatMap((passage,i)=>passage.questions.map(x=>mc(x[0],x[1],x[2],`Reading · Text ${i+1}`,passage.text)));
 const e={type:'essay',prompt:sample(essayTopics,1)[0],tag:'Essay · 100 söz',answer:null,options:[]};
 return [...g,...l,...r,e];
}
function toggle(visible){for(const id of ['selection','setup-zone','quiz-zone','result-zone'])$(id).classList.toggle('hidden',id!==visible);$('intro').classList.toggle('hidden',visible!=='selection');window.scrollTo({top:0,behavior:'instant'});}
function choose(type){state.type=type;$('setup-type').textContent=CATEGORIES[type];$('vocab-options').classList.toggle('hidden',type!=='vocab');$('grammar-options').classList.toggle('hidden',type!=='grammar');$('setup-heading').textContent=CATEGORIES[type];toggle('setup-zone');}
for(const b of document.querySelectorAll('[data-type]'))b.addEventListener('click',()=>choose(b.dataset.type));
$('back-to-types').addEventListener('click',()=>toggle('selection'));
$('setup-form').addEventListener('submit',e=>{
 e.preventDefault();
 const f=$('first-name').value.trim(),l=$('last-name').value.trim();if(!f||!l){alert('Ad və soyadı daxil edin.');return;}
 state.student={firstName:f,lastName:l,className:$('student-class').value.trim(),school:$('student-school').value.trim(),grade:state.type==='vocab'?Number($('grade-select').value):null,mode:state.type==='vocab'?$('vocab-mode').value:state.type==='grammar'?$('grammar-level').value:'DİM 11'};
 try{
  state.questions=state.type==='vocab'?vocabQuestions(state.student.grade,state.student.mode):state.type==='grammar'?sample(state.student.mode==='mixed'?[...a1,...a2]:state.student.mode==='A1'?a1:a2,10):dimQuestions();
 }catch(err){alert(err.message);return;}
 state.answers=Array(state.questions.length).fill('');state.index=0;renderQuestion();toggle('quiz-zone');
});
function saveAnswer(){const q=state.questions[state.index];if(q.type==='text'||q.type==='essay')state.answers[state.index]=$('answer-input')?.value||'';}
function renderQuestion(){
 const i=state.index,q=state.questions[i];$('quiz-count').textContent=`${i+1} / ${state.questions.length}`;
 $('quiz-category').textContent=CATEGORIES[state.type];$('quiz-progress').style.width=`${((i+1)/state.questions.length)*100}%`;
 $('question-tag').textContent=`${q.tag} · SUAL ${String(i+1).padStart(2,'0')}`;
 $('quiz-heading').textContent=q.prompt;
 $('question-help').textContent=q.type==='mc'?'Düzgün cavabı seçin.':q.type==='essay'?'İngilis dilində təxminən 100 söz yazın. Esse müəllim tərəfindən yoxlanılmalıdır.':'Cavabı ingilis dilində yazın. Böyük/kiçik hərf və cümləsonu durğu işarələri nəzərə alınmır.';
 $('question-extra').textContent=q.audio?'Dinləmə mətni yalnız səs vasitəsilə təqdim edilir.':(q.extra||'');
 const root=$('question-answers');root.replaceChildren();
 if(q.type==='mc'){
  if(q.audio){const play=document.createElement('button');play.type='button';play.className='audio-button';play.textContent='▶ Dinləmə mətnini səsləndir';play.addEventListener('click',()=>{
   if(!('speechSynthesis'in window)){alert('Brauzer səs sintezini dəstəkləmir.');return;}
   speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(q.audio);utterance.lang='en-US';utterance.rate=.83;utterance.pitch=1;speechSynthesis.speak(utterance);
  });root.appendChild(play);}
  for(const [j,opt] of q.options.entries()){
   const b=document.createElement('button');b.type='button';b.className='answer-option'+(state.answers[i]===opt?' selected':'');b.setAttribute('aria-pressed',String(state.answers[i]===opt));
   const letter=document.createElement('span');letter.className='answer-letter';letter.textContent='ABCD'[j];const value=document.createElement('span');value.className='answer-text';value.textContent=opt;b.append(letter,value);
   b.addEventListener('click',()=>{state.answers[i]=opt;renderQuestion();});root.appendChild(b);
  }
 }else{
  const label=document.createElement('label');label.className='written-answer';label.textContent=q.type==='essay'?'Essay cavabı':'Cavabınız';label.htmlFor='answer-input';
  const inp=document.createElement(q.type==='essay'?'textarea':'input');inp.id='answer-input';inp.autocomplete='off';inp.spellcheck=q.type==='essay';if(q.type!=='essay')inp.type='text';inp.placeholder=q.type==='essay'?'Write your essay here…':'Write your answer…';inp.value=state.answers[i];
  inp.addEventListener('input',()=>{state.answers[i]=inp.value;if(q.type==='essay')$('essay-words').textContent=String(inp.value.trim()?inp.value.trim().split(/\s+/).length:0);});
  label.appendChild(inp);root.appendChild(label);
  if(q.type==='essay'){const p=document.createElement('p');p.className='essay-prompt';p.textContent='Söz sayı: ';const count=document.createElement('strong');count.id='essay-words';count.textContent=String(inp.value.trim()?inp.value.trim().split(/\s+/).length:0);p.appendChild(count);root.appendChild(p);}
 }
 $('prev-question').disabled=i===0;$('next-question').textContent=i===state.questions.length-1?'Testi bitir ✓':'Növbəti →';
}
$('prev-question').addEventListener('click',()=>{saveAnswer();if(state.index>0){state.index--;renderQuestion();}});
$('next-question').addEventListener('click',()=>{
 saveAnswer();if(state.index<state.questions.length-1){state.index++;renderQuestion();return;}
 const blanks=state.answers.filter(a=>!String(a).trim()).length;
 if(blanks&&!confirm(`${blanks} sual cavabsız qalıb. Testi bitirmək istəyirsiniz?`))return;
 finish();
});
$('quit-quiz').addEventListener('click',()=>{if(confirm('Testdən çıxmaq istəyirsiniz? Cari cavablar itəcək.')){if('speechSynthesis'in window)speechSynthesis.cancel();toggle('selection');}});
function finish(){
 if('speechSynthesis'in window)speechSynthesis.cancel();
 let correct=0;const review=state.questions.map((q,i)=>{const answer=state.answers[i];const ok=q.type==='essay'?null:q.type==='text'?q.acceptable.some(a=>plain(a)===plain(answer)):q.answer===answer;if(ok===true)correct++;return{tag:q.tag,prompt:q.prompt,answer,correct:q.answer,ok,essay:q.type==='essay',audio:q.audio};});
 const essay=state.type==='dim';const max=essay?83:state.questions.length,points=essay?correct*3+(review.slice(17,25).filter(x=>x.ok).length):correct;
 // DİM: 13 grammar ×3, 4 listening ×3, 8 reading ×4 = 83.
 // Above formula 25 answers ×3 plus one extra per correct reading.
 const result={student:state.student,type:state.type,category:CATEGORIES[state.type],date:new Date().toISOString(),points,max,percent:Math.round(points/max*100),essayPending:essay,essayText:essay?state.answers.at(-1):'',review};state.lastResult=result;
 try{const old=JSON.parse(localStorage.getItem('nb-tests-results')||'[]');old.unshift({student:result.student,type:result.type,date:result.date,points,max,essayPending:essay});localStorage.setItem('nb-tests-results',JSON.stringify(old.slice(0,30)));}catch{}
 $('result-heading').textContent=`Təbriklər, ${state.student.firstName}!`;
 $('result-subtitle').textContent=`${CATEGORIES[state.type]} · ${new Date().toLocaleDateString('az-AZ')}`;
 $('result-points').textContent=`${points} / ${max}`;$('result-percent').textContent=`${result.percent}%${essay?' (test hissəsi)':''}`;
 $('essay-notice').classList.toggle('hidden',!essay);$('essay-notice').textContent=essay?'Yalnız avtomatik yoxlanan 83 bal göstərilir. Esse üçün qalan 17 bal müəllim yoxlamasından sonra əlavə olunmalıdır. Bu yekun 100 ballıq nəticə deyil.':'';
 const list=$('result-review');list.replaceChildren();review.forEach((row,i)=>{
  const box=document.createElement('div');box.className='review-item '+(row.ok===null?'pending':row.ok?'correct':'incorrect');
  const title=document.createElement('b');title.textContent=`${i+1}. ${row.ok===null?'Esse — yoxlanılmayıb':row.ok?'✓ Düzgün':'✕ Yanlış'}`;
  const text=document.createElement('span');text.textContent=row.prompt;
  const detail=document.createElement('div');detail.textContent=row.ok===null?`Esse: ${row.answer?row.answer.slice(0,350):'Cavab yazılmayıb'}`:`Sizin cavabınız: ${row.answer||'—'}${row.ok?'':` · Düzgün: ${row.correct}`}`;
  box.append(title,text,detail);list.appendChild(box);
 });toggle('result-zone');
}
$('download-result').addEventListener('click',()=>{
 const r=state.lastResult;if(!r)return;
 const row=(cols)=>cols.map(value=>{let v=String(value??'');if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}).join(',');
 const data=[['Ad','Soyad','Sinif','Məktəb','Test','Tarix','Bal','Maksimum','Faiz','Esse yoxlaması','Esse mətni'],[r.student.firstName,r.student.lastName,r.student.className,r.student.school,r.category,r.date,r.points,r.max,r.percent,r.essayPending?'Gözlənilir':'Yox',r.essayText]].map(row).join('\r\n');
 const url=URL.createObjectURL(new Blob(['\uFEFF'+data],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`netice-${r.type}-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('retry-test').addEventListener('click',()=>toggle('selection'));
})();
