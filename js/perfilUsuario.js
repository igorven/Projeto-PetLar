const area=document.getElementById('perfilConteudo');
const email=localStorage.getItem('usuarioLogado');
let lista=[];try{const v=JSON.parse(localStorage.getItem('usuario')||'[]');lista=Array.isArray(v)?v:[];}catch{}
const u=lista.find(p=>p.email===email);
const el=(tag,cls='',txt='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=txt;return e;};
if(!u){
 const box=el('div','profile-panel');box.append(el('h2','','Acesse sua conta'),el('p','','Entre para ver suas informações e suas solicitações.'));
 const link=el('a','button-primary','Fazer login');link.href='login.html';box.append(link);area.append(box);
}else{
 const pane=el('div','profile-panel');pane.append(el('span','eyebrow','DADOS DO ADOTANTE'),el('h2','',u.nome||'Adotante'));
 const data=el('div','profile-data');
 [['E-mail',u.email],['Telefone',u.telefone||'Não informado'],['Cidade',u.cidade||'Não informada'],['Estado',u.estado||'Não informado']].forEach(([label,val])=>{const item=el('div','profile-data-item');item.append(el('span','',label),el('strong','',val));data.append(item)});
 pane.append(data);
 try{const req=JSON.parse(localStorage.getItem('petlar_verificacoes_demo_v1')||'[]');const latest=Array.isArray(req)?req.filter(x=>x.email===u.email).at(-1):null;if(latest){const note=el('p','privacy-note',({pendente:'Verificação: solicitação fictícia aguardando triagem.',correcao:'Verificação: correção solicitada na demonstração.',revisada_simulacao:'Verificação: revisão fictícia concluída; identidade NÃO verificada.'})[latest.status]||'Verificação: etapa fictícia.');pane.append(note);if(latest.observacao)pane.append(el('p','privacy-note','Orientação da equipe fictícia: '+latest.observacao));}}catch{}
 const edit=el("a","button-outline","Editar dados");edit.href="editar-perfil.html";pane.append(edit);const small=el('p','privacy-note','Seus dados são apenas demonstrativos e estão armazenados neste navegador. Não use informações reais nesta versão.');pane.append(small);area.append(pane);
 const reqs=Array.isArray(u.adocoes)?u.adocoes:[];
 const pend=reqs.filter(a=>(a.status||'pendente')==='pendente').length, apr=reqs.filter(a=>a.status==='aprovada').length;
 const metrics=el('div','profile-stats');[['Solicitações',reqs.length],['Pendentes',pend],['Aprovadas',apr]].forEach(([t,n])=>{const b=el('div','stat-box');b.append(el('strong','',String(n)),el('span','',t));metrics.append(b)});area.append(metrics);
 const requests=el('section','profile-panel');requests.append(el('h2','','Minhas solicitações'));
 if(!reqs.length){requests.append(el('p','','Você ainda não enviou solicitações.'));}
 else {const list=el('div','request-list');reqs.forEach(a=>{const item=el('article','request-item');const details=el('div');details.append(el('h3','',a.nome),el('p','',`Solicitado em ${a.data||'data não informada'}`));if(a.status==='aprovada')details.append(el('p','decision-notice','✓ Sua solicitação foi aprovada na demonstração.' ));if(a.status==='recusada')details.append(el('p','decision-notice',`Solicitação recusada${a.motivoRecusa?': '+a.motivoRecusa:'.'}`));const status=el('span','status-chip status-'+(a.status||'pendente'),a.status||'pendente');item.append(details,status);list.append(item)});requests.append(list)}
 const link=el('a','button-outline','Explorar animais');link.href='animais.html';requests.append(link);area.append(requests);
}
