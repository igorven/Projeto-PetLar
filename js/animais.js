// Etapa visual: dados continuam no localStorage. O PHP assumirá essas operações depois.
const cards = [...document.querySelectorAll('.card')];
const pesquisa = document.getElementById('pesquisa');
const filtro = document.getElementById('filtro');
const filtroRaca = document.getElementById('filtroRaca');
const modal = document.getElementById('modalAdocao');
const mensagem = (id, texto) => { const el = document.getElementById(id); if (el) el.textContent = texto; };
const usuariosSalvos = () => { try { const lista = JSON.parse(localStorage.getItem('usuario') || '[]'); return Array.isArray(lista) ? lista : []; } catch { return []; } };
const nomeUsuario = () => localStorage.getItem('usuarioLogado');
const solicitacoes = () => usuariosSalvos().flatMap(u => u.adocoes || []);
function filtrarAnimais() {
    const termo = pesquisa.value.trim().toLocaleLowerCase('pt-BR');
    const categoria = filtro.value;
    const aprovados = solicitacoes().filter(a => a.status === 'aprovada').map(a => a.nome);
    cards.forEach(card => {
        const nome = card.querySelector('h3').textContent;
        const corresponde = (nome + ' ' + card.dataset.especie + ' ' + card.dataset.raca).toLocaleLowerCase('pt-BR').includes(termo) && (categoria === 'todos' || card.classList.contains(categoria)) && (!filtroRaca || filtroRaca.value === 'todas' || card.dataset.raca === filtroRaca.value);
        card.hidden = !corresponde || aprovados.includes(nome);
    });
    const total = cards.filter(card => !card.hidden).length;
    const contador = document.getElementById('contadorAnimais');
    const vazio = document.getElementById('semResultados');
    if (contador) contador.textContent = `${total} ${total === 1 ? 'animal encontrado' : 'animais encontrados'}`;
    if (vazio) vazio.hidden = total > 0;
}
function abrirModal(nomeAnimal) {
    const email = nomeUsuario();
    const usuario = usuariosSalvos().find(u => u.email === email);
    if (!usuario) { mensagem('mensagemQuero', 'Faça login para solicitar uma adoção.'); return; }
    if (solicitacoes().some(a => a.nome === nomeAnimal && a.status !== 'recusada')) {
        mensagem('mensagemQuero', 'Já existe uma solicitação para esse animal.'); return;
    }
    document.getElementById('animalSelecionado').value = nomeAnimal;
    document.getElementById('nomeAdotante').value = usuario.nome;
    document.getElementById('emailAdotante').value = usuario.email;
    document.getElementById('telefoneAdotante').value = usuario.telefone || '';
    mensagem('mensagemAdocao', '');
    modal.style.display = 'flex';
}
function enviarSolicitacao(event) {
    event.preventDefault();
    const usuarios = usuariosSalvos();
    const usuario = usuarios.find(u => u.email === nomeUsuario());
    if (!usuario) { mensagem('mensagemAdocao','Faça login novamente.'); return; }
    const nome = document.getElementById('animalSelecionado').value;
    const motivo = document.getElementById('motivo').value.trim();
    const telefone = document.getElementById('telefoneAdotante').value.trim();
    if (!motivo || !telefone) { mensagem('mensagemAdocao','Preencha o motivo e o telefone.'); return; }
    if (usuarios.some(u => (u.adocoes || []).some(a => a.nome === nome && a.status !== 'recusada'))) {
        mensagem('mensagemAdocao','Este animal já possui uma solicitação ativa.'); return;
    }
    usuario.adocoes ??= [];
    usuario.adocoes.push({ nome, motivo, telefone, data: new Date().toLocaleDateString('pt-BR'), status: 'pendente' });
    localStorage.setItem('usuario', JSON.stringify(usuarios));
    window.location.href = 'quero-adotar.html';
}
pesquisa.addEventListener('input', filtrarAnimais);
function atualizarOpcoesRacas() {
  if (!filtroRaca) return;
  const selecionada=filtroRaca.value;
  const racas=[...new Set(cards.filter(c => filtro.value==='todos' || c.classList.contains(filtro.value)).map(c => c.dataset.raca || 'Não informada'))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  filtroRaca.replaceChildren(new Option('Todas as raças','todas'), ...racas.map(r=>new Option(r,r)));
  filtroRaca.value=racas.includes(selecionada) ? selecionada : 'todas';
}
filtro.addEventListener('change', ()=>{atualizarOpcoesRacas();filtrarAnimais();});
filtroRaca?.addEventListener('change', filtrarAnimais);
cards.forEach(card => card.querySelector('.btn-adotar').addEventListener('click', () => abrirModal(card.querySelector('h3').textContent)));
document.getElementById('formAdocao').addEventListener('submit', enviarSolicitacao);
document.getElementById('cancelarAdocao').addEventListener('click', () => { modal.style.display = 'none'; document.getElementById('formAdocao').reset(); });
atualizarOpcoesRacas();
filtrarAnimais();

const rotulos = { cachorro: 'CACHORRO', gato: 'GATO', outro: 'OUTROS' };
cards.forEach(card => { const categoria = Object.keys(rotulos).find(tipo => card.classList.contains(tipo)); const info = card.querySelector('.info'); const titulo = info?.querySelector('h3'); if (categoria && titulo) { const tag = document.createElement('span'); tag.className = 'pet-tag'; tag.textContent = rotulos[categoria]; info.insertBefore(tag, titulo); } });
