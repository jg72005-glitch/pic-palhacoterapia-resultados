# Passo a passo do login com Supabase

1. Crie um projeto no Supabase.
2. Abra `supabase_schema.sql` e troque `SEU_EMAIL_AQUI` pelo seu e-mail.
3. Abra `SQL Editor` e rode `supabase_schema.sql`.
4. Rode `supabase_seed.sql`.
5. Vá em `Authentication` > `Users` > `Add user`.
6. Crie seu e-mail e senha.
7. Abra `Project Settings` > `API`.
8. Copie `Project URL` para `url` em `supabase-config.js`.
9. Copie `anon public` para `anonKey` em `supabase-config.js`.
10. Em `allowedEmails`, deixe apenas os e-mails que podem entrar.
11. Suba os arquivos no GitHub Pages.

Se quiser que ninguém consiga se cadastrar sozinho, deixe o cadastro público desativado no Supabase e crie os usuários manualmente.
