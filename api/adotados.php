<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
metodo('GET');
try {
    $s = db()->query("SELECT idAnimal,nomeAnimal FROM animal WHERE statusAnimal='adotado' ORDER BY nomeAnimal");
    responder(['animais'=>$s->fetchAll()]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(['erro'=>'Falha ao consultar adoções.'], 500);
}
