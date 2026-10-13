# Publicar o independente.mente no GitHub Pages

## Passo 1 — Criar repositório

1. Entra em https://github.com/new usando a tua conta.
2. Nome: `independente-mente-studio` (ou outro nome disponível).
3. Visibilidade: **Public** para usar o GitHub Pages num repositório público. **Aviso:** as imagens e o código ficam visíveis para toda a gente. Confirma que tens autorização do artista para publicar.
4. Deixa desmarcadas as opções **Add a README file**, **.gitignore** e **Choose a license**, porque o projeto já contém os ficheiros necessários.
5. Carrega em **Create repository**.

## Passo 2 — Enviar o site

1. Abre o repositório novo no GitHub.
2. No repositório ainda vazio, clica no link **uploading an existing file**. Se o repositório já tiver ficheiros, usa **Add file > Upload files**.
3. Extrai `independente-mente-github-pages.zip` e arrasta o **conteúdo da pasta extraída**, não o ficheiro ZIP e não apenas a pasta exterior.
4. Confirma que `index.html` fica na raiz do repositório, ao lado de `README.md`.
5. Confirma que `css/styles.css`, `js/app.js` e os três ficheiros em `assets/artwork/` aparecem nos respetivos caminhos.
6. Faz **Commit changes** para o branch `main`.

Se já existir um README no repositório, evita duplicá-lo ou sobrescrevê-lo por acidente.

## Passo 3 — Ativar GitHub Pages

1. No GitHub, abre **Settings > Pages** do repositório.
2. Em **Build and deployment**, seleciona **Deploy from a branch**.
3. Escolhe **Branch: main** e pasta **/(root)**; carrega **Save**.
4. Aguarda pela publicação. O GitHub mostra o endereço real no separador Pages.
5. Um endereço típico é: `https://NOME-DE-UTILIZADOR.github.io/independente-mente-studio/`.

Não adivinhes o endereço final: confirma-o no GitHub.

## Passo 4 — Utilização no iPhone e no PC

- PC: abre o endereço do Pages no navegador.
- iPhone: abre no Safari; em **Partilhar > Adicionar ao ecrã principal**, cria um atalho se quiseres.
- Podes experimentar artes, cores, frente/costas e exportar imagens.
- Os projetos guardados no navegador de cada dispositivo **não ficam sincronizados** entre o iPhone e o PC.
- Para transportar um design com as **duas artes originais**, usa **Partilhar** para copiar um link de configuração; o link só funciona enquanto o site permanecer publicado nesse endereço.
- Para fazer cópias de segurança editáveis, usa **Exportar projeto JSON**. As imagens personalizadas carregadas localmente podem exigir envio separado.

## Segurança e direitos

- Um site de GitHub Pages com este repositório público disponibiliza os grafismos aos visitantes através do navegador. Não publicar obras sem autorização.
- Não adicionar segredos, palavras-passe, tokens ou dados pessoais ao repositório.
- GitHub Pages é alojamento estático. Não fornece contas privadas, gravação cloud, pagamentos nem sincronização entre dispositivos.
