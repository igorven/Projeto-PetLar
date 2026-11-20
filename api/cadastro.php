<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/api.php';
metodo('POST');
verificarOrigem();
$d = corpo();
$campos = ['nome','cpf','cep','rua','bairro','cidade','estado','numero','telefone','email','senha'];
foreach ($campos as $campo) {
    if (!isset($d[$campo]) || !is_string($d[$campo]) || trim($d[$campo]) === '') {
        responder(['erro' => "Preencha o campo: $campo."], 422);
    }
}
$cpf = preg_replace('/\D/', '', $d['cpf']);
$cep = preg_replace('/\D/', '', $d['cep']);
$email = mb_strtolower(trim($d['email']));
if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) responder(['erro' => 'CPF inválido.'], 422);
function cpfValido(string $cpf): bool {
    for ($t = 9; $t < 11; $t++) {
        $soma = 0;
        for ($i = 0; $i < $t; $i++) $soma += (int) $cpf[$i] * ($t + 1 - $i);
        $digito = ((10 * $soma) % 11) % 10;
        if ((int) $cpf[$t] !== $digito) return false;
    }
    return true;
}
if (!cpfValido($cpf) || strlen($cep) !== 8 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($d['senha']) < 8) {
    responder(['erro' => 'CPF, CEP, e-mail ou senha inválidos (mínimo de 8 caracteres).'], 422);
}
if (!preg_match('/^[A-Za-z]{2}$/', $d['estado'])) responder(['erro' => 'Estado inválido.'], 422);
try {
    $sql = 'INSERT INTO usuario (nome,cpf,cep,rua,bairro,cidade,estado,complemento,numero,telefone,email,senhaHash)
            VALUES (:nome,:cpf,:cep,:rua,:bairro,:cidade,:estado,:complemento,:numero,:telefone,:email,:senhaHash)';
    $s = db()->prepare($sql);
    $s->execute([
        'nome'=>trim($d['nome']), 'cpf'=>$cpf, 'cep'=>$cep,
        'rua'=>trim($d['rua']), 'bairro'=>trim($d['bairro']), 'cidade'=>trim($d['cidade']),
        'estado'=>strtoupper($d['estado']), 'complemento'=>trim((string)($d['complemento']??'')) ?: null,
        'numero'=>trim($d['numero']), 'telefone'=>trim($d['telefone']),
        'email'=>$email, 'senhaHash'=>password_hash($d['senha'], PASSWORD_DEFAULT)
    ]);
    responder(['mensagem'=>'Cadastro realizado com sucesso!'], 201);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') responder(['erro'=>'CPF ou e-mail já cadastrado.'], 409);
    error_log($e->getMessage());
    responder(['erro'=>'Falha ao cadastrar.'], 500);
}
