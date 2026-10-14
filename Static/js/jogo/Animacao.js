
/* =========================================
   ANIMAÇÃO DO JOGADOR
   Responsabilidade: sprite e direção visual
========================================= */

const elementoPersonagem = document.querySelector("#personagem");
const sprite = elementoPersonagem?.querySelector("img");

const imagensAnimacao = {
    parado: "../Static/img/Parado.gif",

    // Troque estes caminhos pelos nomes reais
    // dos seus arquivos, se eles já existirem.
    andando: "../Static/img/Corrida.gif",
    pulando: "../Static/img/Jump.gif",
    caindo: "../Static/img/Caindo.gif"
};

let animacaoAtual = "";

function trocarAnimacao(nome) {
    if (!sprite || !imagensAnimacao[nome]) {
        return;
    }

    if (animacaoAtual === nome) {
        return;
    }

    animacaoAtual = nome;
    sprite.src = imagensAnimacao[nome];
}

function atualizarAnimacao(jogador, controles) {
    if (!sprite) return;

    // A direção muda enquanto a tecla está pressionada.
    if (controles.esquerda && !controles.direita) {
        sprite.style.transform = "scaleX(-1)";
    } else if (controles.direita && !controles.esquerda) {
        sprite.style.transform = "scaleX(1)";
    }

    // Escolhe a animação com base no estado da física.
    if (!jogador.noChao) {
        if (jogador.velocidadeY < 0) {
            trocarAnimacao("pulando");
        } else {
            trocarAnimacao("caindo");
        }
    } else if (
        controles.esquerda !== controles.direita
    ) {
        trocarAnimacao("andando");
    } else {
        trocarAnimacao("parado");
    }
}
