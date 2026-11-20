<?php
function inicio(string $title): void { ?>
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?= esc($title) ?> | PetLar</title><link rel="stylesheet" href="../css/admin-acesso.css"></head><body><header class="app-header"><a href="../index.html" class="brand">🐾 PetLar</a><nav><a href="../pages/admin.php">Painel</a><a href="equipe.php">Equipe</a><a href="perfil.php">Meu perfil</a><a href="sair.php">Sair</a></nav></header><main class="wrap">
<?php }
function fim(): void { echo '</main></body></html>'; }
