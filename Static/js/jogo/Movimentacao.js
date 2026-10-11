
window.controlesJogo = {
    esquerda: false,
    direita: false,
    puloSolicitado: false
};

document.addEventListener("keydown", function (evento) {
    const tecla = evento.key.toLowerCase();

    if (["a", "d", "w", " "].includes(tecla)) {
        evento.preventDefault();
    }

    if (tecla === "a" || tecla === "arrowleft") {
        window.controlesJogo.esquerda = true;
    }

    if (tecla === "d" || tecla === "arrowright") {
        window.controlesJogo.direita = true;
    }

    if (
        (tecla === "w" ||
        tecla === "arrowup" ||
        tecla === " ") &&
        !evento.repeat
    ) {
        window.controlesJogo.puloSolicitado = true;
    }
});

document.addEventListener("keyup", function (evento) {
    const tecla = evento.key.toLowerCase();

    if (tecla === "a" || tecla === "arrowleft") {
        window.controlesJogo.esquerda = false;
    }

    if (tecla === "d" || tecla === "arrowright") {
        window.controlesJogo.direita = false;
    }
});

window.addEventListener("blur", function () {
    window.controlesJogo.esquerda = false;
    window.controlesJogo.direita = false;
});