<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
metodo('POST');
verificarOrigem();
$_SESSION = [];
session_destroy();
responder(['mensagem'=>'Sessão encerrada.']);
