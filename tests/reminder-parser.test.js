const test=require('node:test'),assert=require('node:assert/strict'),{parse}=require('../reminder-parser');
const now=new Date(2026,10,17,14,0);
test('agendar lembrete sem assunto para hoje',()=>{let r=parse('Agente um lembrete para hoje 15h',now);assert.equal(r.kind,'reminder');assert.equal(r.text,'Lembrete');let d=new Date(r.at);assert.equal(d.getHours(),15);assert.equal(d.getDate(),17)});
test('lembrete com assunto amanhã e minutos',()=>{let r=parse('me lembre de pagar a conta amanhã às 15h30',now);assert.equal(r.kind,'reminder');assert.equal(r.text,'pagar a conta');let d=new Date(r.at);assert.equal(d.getDate(),18);assert.equal(d.getHours(),15);assert.equal(d.getMinutes(),30)});
test('entende prazo relativo',()=>{let r=parse('me lembre de ligar em 30 minutos',now);assert.equal(r.text,'ligar');assert.equal(new Date(r.at)-now,1800000)});
test('não cria horários passados ou inválidos',()=>{assert.equal(parse('lembrete hoje 13h',now).kind,'clarify');assert.equal(parse('lembrete hoje 25h',now).kind,'clarify');assert.equal(parse('lembrete 15h99',now).kind,'clarify')});
test('não inventa outras datas ou horário ausente',()=>{assert.equal(parse('me lembre de pagar dia 20/11 às 15h',now).kind,'clarify');assert.equal(parse('me lembre de pagar amanhã',now).kind,'clarify')});
test('conversas não são consideradas comandos',()=>{assert.equal(parse('Como faço para criar um lembrete?',now).kind,'other')});
test('não mistura prazo relativo com horário',()=>{assert.equal(parse('lembrete em 30 minutos amanhã às 15h',now).kind,'clarify')});
