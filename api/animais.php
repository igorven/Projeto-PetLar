<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
metodo('GET');
try {
    $s = db()->query('SELECT idAnimal,nomeAnimal,idadeAnimal,categoria,descricaoAnimal,fotoUrl,statusAnimal FROM animal ORDER BY idAnimal');
    responder(['animais'=>$s->fetchAll()]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(['erro'=>'Falha ao consultar animais.'], 500);
}
