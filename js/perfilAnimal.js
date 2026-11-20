const dados = window.PetLarStore?.animais() || window.PETLAR_ANIMAIS || [];
const id = Number(new URLSearchParams(location.search).get('id'));
const animal = dados.find(a => a.id === id && a.ativo !== false);
const area = document.getElementById('animalDetalhe');
const usuarios = () => { try { const v=JSON.parse(localStorage.getItem('usuario') || '[]'); return Array.isArray(v)?v:[]; } catch { return []; } };
const pedidoAtivo = nome => usuarios().some(u => (u.adocoes||[]).some(a=>a.nome===nome && a.status !== 'recusada'));
function elemento(tag, classe, texto){const el=document.createElement(tag);if(classe)el.className=classe;if(texto!==undefined)el.textContent=texto;return el;}
if (!animal) {
  area.append(elemento('h1','','Animal não encontrado'),elemento('p','','O perfil solicitado não existe no catálogo.'));
} else {
  document.title = `${animal.nome} | PetLar`;
  const container=elemento('article','animal-detail');
  const foto=elemento('img','detail-photo');foto.src=animal.imagem;foto.alt=`Foto de ${animal.nome}`;
  const content=elemento('div','detail-copy');
  content.append(elemento('span','eyebrow','🐾 CONHEÇA SEU NOVO AMIGO'),elemento('h1','',animal.nome),elemento('p','lead',animal.descricao));
  const facts=elemento('div','detail-facts');
  [['Espécie',animal.especie || 'Não informada'],['Raça',animal.raca || 'Não informada'],['Sexo',animal.sexo],['Porte',animal.porte],['Características',animal.temperamento],['Informações',animal.resumo]].forEach(([k,v])=>{const box=elemento('div','fact');box.append(elemento('span','',k),elemento('strong','',v));facts.append(box);});
  content.append(facts);
  const avis=elemento('p','detail-disclaimer','Perfil demonstrativo: algumas características são exemplos de apresentação e precisam ser confirmadas pela ONG.');
  const btn=elemento('button','button-primary','Solicitar adoção');btn.type='button';
  if(pedidoAtivo(animal.nome)){btn.disabled=true;btn.textContent='Solicitação já registrada';}
  btn.addEventListener('click',()=>{
    const email=localStorage.getItem('usuarioLogado');const u=usuarios().find(u=>u.email===email);
    if(!u){location.href='login.html';return;}
    if(pedidoAtivo(animal.nome)){status.textContent='Este animal já possui uma solicitação ativa.';return;}
    document.getElementById('animalSelecionado').value=animal.nome;
    document.getElementById('nomeAdotante').value=u.nome;
    document.getElementById('emailAdotante').value=u.email;
    document.getElementById('telefoneAdotante').value=u.telefone||'';
    document.getElementById('modalAdocao').style.display='flex';
  });
  const status=elemento('p','detail-message');status.setAttribute('role','status');
  content.append(avis,btn,status);container.append(foto,content);area.append(container);
}
const modal=document.getElementById('modalAdocao');
document.getElementById('cancelarAdocao').addEventListener('click',()=>{modal.style.display='none';document.getElementById('formAdocao').reset();});
document.getElementById('formAdocao').addEventListener('submit',e=>{
 e.preventDefault();const ulist=usuarios();const u=ulist.find(u=>u.email===localStorage.getItem('usuarioLogado'));
 const nome=document.getElementById('animalSelecionado').value;
 const motivo=document.getElementById('motivo').value.trim();const telefone=document.getElementById('telefoneAdotante').value.trim();
 const mensagem=document.getElementById('mensagemAdocao');
 if(!u){mensagem.textContent='Faça login para continuar.';return;}
 if(!motivo||!telefone){mensagem.textContent='Informe telefone e motivo.';return;}
 if(pedidoAtivo(nome)){mensagem.textContent='Este animal já possui solicitação ativa.';return;}
 u.adocoes??=[];u.adocoes.push({nome,motivo,telefone,data:new Date().toLocaleDateString('pt-BR'),status:'pendente'});
 localStorage.setItem('usuario',JSON.stringify(ulist));location.href='quero-adotar.html';
});
