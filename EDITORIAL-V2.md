# Lecas-Merch V2 — Apresentações editoriais

Esta atualização acrescenta ao editor existente um gerador de apresentações HTML autónomas com **cinco secções** inspiradas no PDF de referência.

## Como utilizar

1. Abre o **Design Studio** e cria ou edita uma T-shirt.
2. Carrega em **Guardar**. É criada uma nova revisão da apresentação.
3. Entra em **Coleção** e escolhe **Apresentar** no cartão correspondente.
4. Escolhe a revisão pretendida:
   - **Ver apresentação:** abre um mini-site editorial em nova janela;
   - **Descarregar HTML:** obtém um único ficheiro HTML com imagens incorporadas para abrir offline;
   - **Guardar PDF:** abre a vista de impressão do navegador; escolhe *Guardar como PDF*.

O HTML inclui a frente, as costas, as referências originais efetivamente usadas e a visualização de produto. Se uma face não tiver arte, não será inventada outra.

## Revisões e armazenamento

As configurações de cada revisão são copiadas ao guardar e não se alteram quando modificas o conceito. Revisões são guardadas no `localStorage` com a chave `lecas-merch-editorial-revisions-v1`, separada do estado atual do editor. Os conceitos existentes na versão V1 obtêm uma revisão inicial ao escolher **Apresentar**.

**Limitações conscientes da Fase 1:** as revisões não são sincronizadas entre dispositivos; artes personalizadas carregadas continuam temporárias na versão atual e precisam de estar disponíveis nesta sessão para gerar o respetivo HTML. O ficheiro HTML já exportado é independente do browser. Guardar PDF usa a impressão e pode variar ligeiramente entre navegadores; é necessário validar manualmente o resultado no Safari iOS.

## Qualidade e fidelidade

- As três imagens originais permanecem inalteradas.
- Mockups são ilustrações conceptuais, não ficheiros prontos para produção.
- O HTML exportado contém estilos e imagens incorporadas, sem fontes remotas ou CDN.
- Campos de texto são escapados para evitar injeção de HTML.
- Cada secção apresenta o conteúdo real da revisão.
- A impressão foi desenhada para **A4 horizontal com cinco páginas**.

## Verificação automatizada

```sh
node --check js/app.js
node --check js/presentation/editorial.js
node tests/editorial-check.cjs
```

O teste cobre o histórico, imutabilidade, cinco secções, incorporação das imagens, escape de texto e estilos de impressão. Confirmações visuais e de impressão real continuam a exigir um navegador.
