'use strict';
// Only known, fixed strings are shown to the user; provider error text may contain secrets.
function aiErrorMessage(provider,status,code){
 if(provider==='groq'&&(code==='model_decommissioned'||code==='model_not_found'||code==='model_not_supported'||status===404))return 'O modelo da Groq não está disponível. Em Configurações, escolha openai/gpt-oss-20b e teste novamente.';
 if(code==='model_permission_blocked_org'||code==='model_permission_blocked_project'||code==='model_terms_required')return 'O modelo não está habilitado para esta conta ou projeto. Confira as permissões e os termos no painel do provedor.';
 if(status===401)return 'A chave não foi aceita. Gere uma nova chave no provedor e salve-a nas configurações.';
 if(status===403)return 'A chave ou conta não tem permissão para usar este modelo. Confira as permissões no provedor.';
 if(status===429)return 'O limite de uso foi atingido. Aguarde ou confira os limites da sua conta.';
 if(status>=500)return 'O serviço de IA está temporariamente indisponível. Tente novamente em instantes.';
 if(status===400||status===404||status===422)return 'O serviço recusou o pedido. Confira se o nome do modelo está disponível para sua conta.';
 return 'O serviço de IA retornou erro '+Number(status)+'. Confira suas configurações.';
}
module.exports={aiErrorMessage};
