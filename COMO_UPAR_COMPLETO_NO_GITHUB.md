# Como subir esta versão completa no GitHub Pages

1. No Supabase, execute `supabase_schema.sql` no SQL Editor.
2. Depois execute `supabase_seed.sql` para carregar os 95 formulários, textos e evidências.
3. Em Authentication > Users, crie o usuário que poderá acessar o painel.
4. No arquivo `supabase_schema.sql`, troque `SEU_EMAIL_AQUI` pelo seu e-mail real antes de executar, ou insira seu e-mail depois na tabela `pic_allowed_users`.
5. Em `supabase-config.js`, cole:
   - a Project URL do Supabase;
   - a anon public key;
   - o e-mail autorizado em `allowedEmails`.
6. No GitHub, entre no repositório e clique em `Add file` > `Upload files`.
7. Envie todos os arquivos desta pasta. Não precisa enviar `.nojekyll`.
8. Clique em `Commit changes`.
9. Vá em `Settings` > `Pages`.
10. Em `Build and deployment`, escolha `Deploy from a branch`.
11. Em `Branch`, selecione `main` e `/root`, depois clique em `Save`.

Observação: as credenciais do Supabase que ficam no site são públicas por natureza. A proteção vem do login, dos usuários criados no Supabase e das regras RLS das tabelas.
