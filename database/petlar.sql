CREATE DATABASE IF NOT EXISTS petlar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petlar;

CREATE TABLE IF NOT EXISTS usuario (
 idUsuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 cpf CHAR(11) NOT NULL UNIQUE,
 cep CHAR(8) NOT NULL,
 rua VARCHAR(120) NOT NULL,
 bairro VARCHAR(100) NOT NULL,
 cidade VARCHAR(100) NOT NULL,
 estado CHAR(2) NOT NULL,
 complemento VARCHAR(100) DEFAULT NULL,
 numero VARCHAR(15) NOT NULL,
 telefone VARCHAR(20) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 senhaHash VARCHAR(255) NOT NULL,
 criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS funcionario (
 idFuncionario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nomeFuncionario VARCHAR(100) NOT NULL,
 cargoFuncionario VARCHAR(50) NOT NULL,
 senha VARCHAR(255) NOT NULL COMMENT 'Armazenar SOMENTE hash gerado por password_hash',
 cpfFuncionario CHAR(11) NOT NULL UNIQUE,
 contatoTelFuncionario VARCHAR(20) DEFAULT NULL,
 contatoEmailFuncionario VARCHAR(100) NOT NULL UNIQUE,
 statusFuncionario VARCHAR(20) NOT NULL DEFAULT 'ativo'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS animal (
 idAnimal INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nomeAnimal VARCHAR(50) NOT NULL,
 sexoAnimal VARCHAR(20) DEFAULT NULL,
 racaAnimal VARCHAR(50) DEFAULT NULL,
 idadeAnimal INT UNSIGNED DEFAULT NULL,
 pesoAnimal DECIMAL(5,2) DEFAULT NULL,
 statusAnimal ENUM('disponivel','adotado','indisponivel') NOT NULL DEFAULT 'disponivel',
 emocaoDestaque VARCHAR(50) DEFAULT NULL,
 corAnimal VARCHAR(30) DEFAULT NULL,
 descricaoAnimal TEXT DEFAULT NULL,
 categoria VARCHAR(20) NOT NULL,
 fotoUrl VARCHAR(500) DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS solicitacaoAdocao (
 idSolicitacao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 idUsuario INT UNSIGNED NOT NULL,
 idAnimal INT UNSIGNED NOT NULL,
 motivo TEXT NOT NULL,
 telefoneContato VARCHAR(20) NOT NULL,
 statusSolicitacao ENUM('pendente','aprovada','recusada') NOT NULL DEFAULT 'pendente',
 dataSolicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_usuario_animal (idUsuario, idAnimal),
 CONSTRAINT fk_solicitacao_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
 CONSTRAINT fk_solicitacao_animal FOREIGN KEY (idAnimal) REFERENCES animal(idAnimal)
) ENGINE=InnoDB;

INSERT INTO animal (nomeAnimal,idadeAnimal,categoria,descricaoAnimal,fotoUrl) VALUES
('Thor',2,'cachorro','Porte médio • Vacinado','https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600'),
('Mel',3,'cachorro','Porte pequeno • Dócil','https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600'),
('Max',4,'cachorro','Porte grande • Vacinado','https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600'),
('Rex',2,'cachorro','Muito brincalhão','https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=600'),
('Luna',1,'gato','Castrada • Carinhosa','https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600'),
('Mimi',2,'gato','Brincalhona • Vacinada','https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600'),
('Snow',1,'gato','Castrado','https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600'),
('Bolinha',1,'outro','Coelho','https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600'),
('Kiwi',1,'outro','Ave','https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600');
