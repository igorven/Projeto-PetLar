<?php
require_once __DIR__ . '/seguranca.php';
if ($_SERVER['REQUEST_METHOD']==='POST') {validar_csrf();$_SESSION=[];session_destroy();redir('entrar.php');}
require_once __DIR__ . '/ui.php';exigir_admin();inicio('Sair'); ?>
<section class="auth-card"><h1>Encerrar sessão administrativa?</h1><p>Esta ação não modifica sua conta de adotante.</p><form method="post"><?= csrf_input() ?><button>Confirmar saída</button></form></section>
<?php fim(); ?>