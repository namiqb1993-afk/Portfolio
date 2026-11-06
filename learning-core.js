/* Pure helpers shared by the learning interface and verification. */
(()=>{'use strict';const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function question(word,pool,type){const reverse=type==='reverse',key=reverse?'en':'az',correct=word[key];const seen=new Set([normalize(correct)]);const distractors=shuffle(pool).filter(w=>{const value=normalize(w[key]);if(value===normalize(correct)||seen.has(value)||normalize(w.en)===normalize(word.en))return false;seen.add(value);return true;}).slice(0,3).map(w=>w[key]);
let prompt=reverse?word.az:word.en;let answer=correct,kind='choice',options=shuffle([correct,...distractors]),hint=reverse?'İngiliscə qarşılığını seçin':'Azərbaycan dilində mənasını seçin';
if(type==='write'){kind='text';answer=word.en;prompt=word.az;hint='İngiliscə yazın';options=[];}
if(type==='letters'){kind='text';answer=word.en;prompt=shuffle([...word.en]).join(' · ');hint='Hərfləri düzün: '+word.az;options=[];}
if(type==='context'&&word.example){const escaped=word.en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const re=new RegExp('\\b'+escaped+'\\b','i');if(re.test(word.example)){kind='text';answer=word.en;prompt=word.example.replace(re,'_____');hint=word.translation||word.az;options=[];}}
return{prompt,answer,options,kind,hint,word,tag:type==='context'?'Kontekst':type==='letters'?'Hərf sırası':type==='write'?'Yazılı cavab':'Lüğət',explanation:word.en+' — '+word.az+(word.example?' · '+word.example:''),source:word.source};}
function gradeResult(correct,total){if(!total)return 0;return Math.round(correct/total*100);}
function diagnostic(answers,questions){const groups=[1,2,3].map(d=>{const indexes=questions.map((q,i)=>q.difficulty===d?i:-1).filter(i=>i>=0);return{difficulty:d,correct:indexes.filter(i=>normalize(answers[i]||'')===normalize(questions[i].answer)).length,total:indexes.length};});let band='Təməl bilikləri möhkəmləndirmək lazımdır';if(groups[0].correct>=6)band='Əsas biliklər formalaşıb';if(groups[0].correct>=6&&groups[1].correct>=6)band='Orta çətinlikli tapşırıqlara hazırsınız';if(groups.every(g=>g.correct>=6))band='Bu sınaqda güclü nəticə';return{band,groups};}
const core={normalize,shuffle,question,gradeResult,diagnostic};if(typeof module!=='undefined')module.exports=core;else window.NBLearningCore=core;
})();
