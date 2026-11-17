(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LumeCommands=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function parse(value){const text=String(value||'').trim();let m;
 if(/^(?:ajuda|\/ajuda|o que (?:você|voce) faz)\s*[?.!]*$/i.test(text))return {kind:'help'};
 if(/^(?:(?:listar|mostrar|ver|quais são|quais sao)\s+(?:as\s+|minhas\s+)?tarefas|minhas tarefas)\s*[?.!]*$/i.test(text))return {kind:'tasks-list'};
 m=text.match(/^(?:adicione|adicionar|crie|criar|anote|cadastrar|cadastre)\s+(?:uma?\s+)?tarefa\s*[:\-]?\s+(.+)$/i);
 if(m)return m[1].trim().length<=140?{kind:'task-add',text:m[1].trim()}:{kind:'invalid',message:'A tarefa precisa ter até 140 caracteres.'};
 m=text.match(/^(?:inicie|iniciar|comece|começar|comecar|iniciar|ative)\s+(?:(?:um|o)\s+)?(?:foco|pomodoro)(?:\s+de\s+(\d{1,3})\s*(?:minutos?|min))?\s*[.!]*$/i);
 if(m){let n=m[1]?Number(m[1]):25;return n>=1&&n<=180?{kind:'focus-start',minutes:n}:{kind:'invalid',message:'Escolha uma duração entre 1 e 180 minutos.'}};
 if(/^(?:bebi|beber|registrar|registre)\s+(?:(?:um|1)\s+)?copo(?:\s+de\s+[áa]gua)?\s*[.!]*$/i.test(text))return {kind:'water-add'};
 m=text.match(/^(?:anote|anotar|salve|salvar)\s*[:\-]\s*(.+)$/i);
 if(m)return m[1].trim().length<=1000?{kind:'note-add',text:m[1].trim()}:{kind:'invalid',message:'A anotação precisa ter até 1.000 caracteres.'};
 return {kind:'other'};
}
return {parse};
});