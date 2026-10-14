# Last Ember — Landing page

![Last Ember](assets/images/social/og-image.jpg)

Landing page promocional de **Last Ember**, um jogo samurai fictício. Feita com HTML, CSS e JavaScript puros: sem frameworks, sem dependências e sem etapa de build.

**Site no ar:** https://last-ember-gilt.vercel.app

> Projeto de portfólio. O jogo, o estúdio (Kuroame Studio), os preços e as datas são fictícios.

## A história

Por mil anos, a Chama de Amaterasu iluminou o império. Na Noite das Cinzas, o Regente **Kurogane** apagou a chama e dividiu suas brasas entre sete generais. **Hotaru**, última filha do clã Murasaki, sobreviveu carregando a última brasa na guarda da katana **Hinokami** e atravessa cinco províncias para reacender o fogo.

## Destaques

- **Hero em tela cheia** com brasas flutuando, anéis dourados girando e suporte a vídeo de fundo.
- **Rolagem suave com inércia** para mouse e trackpad, com a mesma sensação em monitores de 60, 120 ou 144 Hz. No toque, a rolagem nativa continua.
- **Cabeçalho inteligente:** transparente no topo, ganha fundo ao rolar, se recolhe ao descer e volta ao subir.
- **Jornada em cinco capítulos** com um pavio que queima conforme a rolagem e acende cada capítulo.
- **Retrato interativo** da protagonista com pontos de detalhe (hotspots).
- **Combate preso na tela:** ao rolar, a seção para e passa pelas quatro técnicas, uma a uma; depois da última, a página volta a descer. As abas também funcionam no clique e no teclado.
- **Generais em faixa horizontal:** ao rolar, a seção para e os sete generais deslizam para o lado, com contador, barra de progresso e o kanji do general em destaque ao fundo.
- **Pré-venda:** "Comprar agora" leva às edições; "Reservar" abre um modal com escolha de edição e plataforma, sem rolar a página. É uma demonstração e não processa pagamento.
- **Trailer:** modal com o vídeo, ou um aviso de "Estreia em breve" enquanto o arquivo não existe.
- **Responsivo:** abaixo de 960 px, menu em tela cheia que fecha com Esc e mantém o foco dentro dele.
- **Acessível:** respeita `prefers-reduced-motion`, tem foco visível e link para pular ao conteúdo.

## Tecnologias

| | |
|---|---|
| Marcação | HTML5 semântico |
| Estilos | CSS puro, com variáveis e um arquivo por componente ou seção |
| Scripts | JavaScript puro, organizado em módulos registrados num namespace global |
| Fontes | Shippori Mincho B1 e Zen Kaku Gothic New (Google Fonts) |
| Imagens | Geradas com IA (GPT Image) a partir de um retrato de referência da protagonista |

As seções presas usam `position: sticky` e deixam de prender quando o usuário pede menos movimento (`prefers-reduced-motion`) ou a tela tem menos de 560 px de altura: aí o combate vira abas comuns e os generais, uma faixa com rolagem lateral.

Os scripts são clássicos, não ES modules, para o site funcionar também ao abrir o `index.html` direto do disco (`file://`).

## Como rodar

**Mais simples:** dê dois cliques em `index.html`.

**Com servidor local** (recarrega ao salvar):

```bash
npx serve .
```

Ou use a extensão *Live Server* do VS Code.

## Estrutura

```
last-ember/
├── index.html                 Todas as seções da página
├── css/
│   ├── main.css               Ponto de entrada (importa os demais)
│   ├── base/                  Tokens (cores, fontes), reset, tipografia, utilitários, animações
│   ├── layout/                Container, cabeçalho, menu móvel, rodapé
│   ├── components/            Botões, espaços de mídia, brasas, hotspots, modais
│   └── sections/              Um arquivo por seção
├── js/
│   ├── core/app.js            Namespace LE, utilitários e registro de módulos
│   ├── core/smooth-scroll.js  Rolagem suave com inércia
│   ├── modules/               Um arquivo por comportamento (combate e generais incluem a rolagem presa)
│   └── main.js                Inicialização
└── assets/
    ├── icons/favicon.svg
    ├── images/                Uma subpasta por seção
    └── videos/                hero-loop.mp4 e trailer.mp4 (opcionais)
```

Cada módulo JavaScript se registra com `LE.register('nome', { init })` e é iniciado por `js/main.js`.

## Imagens e vídeos

Para trocar uma imagem, salve o novo arquivo com **o mesmo nome** na mesma pasta. Se um arquivo não existir, o espaço mostra só o fundo decorativo (textura, cantoneiras e kanji).

| Pasta | Arquivos | Proporção |
|---|---|---|
| `assets/images/hotaru/` | `hotaru-portrait.jpg` | 1122×1402 |
| `assets/images/journey/` | `01-shiroyama.jpg` … `05-hinomine.jpg` | 16:10 |
| `assets/images/combat/` | `iai.jpg`, `zanka.jpg`, `kamae.jpg`, `kage.jpg` | 16:9 |
| `assets/images/interlude/` | `juramento.jpg` | 21:9 |
| `assets/images/generals/` | `01-shinobu.jpg` … `07-kurogane.jpg` | 3:4 |
| `assets/images/editions/` | `padrao.jpg`, `murasaki.jpg`, `colecionador.jpg` | 4:3 |
| `assets/images/social/` | `og-image.jpg` (prévia ao compartilhar o link) | 1200×630 |

**Vídeos (opcionais):**

- `assets/videos/hero-loop.mp4`: substitui automaticamente a imagem do hero. Loop de 6 a 10 s, sem som, até 4 MB.
- `assets/videos/trailer.mp4`: aparece no botão "Ver trailer".

Para trocar uma imagem de combate por vídeo, substitua o `<img>` do painel em `index.html` por:

```html
<video src="assets/videos/iai.mp4" autoplay muted loop playsinline></video>
```

## Personalização

| O quê | Onde |
|---|---|
| Cores, fontes e espaçamentos | `css/base/tokens.css` |
| Suavidade da rolagem | `js/main.js` → `lerp` (menor = mais suave) e `wheelMultiplier` (distância por giro) |
| Quantidade de brasas | Atributo `data-embers` no hero e no CTA final |
| Edições e preços | `index.html`, seção `#edicoes` e modal `#purchase-modal` |
| Quanto rolar por técnica de combate | `css/sections/combat.css` → `.combat-scroll.is-pinned` (`70vh` por técnica) |

## Deploy

O projeto é estático e não precisa de configuração. Na Vercel, importe o repositório com o preset **Other** e deixe os campos de build vazios. Cada `git push` na branch `main` publica uma nova versão.

## Compatibilidade

Versões atuais de Chrome, Edge, Firefox, Safari e Opera, em desktop e celular.

---

© 2026 Kuroame Studio (fictício). Todos os nomes, preços e datas são fictícios.
