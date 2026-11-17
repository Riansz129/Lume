(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LumeReminders=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function parse(input,now=new Date()){
 const text=String(input||'').trim();
 const match=text.match(/^(?:(?:agende|agendar|agenta|agente|crie|criar|adicione|adicionar|programe|programar|marque|marcar)\s+(?:um\s+)?lembrete\b|lembrete\b|(?:me\s+)?lembre(?:-me)?\b)/i);
 if(!match)return {kind:'other'};
 let rest=text.slice(match[0].length).trim();
 if(/\b\d{1,2}[\/.-]\d{1,2}\b/.test(rest)||/\b(?:segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo|semana|m[eê]s)\b/i.test(rest))return {kind:'clarify',message:'Por enquanto, entendo hoje, amanhã ou um prazo em minutos. Use a aba Lembretes para escolher outra data.'};
 const rel=rest.match(/\bem\s+(\d+)\s*(minutos?|mins?|horas?|hrs?)\b/i);
 const day=rest.match(/\b(hoje|amanhã|amanha)(?![A-Za-zÀ-ÿ])/i);
 const time=rest.match(/(?:\b(?:às|as|a)\s*)?\b(\d{1,2})(?:h(?:\s*(\d{1,2}))?|:(\d{2}))(?=\s|$|[.,!?])/i);
 if(rel&&(day||time))return {kind:'clarify',message:'Informe um prazo ou um horário, para eu não entender a data errada.'};
 let at;
 if(rel){
 const amount=Number(rel[1]);const unit=/^(hora|hr)/i.test(rel[2])?3600000:60000;
 if(!Number.isSafeInteger(amount)||amount<1||amount>10080)return {kind:'clarify',message:'Informe um prazo válido, como em 30 minutos.'};
 at=new Date(now.getTime()+amount*unit);rest=rest.replace(rel[0],' ');
 }else{
 if(!time)return {kind:'clarify',message:'Qual horário? Exemplo: lembrete hoje às 15h ou me lembre de pagar a conta amanhã às 15h30.'};
 const hh=Number(time[1]),mm=Number(time[2]||time[3]||0);
 if(hh>23||mm>59)return {kind:'clarify',message:'Esse horário não é válido. Use, por exemplo, 15h30.'};
 at=new Date(now);at.setSeconds(0,0);if(day&&/^amanh/i.test(day[1]))at.setDate(at.getDate()+1);const intended=at.getDate();at.setHours(hh,mm,0,0);
 if(at.getDate()!==intended||at.getHours()!==hh||at.getMinutes()!==mm)return {kind:'clarify',message:'Esse horário não existe nesta data. Escolha outro horário.'};
 if(at.getTime()<=now.getTime())return {kind:'clarify',message:'Esse horário já passou. Informe um horário futuro ou diga amanhã.'};
 rest=rest.replace(time[0],' ');if(day)rest=rest.replace(day[0],' ');
 }
 rest=rest.replace(/^\s*(?:(?:para|pra|de|que)\s+)+/i,'').replace(/\s+(?:para|pra|às|as|a|em)\s*$/i,'').replace(/\s+/g,' ').replace(/^[,.:;!?\s]+|[,.:;!?\s]+$/g,'').trim();
 if(rest.length>120)return {kind:'clarify',message:'O texto do lembrete precisa ter no máximo 120 caracteres.'};
 return {kind:'reminder',text:rest||'Lembrete',at:at.toISOString()};
}
return {parse};
});