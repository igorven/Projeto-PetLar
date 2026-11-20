// Somente o avatar reduzido persiste localmente. Documentos NÃO são salvos.
(() => {
 const form=document.getElementById('formVerificacao');if(!form)return;
 const $=id=>document.getElementById(id);
 const photo=$('fotoPerfil'),preview=$('previewFoto'),feedback=$('resultadoVerificacao');
 let previewUrl=null;
 const mostrar=(input,id)=>{const file=input.files?.[0];$(id).textContent=file?`${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`:'Nenhum arquivo selecionado';};
 function validar(input){const f=input.files?.[0];if(!f)return true;
 const tipos=input===photo?['image/jpeg','image/png','image/webp']:['image/jpeg','image/png','application/pdf'];
 if(!tipos.includes(f.type)||f.size>5*1024*1024){input.value='';feedback.textContent='Arquivo inválido. Use o formato permitido e no máximo 5 MB.';return false;}return true;}
 const usuario=()=>window.PetlarIdentidade?.usuarioAtual();
 async function salvarAvatar(file){
   const u=usuario();if(!u){feedback.textContent='Entre com uma conta fictícia antes de selecionar uma foto.';return;}
   const bmp=await createImageBitmap(file);
   const limite=192,escala=Math.min(1,limite/Math.max(bmp.width,bmp.height));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bmp.width*escala));canvas.height=Math.max(1,Math.round(bmp.height*escala));
   canvas.getContext('2d').drawImage(bmp,0,0,canvas.width,canvas.height);bmp.close();
   try {localStorage.setItem(window.PetlarIdentidade.KEY_PREFIX+u.email,canvas.toDataURL('image/jpeg',0.76));
     window.dispatchEvent(new Event('petlar:avatar'));feedback.textContent='Avatar de teste atualizado! Ele aparecerá no perfil e na dashboard.';
   }catch{feedback.textContent='Não foi possível guardar a foto neste navegador.';}
 }
 photo.addEventListener('change',async()=>{
   if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;preview.hidden=true;
   if(!validar(photo)){mostrar(photo,'nomeFoto');return;}mostrar(photo,'nomeFoto');
   if(photo.files?.[0]){previewUrl=URL.createObjectURL(photo.files[0]);preview.src=previewUrl;preview.hidden=false;
     try{await salvarAvatar(photo.files[0]);}catch{feedback.textContent='Não foi possível processar essa imagem.';}}
 });
 [['docIdentidade','nomeDocumento'],['comprovante','nomeComprovante']].forEach(([id,target])=>$(id).addEventListener('change',()=>{validar($(id));mostrar($(id),target)}));
 form.addEventListener('submit',e=>{e.preventDefault();if(!usuario()){feedback.textContent='Faça login com uma conta fictícia para continuar.';return;}
 if(!photo.files?.length||!$('docIdentidade').files?.length){feedback.textContent='Selecione uma foto e um documento fictício para testar.';return;}
 const u=usuario();const key='petlar_verificacoes_demo_v1';let queue=[];
 try{const v=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(v))queue=v}catch{}
 const existing=queue.find(q=>q.email===u.email&&q.status==='pendente');
 if(existing){feedback.textContent='Já existe uma solicitação fictícia pendente. Nenhum documento foi armazenado.';return}
 queue.push({id:'v'+Date.now(),email:u.email,nome:u.nome,status:'pendente',criadoEm:new Date().toISOString(),observacao:'',documentosArmazenados:false});
 try{localStorage.setItem(key,JSON.stringify(queue));feedback.textContent='Solicitação fictícia registrada para testes de interface. Os arquivos NÃO foram enviados ou salvos e sua identidade NÃO está verificada.';}
 catch{feedback.textContent='Não foi possível registrar a solicitação de teste no navegador.';}});
 const remove=document.createElement('button');remove.type='button';remove.className='verify-remove';remove.textContent='Remover foto salva';
 remove.addEventListener('click',()=>{const u=usuario();if(!u)return;localStorage.removeItem(window.PetlarIdentidade.KEY_PREFIX+u.email);
 photo.value='';preview.hidden=true;preview.removeAttribute('src');$('nomeFoto').textContent='Nenhum arquivo selecionado';window.dispatchEvent(new Event('petlar:avatar'));feedback.textContent='Foto de demonstração removida.';});
 form.append(remove);
 window.addEventListener('pagehide',()=>{if(previewUrl)URL.revokeObjectURL(previewUrl)});
})();
