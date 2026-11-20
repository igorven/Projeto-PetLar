<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
metodo('GET');
if (empty($_SESSION['usuario_id'])) responder(['logado'=>false]);
responder(['logado'=>true, 'usuario'=>['nome'=>$_SESSION['usuario_nome']]]);
