// Identidade visual de demonstração. Nunca usar como autenticação/autorização.
(() => {
  const KEY_PREFIX = 'petlar_avatar_v1:';
  function usuarioAtual() {
    const email = localStorage.getItem('usuarioLogado');
    if (!email) return null;
    try {
      const lista=JSON.parse(localStorage.getItem('usuario')||'[]');
      return Array.isArray(lista)?lista.find(u=>u.email===email)||null:null;
    } catch { return null; }
  }
  function criarAvatar(usuario, classe='user-chip-avatar') {
    const avatar=document.createElement('span');avatar.className=classe;
    const foto=usuario?localStorage.getItem(KEY_PREFIX+usuario.email):null;
    if (foto && /^data:image\/(jpeg|png|webp);base64,/.test(foto)) {
      const img=document.createElement('img');img.src=foto;img.alt='Foto de perfil';avatar.append(img);
    } else {
      avatar.textContent=usuario?.nome?.trim().charAt(0).toUpperCase()||'🐾';
    }
    return avatar;
  }
  function atualizarIdentidade(){
    const usuario=usuarioAtual();
    document.querySelectorAll('.user-identity-chip').forEach(el=>el.remove());
    const nav=document.getElementById('usuarioLogado');
    if(nav) {
      nav.textContent=usuario?.nome?.split(' ')[0]||'Visitante';
      if(usuario){const chip=document.createElement('a');chip.href=location.pathname.includes('/pages/')?'perfil.html':'pages/perfil.html';chip.className='user-identity-chip';chip.append(criarAvatar(usuario));const nome=document.createElement('span');nome.textContent=usuario.nome;chip.append(nome);nav.hidden=true;nav.after(chip);}else{nav.hidden=false;}
    }
    const admin=document.querySelector('.topbar');
    if(admin){const chip=document.createElement(usuario?'a':'div');chip.className='user-identity-chip admin-user-chip';if(usuario)chip.href='perfil.html';chip.append(criarAvatar(usuario));const copy=document.createElement('span');copy.textContent=usuario?.nome||'Visitante';chip.append(copy);admin.append(chip);}
    const avatarTopo=document.getElementById('avatarTopo');const initials=document.getElementById('avatarIniciais');
    if(avatarTopo && initials){const foto=usuario?localStorage.getItem(KEY_PREFIX+usuario.email):null;
      if(foto && /^data:image\/(jpeg|png|webp);base64,/.test(foto)){avatarTopo.src=foto;avatarTopo.hidden=false;initials.hidden=true;}
      else{avatarTopo.removeAttribute('src');avatarTopo.hidden=true;initials.hidden=false;initials.textContent=usuario?.nome?.trim().charAt(0).toUpperCase()||'🐾';}}
    const heading=document.querySelector('.profile-hero-copy h1');if(heading)heading.textContent=usuario?`Olá, ${usuario.nome.split(' ')[0]}!`:'Seu espaço no PetLar';
  }
  window.PetlarIdentidade={atualizar:atualizarIdentidade,usuarioAtual,KEY_PREFIX};
  document.addEventListener('DOMContentLoaded',atualizarIdentidade);
  window.addEventListener('storage',atualizarIdentidade);
  window.addEventListener('petlar:auth',atualizarIdentidade);
  window.addEventListener('petlar:avatar',atualizarIdentidade);
})();
