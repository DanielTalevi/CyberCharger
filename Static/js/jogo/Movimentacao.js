
/* =========================================
   MOVIMENTAÇÃO DO JOGADOR
   Responsabilidade: controles do teclado
========================================= */

window.controlesJogo = window.controlesJogo || {
    esquerda: false,
    direita: false,
    puloSolicitado: false
};

const controles = window.controlesJogo;

document.addEventListener("keydown", function (evento) {
    const tecla = evento.key.toLowerCase();

    const teclasDoJogo = [
        "a", "d", "w",
        "arrowleft", "arrowright", "arrowup", " "
    ];

    if (teclasDoJogo.includes(tecla)) {
        evento.preventDefault();
    }

    if (tecla === "a" || tecla === "arrowleft") {
        controles.esquerda = true;
    }

    if (tecla === "d" || tecla === "arrowright") {
        controles.direita = true;
    }

    if (
        (tecla === "w" ||
         tecla === "arrowup" ||
         tecla === " ") &&
        !evento.repeat
    ) {
        controles.puloSolicitado = true;
    }
});

document.addEventListener("keyup", function (evento) {
    const tecla = evento.key.toLowerCase();

    if (tecla === "a" || tecla === "arrowleft") {
        controles.esquerda = false;
    }

    if (tecla === "d" || tecla === "arrowright") {
        controles.direita = false;
    }
});

window.addEventListener("blur", function () {
    controles.esquerda = false;
    controles.direita = false;
    controles.puloSolicitado = false;
});
