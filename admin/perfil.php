<?php
require_once __DIR__.'/seguranca.php';require_once __DIR__.'/ui.php';exigir_admin();
$id=(int)$_SESSION['staff_id'];$erro='';
$q=conexao()->prepare('SELECT id,nome,email,cargo FROM funcionarios WHERE id=?');$q->execute([$id]);$p=$q->fetch();
if($_SERVER['REQUEST_METHOD']==='POST') {
 validar_csrf();$nome=trim((string)($_POST['nome']??''));$nova=(string)($_POST['nova_senha']??'');
 if(mb_strlen($nome)<3 || mb_strlen($nome)>100) $erro='Nome deve ter de 3 a 100 caracteres.';
 elseif($nova!=='' && strlen($nova)<12) $erro='A nova senha precisa ter pelo menos 12 caracteres.';
 else {
  if($nova!=='') {$sql=conexao()->prepare('UPDATE funcionarios SET nome=?,senha_hash=? WHERE id=?');$sql->execute([$nome,password_hash($nova,PASSWORD_DEFAULT),$id]);}
  else {$sql=conexao()->prepare('UPDATE funcionarios SET nome=? WHERE id=?');$sql->execute([$nome,$id]);}
  flash('Perfil atualizado com sucesso.');redir('perfil.php');
 }
}
inicio('Meu perfil administrativo'); ?>
<div class="eyebrow">CONTA ADMINISTRATIVA</div><h1>Meu perfil</h1><p>Identidade independente da conta de adotante.</p>
<?php if($erro):?><div class="notice"><?=esc($erro)?></div><?php endif; ?><?php if($m=flash()):?><div class="success"><?=esc($m)?></div><?php endif; ?>
<section class="card"><div class="avatar"><?=esc(mb_strtoupper(mb_substr($p['nome'],0,1)))?></div><form method="post" class="form-stack"><?=csrf_input()?><label>Nome de exibição<input name="nome" value="<?=esc($p['nome'])?>" maxlength="100" required></label><label>E-mail<input value="<?=esc($p['email'])?>" disabled></label><label>Cargo<input value="<?=esc(ucfirst($p['cargo']))?>" disabled></label><label>Nova senha (opcional, mínimo 12 caracteres)<input name="nova_senha" type="password" autocomplete="new-password" minlength="12"></label><button>Salvar alterações</button></form><p class="hint">Foto administrativa ainda não é armazenada no servidor. O avatar utiliza a inicial do nome.</p></section>
<?php fim(); ?>