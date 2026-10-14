
/* =========================================
   FÍSICA DO JOGADOR
   Responsabilidade:
   - Movimento horizontal
   - Gravidade e pulo
   - Colisões com plataformas
   - Posicionamento do personagem
========================================= */

const jogo = document.querySelector("#jogo");
const personagem = document.querySelector("#personagem");
const chao = document.querySelector("#chao");
const controlesFisica = window.controlesJogo;

if (!jogo || !personagem || !chao || !controlesFisica) {
    throw new Error(
        "Não foi possível encontrar o jogo, o personagem, o chão ou os controles. Verifique o HTML e a ordem dos scripts."
    );
}

// A dimensão física acompanha o CSS do personagem.
const jogador = {
    x: 50,
    y: 0,
    largura: personagem.offsetWidth,
    altura: personagem.offsetHeight,
    velocidadeX: 240,
    velocidadeY: 0,
    forcaPulo: 550,
    gravidade: 1400,
    noChao: false
};

const plataformas = [
    ...document.querySelectorAll(".plataforma"),
    chao
];

/* =========================================
   RETÂNGULOS DE COLISÃO
========================================= */

function obterRetangulo(elemento) {
    const jogoRect = jogo.getBoundingClientRect();
    const rect = elemento.getBoundingClientRect();

    return {
        left: rect.left - jogoRect.left - jogo.clientLeft,
        right: rect.right - jogoRect.left - jogo.clientLeft,
        top: rect.top - jogoRect.top - jogo.clientTop,
        bottom: rect.bottom - jogoRect.top - jogo.clientTop
    };
}

function retanguloJogador(x, y) {
    return {
        left: x,
        right: x + jogador.largura,
        top: y,
        bottom: y + jogador.altura
    };
}

/* =========================================
   MOVIMENTO HORIZONTAL
========================================= */

function moverHorizontal(deltaTempo) {
    let direcao = 0;

    if (controlesFisica.esquerda) direcao--;
    if (controlesFisica.direita) direcao++;

    if (direcao === 0) return;

    const anteriorX = jogador.x;

    jogador.x += direcao * jogador.velocidadeX * deltaTempo;

    // Limites laterais do cenário.
    jogador.x = Math.max(
        0,
        Math.min(
            jogador.x,
            Math.max(0, jogo.clientWidth - jogador.largura)
        )
    );

    // Impede atravessar as laterais das plataformas.
    for (const plataforma of plataformas) {
        const obstaculo = obterRetangulo(plataforma);
        const jogadorRect = retanguloJogador(
            jogador.x,
            jogador.y
        );

        const colidiu =
            jogadorRect.top < obstaculo.bottom &&
            jogadorRect.bottom > obstaculo.top &&
            jogadorRect.left < obstaculo.right &&
            jogadorRect.right > obstaculo.left;

        if (!colidiu) continue;

        if (
            direcao > 0 &&
            anteriorX + jogador.largura <= obstaculo.left + 2
        ) {
            jogador.x = obstaculo.left - jogador.largura;
        } else if (
            direcao < 0 &&
            anteriorX >= obstaculo.right - 2
        ) {
            jogador.x = obstaculo.right;
        }
    }
}

/* =========================================
   MOVIMENTO VERTICAL
========================================= */

function moverVertical(deltaTempo) {
    const yAnterior = jogador.y;
    const fundoAnterior = yAnterior + jogador.altura;

    jogador.velocidadeY += jogador.gravidade * deltaTempo;
    jogador.y += jogador.velocidadeY * deltaTempo;

    jogador.noChao = false;

    for (const plataforma of plataformas) {
        const obstaculo = obterRetangulo(plataforma);

        const jogadorEsquerda = jogador.x;
        const jogadorDireita = jogador.x + jogador.largura;

        const sobrePlataforma =
            jogadorDireita > obstaculo.left &&
            jogadorEsquerda < obstaculo.right;

        if (!sobrePlataforma) continue;

        const fundoAtual = jogador.y + jogador.altura;

        // Aterrissagem sobre a superfície.
        if (
            jogador.velocidadeY >= 0 &&
            fundoAnterior <= obstaculo.top &&
            fundoAtual >= obstaculo.top
        ) {
            jogador.y = obstaculo.top - jogador.altura;
            jogador.velocidadeY = 0;
            jogador.noChao = true;
        }

        // Colisão da cabeça com o fundo da plataforma.
        else if (
            jogador.velocidadeY < 0 &&
            yAnterior >= obstaculo.bottom &&
            jogador.y <= obstaculo.bottom
        ) {
            jogador.y = obstaculo.bottom;
            jogador.velocidadeY = 0;
        }
    }

    // Impede ultrapassar o topo da área de jogo.
    if (jogador.y < 0) {
        jogador.y = 0;

        if (jogador.velocidadeY < 0) {
            jogador.velocidadeY = 0;
        }
    }
}

/* =========================================
   ATUALIZAÇÃO DA FÍSICA
========================================= */

function atualizarFisica(deltaTempo) {
    moverHorizontal(deltaTempo);

    // O pulo só é executado quando há apoio.
    if (
        controlesFisica.puloSolicitado &&
        jogador.noChao
    ) {
        jogador.velocidadeY = -jogador.forcaPulo;
        jogador.noChao = false;
    }

    // Consome o comando de pulo deste ciclo.
    controlesFisica.puloSolicitado = false;

    moverVertical(deltaTempo);
}

/* =========================================
   DESENHO DO PERSONAGEM
========================================= */

function desenharJogador() {
    personagem.style.left = `${jogador.x}px`;
    personagem.style.top = `${jogador.y}px`;
}

/* =========================================
   POSIÇÃO INICIAL
========================================= */

function posicionarNoChao() {
    const topoChao = obterRetangulo(chao).top;

    jogador.y = topoChao - jogador.altura;
    jogador.velocidadeY = 0;
    jogador.noChao = true;
}

/* =========================================
   LOOP PRINCIPAL
========================================= */

let ultimoTempo = 0;

function loop(tempoAtual) {
    if (ultimoTempo === 0) {
        ultimoTempo = tempoAtual;
    }

    const deltaTempo = Math.min(
        (tempoAtual - ultimoTempo) / 1000,
        0.033
    );

    ultimoTempo = tempoAtual;


    atualizarFisica(deltaTempo);
    desenharJogador();

    // Atualiza a animação usando o estado real da física.
    atualizarAnimacao(jogador, controlesFisica);

    requestAnimationFrame(loop);

}

/* =========================================
   INICIALIZAÇÃO
========================================= */

posicionarNoChao();
desenharJogador();

requestAnimationFrame(loop);
