# Como publicar com senha usando GitHub

Este site precisa de um servidor Node para salvar edições, anexos e textos. Por isso, a forma segura é usar o GitHub como repositório e publicar em uma plataforma que rode Node.js, como Render, Railway, Fly.io ou VPS.

## O que já está pronto

- `server.js` usa a porta definida pela hospedagem (`PORT`).
- `server.js` aceita usuário e senha por variáveis de ambiente.
- Se `SITE_USER` e `SITE_PASS` não forem definidos, o site abre sem senha para uso local.
- Se `SITE_USER` e `SITE_PASS` forem definidos, o navegador pede login e senha antes de abrir.

## Caminho recomendado no Render

1. Crie um repositório privado no GitHub.
2. Envie a pasta `site_resultados_palhacoterapia` para esse repositório.
3. No Render, clique em `New` > `Web Service`.
4. Conecte o repositório do GitHub.
5. Configure:
   - Runtime: Node
   - Build Command: deixe vazio ou use `npm install`
   - Start Command: `npm start`
6. Em `Environment Variables`, adicione:
   - `SITE_USER`: seu usuário
   - `SITE_PASS`: sua senha forte
7. Publique o serviço e abra a URL gerada pelo Render.

## Importante

Não publique essa base em GitHub Pages público se ela tiver dados sensíveis. GitHub Pages é ótimo para páginas estáticas, mas não é ideal para senha real nem para salvar alterações no servidor. Uma senha feita só em HTML/JavaScript pode ser burlada por quem inspeciona o código.
