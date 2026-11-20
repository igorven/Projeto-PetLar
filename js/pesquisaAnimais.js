const cardsContainer = document.querySelector('#adocao .cards');
const pesquisa = document.getElementById('pesquisa');
const filtro = document.getElementById('filtro');
const modal = document.getElementById('modalAdocao');
let animais = [];
let animalAtual = null;
const msg = (id, texto) => { const el = document.getElementById(id); if(el) el.textContent = texto; };
async function requisitar(url, options) {
  const res = await fetch(url, options);
  const json = await res.json();
  if(!res.ok) throw new Error(json.erro || 'Erro na operação.');
  return json;
}
function criarCard(animal) {
  const card = document.createElement('article');
  card.className = `card ${animal.categoria}`;
  const img = document.createElement('img');
  img.src = animal.fotoUrl || '';
  img.alt = animal.nomeAnimal;
  img.loading = 'lazy';
  const info = document.createElement('div'); info.className = 'info';
  const titulo = document.createElement('h3'); titulo.textContent = animal.nomeAnimal;
  const descricao = document.createElement('p');
  descricao.textContent = [animal.idadeAnimal != null ? `${animal.idadeAnimal} ano(s)` : '', animal.descricaoAnimal].filter(Boolean).join(' • ');
  const botao = document.createElement('button');
  botao.className = 'btn-adotar'; botao.textContent = 'Quero Adotar';
  botao.addEventListener('click', () => abrirModal(animal));
  info.append(titulo,descricao,botao); card.append(img,info);
  return card;
}
function filterAnimals() {
  const busca = pesquisa.value.toLocaleLowerCase('pt-BR').trim();
  const categoria = filtro.value;
  cardsContainer.replaceChildren(...animais.filter(a => a.statusAnimal === 'disponivel' && (categoria === 'todos' || a.categoria === categoria) && a.nomeAnimal.toLocaleLowerCase('pt-BR').includes(busca)).map(criarCard));
}
async function carregarAnimais() {
  try { animais = (await requisitar('api/animais.php')).animais; filterAnimals(); }
  catch(e) { msg('mensagemQuero', e.message); }
}
async function abrirModal(animal) {
  try {
    const sessao = await requisitar('api/sessao.php');
    if (!sessao.logado) return msg('mensagemQuero','Faça login para solicitar adoção.');
    animalAtual = animal;
    document.getElementById('animalSelecionado').value = String(animal.idAnimal);
    document.getElementById('nomeAdotante').value = sessao.usuario.nome;
    document.getElementById('emailAdotante').value = '';
    document.getElementById('telefoneAdotante').value = '';
    modal.style.display = 'flex';
    msg('mensagemAdocao','');
  } catch(e) { msg('mensagemQuero',e.message); }
}
async function confirmarAdocao() {
  try {
    const body = {
      idAnimal: Number(document.getElementById('animalSelecionado').value),
      telefone: document.getElementById('telefoneAdotante').value.trim(),
      motivo: document.getElementById('motivo').value.trim()
    };
    const result = await requisitar('api/solicitacoes.php', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    modal.style.display = 'none'; document.getElementById('formAdocao').reset();
    msg('mensagemQuero', result.mensagem);
    await carregarMinhasSolicitacoes();
  } catch(e) { msg('mensagemAdocao',e.message); }
}
async function carregarMinhasSolicitacoes() {
  const ul = document.getElementById('listaQueroAdotar'); ul.replaceChildren();
  try {
    const sessao = await requisitar('api/sessao.php');
    if (!sessao.logado) return msg('mensagemQuero','Faça login para visualizar suas solicitações.');
    const {solicitacoes} = await requisitar('api/solicitacoes.php');
    msg('mensagemQuero', solicitacoes.length ? '' : 'Nenhuma solicitação enviada.');
    for(const s of solicitacoes) {
      const li = document.createElement('li');
      li.textContent = `${s.nomeAnimal} — ${s.statusSolicitacao} (${s.dataSolicitacao})`;
      ul.append(li);
    }
  } catch(e) { msg('mensagemQuero',e.message); }
}
async function carregarAdotados() {
  const ul = document.getElementById('listaAdotados'); ul.replaceChildren();
  try {
    const {animais: adotados} = await requisitar('api/adotados.php');
    msg('mensagemAdotados', adotados.length ? '' : 'Nenhum animal adotado.');
    for(const a of adotados) {
      const li = document.createElement('li'); li.textContent = a.nomeAnimal; ul.append(li);
    }
  } catch(e) { msg('mensagemAdotados',e.message); }
}
document.addEventListener('DOMContentLoaded', () => {
  pesquisa.addEventListener('input', filterAnimals);
  filtro.addEventListener('change', filterAnimals);
  document.getElementById('formAdocao').addEventListener('submit', e => {e.preventDefault(); confirmarAdocao();});
  document.getElementById('cancelarAdocao').addEventListener('click', () => {modal.style.display='none'; document.getElementById('formAdocao').reset();});
  carregarAnimais(); carregarMinhasSolicitacoes(); carregarAdotados();
});
