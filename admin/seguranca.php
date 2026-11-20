<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_httponly', '1');
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ini_set('session.cookie_secure', '1');
ini_set('session.cookie_samesite', 'Lax');
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
function esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function csrf_token(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(32)); }
function csrf_input(): string { return '<input type="hidden" name="csrf" value="'.esc(csrf_token()).'">'; }
function validar_csrf(): void { if (!hash_equals(csrf_token(), (string)($_POST['csrf'] ?? ''))) { http_response_code(403); exit('Requisição inválida. Atualize a página.'); } }
function redir(string $url): never { header('Location: '.$url, true, 303); exit; }
function exigir_admin(array $roles = PETLAR_ROLES): void {
    if (!isset($_SESSION['staff_id'],$_SESSION['staff_role']) || !in_array($_SESSION['staff_role'], $roles, true)) redir(rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/admin/entrar.php');
    // Revalidação em cada requisição: desativação/troca de cargo revoga privilégios.
    try {
        $q=conexao()->prepare('SELECT id,nome,cargo,ativo FROM funcionarios WHERE id=? LIMIT 1');
        $q->execute([(int)$_SESSION['staff_id']]);$user=$q->fetch();
    } catch (PDOException $e) { http_response_code(503);exit('Banco indisponível. Verifique a configuração do MySQL.'); }
    if (!$user || !(bool)$user['ativo'] || !in_array($user['cargo'], $roles, true)) {
        $_SESSION=[];session_regenerate_id(true);redir(rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/admin/entrar.php');
    }
    $_SESSION['staff_name']=$user['nome'];$_SESSION['staff_role']=$user['cargo'];
}
function flash(?string $value=null): string { if ($value!==null) {$_SESSION['flash']=$value;return '';} $s=(string)($_SESSION['flash']??'');unset($_SESSION['flash']);return $s; }
