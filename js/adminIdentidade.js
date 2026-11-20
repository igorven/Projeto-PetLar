document.addEventListener('DOMContentLoaded',()=>{
 const top=document.querySelector('.topbar');if(!top)return;
 let p={nome:'Equipe PetLar',foto:''};try{p={...p,...JSON.parse(localStorage.getItem('petlar_admin_demo_profile_v1')||'{}')}}catch{}
 const a=document.createElement('a');a.href='perfil-admin.html';a.className='user-identity-chip admin-user-chip';
 const avatar=document.createElement('span');avatar.className='user-chip-avatar';
 if(p.foto&&/^data:image\/(jpeg|png|webp);base64,/.test(p.foto)){const img=document.createElement('img');img.src=p.foto;img.alt='Foto administrativa';avatar.append(img)}else avatar.textContent='🐾';
 const nome=document.createElement('span');nome.textContent=p.nome;a.append(avatar,nome);top.append(a);
});