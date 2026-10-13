# independente.mente — Creative Fashion Studio

Aplicação web estática com editor de T-shirts, duas artes originais, showroom e exportação. Código em HTML, CSS e JavaScript sem dependências de compilação.

## Como abrir (recomendado)

1. Extrai o ZIP para uma pasta.
2. Abre um terminal **dentro da pasta** `independente-mente-studio`.
3. Executa `python -m http.server 8000` (ou `python3 -m http.server 8000`).
4. No navegador, abre **http://localhost:8000**.

Não é necessário instalar npm, Node.js ou configurar um servidor de base de dados. O servidor HTTP local é importante para garantir que a exportação de imagens funciona: abrir diretamente `index.html` via `file://` pode bloquear pedidos aos ficheiros pelo navegador.

## Funcionalidades

- Editor visual de frente/costas com posicionamento por arrastar, seta do teclado, escala, centrar, repor, Undo/Redo, zoom e guias.
- Modelos ilustrativos de T-shirt **Regular Fit**, **Oversized** e **Boxy Fit**, em branco, preto, cru e cinzento.
- Carregamento fiel das duas artes JPEG fornecidas (1556 × 2001 px, sem alterações).
- Gravação de conceitos no **localStorage** deste navegador; duplicar, editar e eliminar.
- Showroom com frente/costas e navegação pelos conceitos.
- Comparação de dois designs.
- Exportação PNG de frente, costas, composição dupla, story e horizontal; JPEG de frente e dupla; exportação de projeto editável em JSON; importação de projeto.
- Ficha técnica com função **Imprimir / Guardar como PDF** do navegador.
- Partilha de conceitos com as artes incluídas na pasta do site, via URL (só funciona noutros dispositivos quando o site está publicado).
- Interface responsiva e suporte a toque para movimentar a arte.

## Limitações conhecidas (transparentes)

- Os mockups são **ilustrações vetoriais**, não fotografias, nem simulações 3D. Não substituem uma prova física.
- As imagens JPEG têm **fundo branco opaco**. Em T-shirts escuras será visível um retângulo. O sistema não remove esse fundo automaticamente para não adulterar as artes.
- A área conceptual de estampagem não é uma medida confirmada por fornecedor. Os tamanhos não são medidas reais em centímetros.
- As imagens personalizadas carregadas pelo utilizador persistem apenas na sessão; exporta PNG antes de fechar. A gravação local de projetos mantém as imagens **originais predefinidas**; não contém blobs de imagens personalizadas.
- A gravação dos conceitos é **local**, não sincroniza entre dispositivos. Faz cópias de segurança em JSON.
- A exportação PNG é um mockup de apresentação, **não uma arte final de impressão**.
- Os dois conceitos originais no showroom são **exemplos editáveis**, não produtos à venda.
- Não existe checkout, pagamento, stock, backend ou autenticação.
- O carregamento de fontes web depende da Internet; sem Internet são usadas fontes locais de fallback.

## Ficheiros

```text
index.html
css/styles.css
js/app.js
assets/artwork/arte-01-original.jpeg
assets/artwork/arte-02-original.jpeg
assets/artwork/capa-album-original.jpeg
README.md
```

## Utilização rápida

1. **Design Studio** → selecionar silhueta, cor e face.
2. Selecionar **Arte 01** ou **Arte 02** e arrastar a composição no mockup.
3. Usar a escala e as ferramentas de alinhamento para ajustar.
4. Alternar **Frente / Costas** e definir a outra superfície.
5. **Guardar na coleção** → abrir **Coleção** ou **Apresentação**.
6. **Exportar** → guardar PNG para mostrar a outras pessoas ou imprimir a ficha técnica em PDF.

## Próximas fases possíveis

Fotografias reais de T-shirts, integração com um fornecedor de estampagem, formatos de impressão aprovados, armazenamento remoto de projetos e showroom partilhável com links curtos, antes de implementar e-commerce.
