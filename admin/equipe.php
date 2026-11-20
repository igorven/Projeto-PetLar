<?php
require_once __DIR__.'/seguranca.php';require_once __DIR__.'/ui.php';exigir_admin(['gestor']);
$erro='';$roles=['gestor'=>'Gestor','analista'=>'Analista de verificações','atendente'=>'Atendente'];
if($_SERVER['REQUEST_METHOD']==='POST') {
 validar_csrf();$acao=(string)($_POST['acao']??'');$id=(int)($_POST['id']??0);
 if($acao==='criar') {
  $nome=trim((string)($_POST['nome']??''));$email=mb_strtolower(trim((string)($_POST['email']??'')));
  $cargo=(string)($_POST['cargo']??'');$senha=(string)($_POST['senha']??'');
  if(mb_strlen($nome)<3 || mb_strlen($nome)>100 || !filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>160||!isset($roles[$cargo])||strlen($senha)<12) $erro='Confira nome, e-mail, cargo e senha (mínimo 12 caracteres).';
  else try {$q=conexao()->prepare('INSERT INTO funcionarios(nome,email,cargo,senha_hash,ativo) VALUES(?,?,?,?,1)');$q->execute([$nome,$email,$cargo,password_hash($senha,PASSWORD_DEFAULT)]);flash('Funcionário criado.');redir('equipe.php');}
       catch(PDOException $e){$erro='Não foi possível cadastrar. Verifique se o e-mail já existe.';}
 } elseif($acao==='estado' && $id>0) {
   if($id===(int)$_SESSION['staff_id']) $erro='Você não pode desativar sua própria conta.';
   else { $q=conexao()->prepare('UPDATE funcionarios SET ativo=IF(ativo=1,0,1) WHERE id=?');$q->execute([$id]);flash('Status atualizado.');redir('equipe.php'); }
 } elseif($acao==='cargo' && $id>0) {
   $cargo=(string)($_POST['cargo']??'');if(!isset($roles[$cargo])) $erro='Cargo inválido.';
   elseif($id===(int)$_SESSION['staff_id']) $erro='Não é permitido alterar seu próprio cargo.';
   else {$q=conexao()->prepare('UPDATE funcionarios SET cargo=? WHERE id=?');$q->execute([$cargo,$id]);flash('Cargo atualizado.');redir('equipe.php');}
 }
}
$list=conexao()->query('SELECT id,nome,email,cargo,ativo FROM funcionarios ORDER BY nome')->fetchAll();
inicio('Gerenciamento da equipe'); ?>
<div class="eyebrow">ADMINISTRAÇÃO · GESTORES</div><h1>Equipe PetLar</h1><p>Cadastre funcionários e gerencie cargos no MySQL. Apenas gestores podem acessar esta página.</p>
<?php if($erro):?><div class="notice" role="alert"><?=esc($erro)?></div><?php endif; ?><?php if($m=flash()):?><div class="success"><?=esc($m)?></div><?php endif; ?>
<div class="two-col"><section class="card"><h2>Funcionários</h2><div class="staff-list">
<?php foreach($list as $f): ?><article class="staff-item"><div><strong><?=esc($f['nome'])?></strong><small><?=esc($f['email'])?> · <?=esc($roles[$f['cargo']])?> · <?=$f['ativo']?'Ativo':'Inativo'?></small></div><div class="staff-actions">
<form method="post"><?=csrf_input()?><input type="hidden" name="acao" value="cargo"><input type="hidden" name="id" value="<?= (int)$f['id'] ?>"><select name="cargo" aria-label="Cargo de <?=esc($f['nome'])?>" <?=$f['id']===$_SESSION['staff_id']?'disabled':''?>><?php foreach($roles as $k=>$v):?><option value="<?=esc($k)?>" <?=$f['cargo']===$k?'selected':''?>><?=esc($v)?></option><?php endforeach;?></select><button class="small" <?=$f['id']===$_SESSION['staff_id']?'disabled':''?>>Alterar cargo</button></form>
<form method="post"><?=csrf_input()?><input type="hidden" name="acao" value="estado"><input type="hidden" name="id" value="<?=(int)$f['id']?>"><button class="small muted" <?=$f['id']===$_SESSION['staff_id']?'disabled':''?>><?=$f['ativo']?'Desativar':'Reativar'?></button></form></div></article><?php endforeach; ?></div></section>
<section class="card"><h2>Novo funcionário</h2><form method="post" class="form-stack"><?=csrf_input()?><input type="hidden" name="acao" value="criar"><label>Nome completo<input name="nome" maxlength="100" required></label><label>E-mail<input name="email" type="email" maxlength="160" required></label><label>Cargo<select name="cargo" required><option value="atendente">Atendente</option><option value="analista">Analista</option><option value="gestor">Gestor</option></select></label><label>Senha provisória (mínimo 12 caracteres)<input name="senha" type="password" minlength="12" autocomplete="new-password" required></label><button>Criar conta</button></form></section></div>
<?php fim(); ?>