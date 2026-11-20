const lista = document.getElementById('listaAdotados');
const mensagem = document.getElementById('mensagemAdotados');
let usuarios = [];
try { usuarios = JSON.parse(localStorage.getItem('usuario') || '[]'); } catch { usuarios = []; }
const aprovadas = (Array.isArray(usuarios) ? usuarios : []).flatMap(u => (u.adocoes || []).filter(a => a.status === 'aprovada').map(a => ({ animal: a.nome, adotante: u.nome })));
mensagem.textContent = aprovadas.length ? '' : 'Nenhuma adoção concluída ainda.';
aprovadas.forEach(a => { const li = document.createElement('li'); li.textContent = `${a.animal} — adotado(a) por ${a.adotante}`; lista.appendChild(li); });
