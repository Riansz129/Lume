'use strict';
function contextMessages(history){if(!Array.isArray(history))return [];return history.slice(-10).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.trim()&&m.content.length<=4000).map(m=>({role:m.role,content:m.content}))}
module.exports={contextMessages};
