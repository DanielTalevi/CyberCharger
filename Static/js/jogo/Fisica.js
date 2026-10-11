
const jogo = document.querySelector("#jogo");
const personagem = document.querySelector("#personagem");
const chao = document.querySelector("#chao");
const controles = window.controlesJogo;

if (!jogo || !personagem || !chao || !controles) {
    throw new Error(
        "Não foi possível encontrar o jogo, o personagem, o chão ou os controles."
    );
}

const jogador = {
    x: 50,
    y: 0,
    largura: 60,
    altura: 100,
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

function moverHorizontal(deltaTempo) {
    let direcao = 0;

    if (controles.esquerda) direcao--;
    if (controles.direita) direcao++;

    const anteriorX = jogador.x;

    jogador.x += direcao * jogador.velocidadeX * deltaTempo;

    jogador.x = Math.max(
        0,
        Math.min(jogador.x, jogo.clientWidth - jogador.largura)
    );

    for (const plataforma of plataformas) {
        const obstaculo = obterRetangulo(plataforma);
        const jogadorRect = retanguloJogador(jogador.x, jogador.y);

        if (
            jogadorRect.top < obstaculo.bottom &&
            jogadorRect.bottom > obstaculo.top &&
            jogadorRect.left < obstaculo.right &&
            jogadorRect.right > obstaculo.left
        ) {
            if (direcao > 0 && anteriorX + jogador.largura <= obstaculo.left + 2) {
                jogador.x = obstaculo.left - jogador.largura;
            } else if (direcao < 0 && anteriorX >= obstaculo.right - 2) {
                jogador.x = obstaculo.right;
            }
        }
    }
}

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

        // Aterrissagem: o jogador está caindo sobre uma plataforma.
        if (
            jogador.velocidadeY >= 0 &&
            fundoAnterior <= obstaculo.top &&
            fundoAtual >= obstaculo.top
        ) {
            jogador.y = obstaculo.top - jogador.altura;
            jogador.velocidadeY = 0;
            jogador.noChao = true;
        }

        // Cabeça bate na parte inferior de uma plataforma.
        else if (
            jogador.velocidadeY < 0 &&
            yAnterior >= obstaculo.bottom &&
            jogador.y <= obstaculo.bottom
        ) {
            jogador.y = obstaculo.bottom;
            jogador.velocidadeY = 0;
        }
    }

    // Limite superior da área de jogo.
    if (jogador.y < 0) {
        jogador.y = 0;

        if (jogador.velocidadeY < 0) {
            jogador.velocidadeY = 0;
        }
    }
}

function atualizarFisica(deltaTempo) {
    moverHorizontal(deltaTempo);

    // O pulo só começa se o jogador estiver apoiado em uma superfície.
    if (controles.puloSolicitado && jogador.noChao) {
        jogador.velocidadeY = -jogador.forcaPulo;
        jogador.noChao = false;
    }

    controles.puloSolicitado = false;

    moverVertical(deltaTempo);
}

function desenharJogador() {
    personagem.style.left = `${jogador.x}px`;
    personagem.style.top = `${jogador.y}px`;
}

function posicionarNoChao() {
    const topoChao = obterRetangulo(chao).top;

    jogador.y = topoChao - jogador.altura;
    jogador.velocidadeY = 0;
    jogador.noChao = true;
}

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

    requestAnimationFrame(loop);
}

posicionarNoChao();
desenharJogador();
requestAnimationFrame(loop); 