(() => {
 const form=document.getElementById('formEditarPerfil'), msg=document.getElementById('editMensagem');if(!form)return;
 const email=localStorage.getItem('usuarioLogado');let users=[];
 try{const v=JSON.parse(localStorage.getItem('usuario')||'[]');if(Array.isArray(v))users=v}catch{}
 const idx=users.findIndex(u=>u.email===email);
 const fields={nome:'editNome',email:'editEmail',telefone:'editTelefone',cep:'editCep',rua:'editRua',numero:'editNumero',bairro:'editBairro',cidade:'editCidade',estado:'editEstado',complemento:'editComplemento'};
 function notify(t,error=false){msg.textContent=t;msg.classList.toggle('error',error)}
 if(idx<0){form.hidden=true;notify('Você precisa entrar com uma conta de adotante para editar os dados.',true);return;}
 const user=users[idx];for(const [key,id] of Object.entries(fields))document.getElementById(id).value=user[key]||'';
 document.getElementById('editNomeLateral').textContent=user.nome||'Adotante';
 const avatar=document.getElementById('editFoto');let image=null;
 try{image=localStorage.getItem('petlar_avatar_v1:'+user.email)}catch{}
 if(image&&/^data:image\/(jpeg|png|webp);base64,/.test(image)){const img=new Image();img.alt='Foto de perfil';img.src=image;avatar.replaceChildren(img)}else{avatar.textContent=user.nome?.trim().charAt(0).toUpperCase()||'🐾'}
 const cep=document.getElementById('editCep');cep.addEventListener('input',()=>{const n=cep.value.replace(/\D/g,'').slice(0,8);cep.value=n.length>5?n.slice(0,5)+'-'+n.slice(5):n});
 form.addEventListener('submit',event=>{event.preventDefault();const nome=document.getElementById('editNome').value.trim(),telefone=document.getElementById('editTelefone').value.replace(/\D/g,'');const estado=document.getElementById('editEstado').value.trim().toUpperCase(),cepNum=cep.value.replace(/\D/g,'');
 if(nome.length<3){notify('Informe um nome de pelo menos 3 caracteres.',true);return}
 if(telefone.length<10||telefone.length>11){notify('Informe um telefone com DDD (10 ou 11 dígitos).',true);return}
 if(cepNum&&cepNum.length!==8){notify('O CEP deve ter 8 dígitos.',true);return}
 if(estado&&!/^[A-Z]{2}$/.test(estado)){notify('Informe uma UF válida com 2 letras.',true);return}
 for(const [key,id] of Object.entries(fields))if(key!=='email')user[key]=document.getElementById(id).value.trim();user.estado=estado;
 try{localStorage.setItem('usuario',JSON.stringify(users));document.getElementById('editNomeLateral').textContent=nome;window.dispatchEvent(new Event('petlar:auth'));notify('Alterações salvas! Seu perfil foi atualizado neste navegador.');}catch{notify('Não foi possível salvar. Verifique o espaço disponível no navegador.',true)}
 });
})();