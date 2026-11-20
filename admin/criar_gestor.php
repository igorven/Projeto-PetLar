<?php
// Execução SOMENTE CLI: php admin/criar_gestor.php email@exemplo.com "Nome Gestor"
require_once __DIR__.'/config.php';
if (PHP_SAPI !== 'cli') {http_response_code(404);exit;}
$email=$argv[1]??'';$nome=trim($argv[2]??'');
if(!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>160||mb_strlen($nome)<3||mb_strlen($nome)>100){fwrite(STDERR,"Uso: php admin/criar_gestor.php email@exemplo.com 'Nome Gestor'\n");exit(1);}
fwrite(STDOUT,"Senha do gestor (mínimo 12 caracteres, digitada visivelmente): ");$senha=trim((string)fgets(STDIN));
if(strlen($senha)<12){fwrite(STDERR,"Senha muito curta.\n");exit(1);}
try{$q=conexao()->prepare("INSERT INTO funcionarios (nome,email,cargo,senha_hash) VALUES (?,?,'gestor',?)");$q->execute([$nome,mb_strtolower($email),password_hash($senha,PASSWORD_DEFAULT)]);echo "Gestor cadastrado.\n";}
catch(PDOException $e){fwrite(STDERR,"Falha: confira banco ou e-mail duplicado.\n");exit(1);}
