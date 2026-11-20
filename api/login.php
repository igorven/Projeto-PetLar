<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
metodo('POST');
verificarOrigem();
$d = corpo();
$email = trim((string)($d['email'] ?? ''));
$senha = (string)($d['senha'] ?? '');
if ($email === '' || $senha === '') responder(['erro'=>'Informe e-mail e senha.'], 422);
try {
    $s = db()->prepare('SELECT idUsuario,nome,senhaHash FROM usuario WHERE email = ? LIMIT 1');
    $s->execute([$email]);
    $u = $s->fetch();
    if (!$u || !password_verify($senha, $u['senhaHash'])) responder(['erro'=>'E-mail ou senha incorretos.'], 401);
    session_regenerate_id(true);
    $_SESSION['usuario_id'] = (int)$u['idUsuario'];
    $_SESSION['usuario_nome'] = $u['nome'];
    responder(['mensagem'=>'Login realizado!', 'usuario'=>['nome'=>$u['nome']]]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(['erro'=>'Falha ao entrar.'], 500);
}
