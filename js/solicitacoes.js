const ul = document.getElementById('listaQueroAdotar');
const msg = document.getElementById('mensagemQuero');
const email = localStorage.getItem('usuarioLogado');
let usuarios = [];
try { usuarios = JSON.parse(localStorage.getItem('usuario') || '[]'); } catch { usuarios = []; }
const usuario = Array.isArray(usuarios) ? usuarios.find(u => u.email === email) : null;
if (!usuario) { msg.textContent = 'Faça login para acompanhar suas solicitações.'; }
else if (!(usuario.adocoes || []).length) { msg.textContent = 'Você ainda não enviou solicitações.'; }
else {
    msg.textContent = '';
    usuario.adocoes.forEach(adocao => {
        const li = document.createElement('li');
        li.textContent = `${adocao.nome} — ${adocao.status || 'pendente'} (${adocao.data})`;
        ul.appendChild(li);
    });
}
