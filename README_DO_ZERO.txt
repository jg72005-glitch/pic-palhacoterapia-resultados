PACOTE DO ZERO - PIC PALHAÇOTERAPIA

1) NO SUPABASE

A) Abra SQL Editor > New query.
B) Copie TODO o conteúdo de supabase_schema.sql e clique em Run.
C) Abra outro New query.
D) Copie TODO o conteúdo de supabase_seed.sql e clique em Run.
E) Vá em Authentication > Users > Add user.
F) Crie o usuário com este e-mail:
   jg72005@gmail.com
G) Defina a senha que você quer usar para entrar no site.

2) NO GITHUB

A) Crie um repositório novo.
B) Clique em Add file > Upload files.
C) Envie somente estes arquivos:
   - index.html
   - supabase-config.js
   - supabase_schema.sql
   - supabase_seed.sql
   - README_DO_ZERO.txt
D) Clique em Commit changes.
E) Vá em Settings > Pages.
F) Em Build and deployment, escolha Deploy from a branch.
G) Em Branch, escolha main e /root.
H) Clique em Save.

3) SE DER ERRO NO LOGIN

Confira se o arquivo supabase-config.js está exatamente assim:

window.PIC_SUPABASE_CONFIG = {
  enabled: true,
  url: "https://flydaodpjklyumfkjqgt.supabase.co",
  anonKey: "sb_publishable_kvy0TodNlAFZelydXir3Mw_hfNADNEq",
  dataMode: "supabase",
  allowedEmails: [
    "jg72005@gmail.com"
  ]
};

ATENÇÃO: a URL NÃO pode terminar com /rest/v1/.
Ela precisa ser exatamente:
https://flydaodpjklyumfkjqgt.supabase.co
