

const personagem = document.querySelector(".personagem");

//pulo 

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "w") {
        personagem.classList.add("pulando");
    }
});

personagem.addEventListener("animationend", () => {
    personagem.classList.remove("pulando");
});

//dash - avanço

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === " ") {
        console.log("Dash!");
    }
});

//agachamento

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "s") {
        console.log("Agachou!");
    }
});

//movimentação horizontal

let x = 100;
const velocidade = 5;
const teclas = {};

document.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase();

    if (["a", "d"].includes(tecla)) {
        event.preventDefault();
        teclas[tecla] = true;
    }
});

document.addEventListener("keyup", (event) => {
    teclas[event.key.toLowerCase()] = false;
});

function atualizar() {
    if (teclas["d"]) x += velocidade;
    if (teclas["a"]) x -= velocidade;

    personagem.style.left = `${x}px`;

    requestAnimationFrame(atualizar);
}

atualizar();

