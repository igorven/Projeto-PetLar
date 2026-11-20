<?php
declare(strict_types=1);
// Configure variáveis PETLAR_DB_HOST, PETLAR_DB_NAME, PETLAR_DB_USER, PETLAR_DB_PASSWORD no Apache/PHP.
const PETLAR_ROLES = ['gestor', 'analista', 'atendente'];
function conexao(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $host = getenv('PETLAR_DB_HOST') ?: '127.0.0.1';
    $db = getenv('PETLAR_DB_NAME') ?: 'petlar';
    $user = getenv('PETLAR_DB_USER') ?: 'root';
    $pass = getenv('PETLAR_DB_PASSWORD') ?: '';
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
