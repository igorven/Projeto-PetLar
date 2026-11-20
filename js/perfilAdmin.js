(() => {
 const nome=document.getElementById('adminNome'),foto=document.getElementById('adminFoto'),avatar=document.getElementById('adminAvatar'),msg=document.getElementById('adminMensagem');
 const KEY='petlar_admin_demo_profile_v1';
 let perfil={nome:'Equipe PetLar',foto:''};try{perfil={...perfil,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
 nome.value=perfil.nome;
 function render(){avatar.replaceChildren();if(perfil.foto&&/^data:image\/(jpeg|png|webp);base64,/.test(perfil.foto)){const img=document.createElement('img');img.src=perfil.foto;img.alt='Foto administrativa';avatar.append(img)}else avatar.textContent='🐾'}
 render();
 foto.addEventListener('change',()=>{
  const f=foto.files[0];if(!f)return;
  if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>3*1024*1024){msg.textContent='Use JPG, PNG ou WEBP de até 3 MB.';return}
  const img=new Image(),url=URL.createObjectURL(f);
  img.onload=()=>{const c=document.createElement('canvas');const s=Math.min(1,240/Math.max(img.width,img.height));c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);perfil.foto=c.toDataURL('image/jpeg',.72);URL.revokeObjectURL(url);render();msg.textContent='Foto pronta para salvar.'};
  img.onerror=()=>{URL.revokeObjectURL(url);msg.textContent='Imagem inválida.'};img.src=url;
 });
 document.getElementById('adminRemoverFoto').onclick=()=>{perfil.foto='';foto.value='';render();msg.textContent='Salve para confirmar a remoção.'};
 document.getElementById('formPerfilAdmin').onsubmit=e=>{e.preventDefault();perfil.nome=nome.value.trim();if(perfil.nome.length<2){msg.textContent='Informe um nome válido.';return}try{localStorage.setItem(KEY,JSON.stringify(perfil));msg.textContent='Perfil administrativo demonstrativo salvo.'}catch{msg.textContent='Falha ao salvar.'}};
})();