# PetLar 2.9 — Primeira etapa do PHP + MySQL administrativo

## Executar no XAMPP
1. Extraia a pasta `petlar_v29` dentro de `C:\xampp\htdocs\` (mantenha este nome) e inicie Apache e MySQL.
2. Acesse phpMyAdmin e execute `admin/schema.sql` (importação SQL). Banco padrão `petlar`.
3. A partir de um terminal com PHP no PATH (ou `C:\xampp\php\php.exe`), na pasta do projeto, crie o primeiro gestor:
   `php admin/criar_gestor.php gestor@exemplo.test "Gestor PetLar"`
   O script solicitará uma senha de teste com pelo menos 12 caracteres.
4. Abra `http://localhost/petlar_v29/admin/entrar.php`, entre com o gestor e acesse a dashboard protegida.
5. Em **Equipe** crie funcionários com as funções gestor, analista ou atendente. Somente gestores têm permissão de administrar a equipe.
6. Em **Meu perfil** é possível editar o nome e trocar a senha.

### Configuração
`admin/config.php` lê `PETLAR_DB_HOST`, `PETLAR_DB_NAME`, `PETLAR_DB_USER`, `PETLAR_DB_PASSWORD` do ambiente. Por padrão usa 127.0.0.1, petlar, root, senha vazia (XAMPP local). NÃO use root/senha vazia em produção.

### O que agora é protegido pelo servidor
- `pages/admin.php` exige sessão administrativa e verifica conta ativa e cargo no banco a cada requisição.
- `admin/equipe.php` exige cargo `gestor`; inserção/alteração de cargo/ativação/desativação são SQL preparado e proteção CSRF.
- `admin/perfil.php` exige login, troca nome/senha com `password_hash`.
- `admin/sair.php` encerra a sessão.
- `pages/admin.html` foi removido para que não exista uma cópia pública do painel antigo.
- Login do adotante continua distinto, em `pages/login.html` (localStorage de demonstração).

### Limitações importantes
- Dashboard (animais, adoções e revisão fictícia) ainda usa localStorage; isso NÃO significa que os registros sejam autorizados ou persistidos no MySQL.
- Documentos não são armazenados ou processados, e revisão de identidade continua fictícia.
- Fotos administrativas reais ainda não são armazenadas no servidor; `admin/perfil.php` usa inicial do nome.
- Não há recuperação de senha, rate limiting de login, auditoria, API protegida para os animais/adoções ou migração de contas de adotantes. É uma etapa didática para execução local, não implementação pronta para internet.
- O script inicial de gestor pode exibir a senha no terminal; use apenas valores fictícios. Não mantenha scripts administrativos de instalação em servidores públicos, embora esse já limite execução a CLI.
