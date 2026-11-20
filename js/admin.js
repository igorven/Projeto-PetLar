const store = window.PetLarStore;
const $ = id => document.getElementById(id);
const editor = $('editorAnimal');
const msg = texto => { $('feedback').textContent = texto; toast(texto); };
let toastTimer;
function toast(texto){const t=$('toast');t.textContent=texto;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,4600);}

const clone = v => JSON.parse(JSON.stringify(v));
const statusPedido = p => p.status || 'pendente';
function aba(nome) {
  document.querySelectorAll('.tab').forEach(e => e.classList.toggle('active',e.id === `tab-${nome}`));
  document.querySelectorAll('.nav-item').forEach(e => e.classList.toggle('selected',e.dataset.tab === nome));
  document.querySelector('.sidebar').classList.remove('open');
  $('menuMobile').setAttribute('aria-expanded','false');
  render();
  window.dispatchEvent(new CustomEvent('petlar:admin-tab',{detail:{tab:nome}}));
}
document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>aba(btn.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>{aba(btn.dataset.go);if(btn.textContent.includes('Novo'))abrirEditor();}));
$('menuMobile').addEventListener('click',()=>{const aberto=document.querySelector('.sidebar').classList.toggle('open');$('menuMobile').setAttribute('aria-expanded',String(aberto));});
function statusElemento(status) {const el=document.createElement('span');el.className=`status status-${status}`;el.textContent=status;return el;}
function botao(texto,acao,classe='') {const b=document.createElement('button');b.type='button';b.className=`action ${classe}`;b.textContent=texto;b.addEventListener('click',acao);return b;}
function renderResumo(){const p=store.pedidos();$('metricAtivos').textContent=store.disponiveis().length;$('metricPendentes').textContent=p.filter(x=>statusPedido(x.pedido)==='pendente').length;$('metricAprovadas').textContent=p.filter(x=>statusPedido(x.pedido)==='aprovada').length;$('metricRecusadas').textContent=p.filter(x=>statusPedido(x.pedido)==='recusada').length;renderPedidos('pedidosRecentes','todos',5);}
function renderAnimais(){const corpo=$('tabelaAnimais');corpo.replaceChildren();const termo=$('buscaAnimais').value.trim().toLocaleLowerCase('pt-BR');const categoria=$('filtroAnimais').value;const adotados=new Set(store.pedidos().filter(x=>statusPedido(x.pedido)==='aprovada').map(x=>x.pedido.nome));const lista=store.animais().filter(a=>a.nome.toLocaleLowerCase('pt-BR').includes(termo)&&(categoria==='todos'||a.categoria===categoria));$('vazioAnimais').hidden=lista.length>0;
lista.forEach(a=>{const tr=document.createElement('tr');const cell=document.createElement('td');const wrap=document.createElement('div');wrap.className='animal-cell';const foto=document.createElement('img');foto.src=a.imagem||'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600';foto.alt='';const detalhe=document.createElement('div');const nome=document.createElement('strong');nome.textContent=a.nome;const resumo=document.createElement('small');resumo.textContent=a.resumo;detalhe.append(nome,resumo);wrap.append(foto,detalhe);cell.append(wrap);const cat=document.createElement('td');cat.textContent=`${a.especie || 'Não informada'} · ${a.raca || 'Não informada'}`;const st=document.createElement('td');st.append(statusElemento(adotados.has(a.nome)?'aprovada':a.ativo===false?'inativo':'ativo'));const actions=document.createElement('td');actions.append(botao('Editar',()=>abrirEditor(a.id)));if(!adotados.has(a.nome))actions.append(botao(a.ativo===false?'Reativar':'Ocultar',()=>alternar(a.id),a.ativo===false?'':'danger'));tr.append(cell,cat,st,actions);corpo.append(tr);});}
function alternar(id){const lista=store.animais();const a=lista.find(a=>a.id===id);if(!a)return;a.ativo=a.ativo===false;store.salvarAnimais(lista);msg(`${a.nome}: disponibilidade alterada.`);render();}
function atualizarRacasAdmin(racaSelecionada='Não informada') {
 const especie=$('animalEspecie').value;
 const lista=window.PetLarTaxonomia?.[especie] || ['Não informada','Outra raça'];
 const racas=[...new Set([...lista,racaSelecionada])];
 $('animalRaca').replaceChildren(...racas.map(r=>new Option(r,r)));
 $('animalRaca').value=racas.includes(racaSelecionada)?racaSelecionada:lista[0];
}
$('animalEspecie').addEventListener('change',()=>{const e=$('animalEspecie').value;$('animalCategoria').value=e==='Cachorro'?'cachorro':e==='Gato'?'gato':'outro';atualizarRacasAdmin();});
$('animalCategoria').addEventListener('change',()=>{const c=$('animalCategoria').value;if(c!=='outro'){$('animalEspecie').value=c==='cachorro'?'Cachorro':'Gato';atualizarRacasAdmin();}else if(['Cachorro','Gato'].includes($('animalEspecie').value)){$('animalEspecie').value='Outro';atualizarRacasAdmin();}});
function abrirEditor(id){$('formAnimal').reset();$('animalId').value='';$('animalAtivo').checked=true;$('animalEspecie').value='Cachorro';atualizarRacasAdmin();$('tituloEditor').textContent='Novo animal';if(id!=null){const a=store.animais().find(a=>a.id===id);if(!a)return;$('tituloEditor').textContent=`Editar ${a.nome}`;$('animalId').value=String(a.id);for(const [k,v] of Object.entries({Nome:a.nome,Categoria:a.categoria,Sexo:a.sexo,Porte:a.porte,Resumo:a.resumo,Imagem:a.imagem,Temperamento:a.temperamento,Descricao:a.descricao})){$(`animal${k}`).value=v||'';}$('animalEspecie').value=a.especie || ({cachorro:'Cachorro',gato:'Gato'}[a.categoria] || 'Outro');atualizarRacasAdmin(a.raca || 'Não informada');$('animalAtivo').checked=a.ativo!==false;}editor.showModal();}
$('novoAnimal').addEventListener('click',()=>abrirEditor());$('fecharEditor').addEventListener('click',()=>editor.close());$('cancelarEditor').addEventListener('click',()=>editor.close());
$('formAnimal').addEventListener('submit',e=>{e.preventDefault();const lista=clone(store.animais());const id=Number($('animalId').value);const nome=$('animalNome').value.trim();if(!nome){msg('Informe o nome do animal.');return;}if(lista.some(a=>a.nome.toLocaleLowerCase('pt-BR')===nome.toLocaleLowerCase('pt-BR')&&a.id!==id)){msg('Já existe um animal com esse nome no catálogo de demonstração.');return;}const antigo=id?lista.find(a=>a.id===id):null;const animal={id:id||Math.max(0,...lista.map(a=>a.id))+1,nome,categoria:($('animalEspecie').value==='Cachorro'?'cachorro':$('animalEspecie').value==='Gato'?'gato':'outro'),especie:$('animalEspecie').value,raca:$('animalRaca').value,sexo:$('animalSexo').value,porte:$('animalPorte').value,resumo:$('animalResumo').value.trim(),imagem:$('animalImagem').value.trim(),temperamento:$('animalTemperamento').value.trim(),descricao:$('animalDescricao').value.trim(),ativo:$('animalAtivo').checked};if(antigo){if(store.pedidos().some(x=>x.pedido.nome===antigo.nome)&&nome!==antigo.nome){msg('Não é possível renomear animais com solicitações registradas nesta versão.');return;}Object.assign(antigo,animal);}else lista.push(animal);store.salvarAnimais(lista);editor.close();msg(`${nome} salvo com sucesso.`);aba('animais');});
let decisaoPendente=null;
const dialogDecisao=$('dialogDecisao');
function decisao(indiceUsuario,indicePedido,novoStatus){
 const usuarios=store.usuarios(), pedido=usuarios[indiceUsuario]?.adocoes?.[indicePedido];
 if(!pedido||statusPedido(pedido)!=='pendente'){msg('Solicitação indisponível para alteração.');return;}
 decisaoPendente={indiceUsuario,indicePedido,novoStatus};
 $('tituloDecisao').textContent=novoStatus==='aprovada'?'Aprovar solicitação?':'Recusar solicitação?';
 $('descricaoDecisao').textContent=novoStatus==='aprovada'?`Você está prestes a aprovar a adoção de ${pedido.nome}. A ação retirará o animal do catálogo disponível.`:`Você está prestes a recusar a solicitação de ${pedido.nome}. Informe o motivo para que o adotante o visualize no perfil.`;
 $('grupoMotivo').hidden=novoStatus!=='recusada';$('motivoRecusa').required=novoStatus==='recusada';$('motivoRecusa').value='';
 $('confirmarDecisao').textContent=novoStatus==='aprovada'?'Sim, aprovar':'Confirmar recusa';
 $('confirmarDecisao').classList.toggle('danger-submit',novoStatus==='recusada');
 dialogDecisao.showModal();
}
function fecharDecisao(){dialogDecisao.close();decisaoPendente=null;}
$('fecharDecisao').addEventListener('click',fecharDecisao);
$('cancelarDecisao').addEventListener('click',fecharDecisao);
dialogDecisao.addEventListener('close',()=>{decisaoPendente=null});
$('formDecisao').addEventListener('submit',e=>{
 e.preventDefault();if(!decisaoPendente)return;
 const {indiceUsuario,indicePedido,novoStatus}=decisaoPendente;
 const usuarios=store.usuarios(),pedido=usuarios[indiceUsuario]?.adocoes?.[indicePedido];
 if(!pedido||statusPedido(pedido)!=='pendente'){fecharDecisao();msg('Esta solicitação já foi analisada.');return;}
 const motivo=$('motivoRecusa').value.trim();
 if(novoStatus==='recusada'&&motivo.length<10){$('motivoRecusa').setCustomValidity('Informe um motivo com pelo menos 10 caracteres.');$('motivoRecusa').reportValidity();return;}
 if(novoStatus==='aprovada'&&store.pedidos().some(x=>x.pedido.nome===pedido.nome&&statusPedido(x.pedido)==='aprovada')){fecharDecisao();msg('Esse animal já possui uma adoção aprovada.');return;}
 pedido.status=novoStatus;
 if(novoStatus==='recusada')pedido.motivoRecusa=motivo;
 pedido.dataDecisao=new Date().toLocaleDateString('pt-BR');
 store.salvarUsuarios(usuarios);fecharDecisao();render();msg(`Solicitação ${novoStatus} com sucesso. O status foi atualizado no perfil do adotante.`);
});
$('motivoRecusa').addEventListener('input',()=>$('motivoRecusa').setCustomValidity(''));
function renderPedidos(alvo,filtro='todos',limite=Infinity){const div=$(alvo);div.replaceChildren();let linhas=store.pedidos().reverse().filter(x=>filtro==='todos'||statusPedido(x.pedido)===filtro).slice(0,limite);if(!linhas.length){const vazio=document.createElement('p');vazio.className='empty';vazio.textContent='Nenhuma solicitação encontrada.';div.append(vazio);return;}linhas.forEach(x=>{const item=document.createElement('article');item.className='request';const left=document.createElement('div');const title=document.createElement('h3');title.textContent=`${x.pedido.nome} · ${x.usuario.nome||'Adotante'}`;const data=document.createElement('p');data.textContent=`${x.pedido.data||'Data não informada'} · ${x.usuario.email||'Sem e-mail'}`;const motivo=document.createElement('p');motivo.textContent=`Motivo: ${x.pedido.motivo||'Não informado'}`;left.append(title,data,motivo);const right=document.createElement('div');right.className='request-actions';right.append(statusElemento(statusPedido(x.pedido)));if(statusPedido(x.pedido)==='pendente'){right.append(botao('Aprovar',()=>decisao(x.indiceUsuario,x.indicePedido,'aprovada')),botao('Recusar',()=>decisao(x.indiceUsuario,x.indicePedido,'recusada'),'danger'));}item.append(left,right);div.append(item);});}
function render(){renderResumo();renderAnimais();renderPedidos('listaPedidos',$('filtroPedidos').value);}
$('buscaAnimais').addEventListener('input',renderAnimais);$('filtroAnimais').addEventListener('change',renderAnimais);$('filtroPedidos').addEventListener('change',()=>renderPedidos('listaPedidos',$('filtroPedidos').value));render();
