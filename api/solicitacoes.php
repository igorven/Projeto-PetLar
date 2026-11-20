<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
$idUsuario = usuarioId();
try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $s = db()->prepare('SELECT s.idSolicitacao, a.nomeAnimal, s.statusSolicitacao, DATE_FORMAT(s.dataSolicitacao, "%d/%m/%Y") AS dataSolicitacao FROM solicitacaoAdocao s JOIN animal a ON a.idAnimal=s.idAnimal WHERE s.idUsuario=? ORDER BY s.dataSolicitacao DESC');
        $s->execute([$idUsuario]);
        responder(['solicitacoes'=>$s->fetchAll()]);
    }
    metodo('POST');
    verificarOrigem();
    $d = corpo();
    $animalId = filter_var($d['idAnimal'] ?? null, FILTER_VALIDATE_INT);
    $motivo = trim((string)($d['motivo'] ?? ''));
    $telefone = trim((string)($d['telefone'] ?? ''));
    if (!$animalId || mb_strlen($motivo) < 10 || $telefone === '') {
        responder(['erro'=>'Informe o animal, telefone e motivo (mínimo 10 caracteres).'], 422);
    }
    $pdo = db();
    $pdo->beginTransaction();
    $s = $pdo->prepare('SELECT statusAnimal FROM animal WHERE idAnimal=? FOR UPDATE');
    $s->execute([$animalId]);
    $animal = $s->fetch();
    if (!$animal || $animal['statusAnimal'] !== 'disponivel') {
        $pdo->rollBack();
        responder(['erro'=>'Animal indisponível.'], 409);
    }
    $s = $pdo->prepare('INSERT INTO solicitacaoAdocao (idUsuario,idAnimal,motivo,telefoneContato) VALUES (?,?,?,?)');
    $s->execute([$idUsuario,$animalId,$motivo,$telefone]);
    $pdo->commit();
    responder(['mensagem'=>'Solicitação enviada! Aguarde a avaliação da equipe.'], 201);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    if ($e->getCode() === '23000') responder(['erro'=>'Você já solicitou esse animal.'], 409);
    error_log($e->getMessage());
    responder(['erro'=>'Falha ao processar solicitação.'], 500);
}
