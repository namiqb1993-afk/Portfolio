(()=>{'use strict';
const normalize=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g,' ');
const key=w=>normalize(w.en)+'|'+normalize(w.az);
function unique(words){return [...new Map(words.map(w=>[key(w),w])).values()];}
function due(record,now=Date.now()){return !!record&&record.due<=now;}
function schedule(previous,correct,now=Date.now()){const p=previous||{};const sameDay=p.lastDay===new Date(now).toISOString().slice(0,10);const streak=correct?Math.min(4,(p.streak||0)+(sameDay?0:1)):0;const days=[0,1,3,7,14][streak];return{streak,due:correct?now+days*86400000:now,lastDay:new Date(now).toISOString().slice(0,10),attempts:(p.attempts||0)+1,lastCorrect:correct};}
function select(words,records,count=8,now=Date.now()){const list=unique(words);return list.filter(w=>due(records[key(w)],now)).sort((a,b)=>records[key(a)].due-records[key(b)].due).concat(list.filter(w=>!records[key(w)])).slice(0,count);}
function cloze(word){if(!word.example)return null;const escaped=word.en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const re=new RegExp('\\b'+escaped+'\\b','i');return re.test(word.example)?word.example.replace(re,'_____'):null;}
const api={normalize,key,unique,due,schedule,select,cloze};if(typeof module!=='undefined')module.exports=api;else window.NBVocabulary=api;
})();
