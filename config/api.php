<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
ini_set('display_errors', '0');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start([
        'use_strict_mode' => true,
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
}
require_once __DIR__ . '/db.php';

function responder(array $dados, int $status = 200): never {
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function corpo(): array {
    $conteudo = json_decode(file_get_contents('php://input'), true);
    if (!is_array($conteudo)) responder(['erro' => 'JSON inválido.'], 400);
    return $conteudo;
}
function metodo(string $esperado): void {
    if ($_SERVER['REQUEST_METHOD'] !== $esperado) responder(['erro' => 'Método não permitido.'], 405);
}
function usuarioId(): int {
    if (empty($_SESSION['usuario_id'])) responder(['erro' => 'Faça login para continuar.'], 401);
    return (int) $_SESSION['usuario_id'];
}
function verificarOrigem(): void {
    // Requisições que modificam dados devem vir da mesma origem.
    $origem = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origem !== '') {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $parts = parse_url($origem);
        $origemHost = ($parts['host'] ?? '') . (isset($parts['port']) ? ':' . $parts['port'] : '');
        if ($origemHost !== $host) responder(['erro' => 'Origem não permitida.'], 403);
    }
}
