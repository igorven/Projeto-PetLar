<?php
require_once __DIR__ . '/seguranca.php'; require_once __DIR__ . '/ui.php';
if (isset($_SESSION['staff_id'])) redir('../pages/admin.php');
$erro='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    validar_csrf();$email=mb_strtolower(trim((string)($_POST['email']??'')));
    $senha=(string)($_POST['senha']??'');
    if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($senha)>1000) $erro='Credenciais inválidas.';
    else {
        try {$q=conexao()->prepare('SELECT id,nome,cargo,senha_hash,ativo FROM funcionarios WHERE email=? LIMIT 1');$q->execute([$email]);$p=$q->fetch();}
        catch (PDOException $ex) {$p=false;$erro='Banco indisponível ou não inicializado.';}
        if (!$erro) {
            if ($p && (int)$p['ativo']===1 && password_verify($senha,$p['senha_hash'])) {
                session_regenerate_id(true);
                $_SESSION['staff_id']=(int)$p['id'];$_SESSION['staff_name']=$p['nome'];$_SESSION['staff_role']=$p['cargo'];
                redir('../pages/admin.php');
            }
            $erro='Credenciais inválidas.';
        }
    }
}
inicio('Acesso da equipe'); ?>
<section class="auth-card"><div class="eyebrow">ÁREA EXCLUSIVA DA EQUIPE</div><h1>Entrar no administrativo</h1><p>Use uma conta de funcionário cadastrada no banco. Este login é independente do acesso dos adotantes.</p>
<?php if($erro): ?><div class="notice" role="alert"><?= esc($erro) ?></div><?php endif; ?>
<form method="post" class="form-stack"><?= csrf_input() ?><label>E-mail corporativo<input type="email" name="email" maxlength="160" autocomplete="username" required></label><label>Senha<input type="password" name="senha" autocomplete="current-password" required></label><button>Entrar com segurança</button></form><p class="hint">O primeiro gestor é criado pelo script de instalação no terminal.</p><a href="../pages/login.html">Sou adotante</a></section>
<?php fim(); ?>