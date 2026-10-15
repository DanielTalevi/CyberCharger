
/*
 * DANO DO JOGADOR
 * Responsabilidade:
 * - Detectar contato com obstáculos.
 * - Reduzir vidas.
 * - Dar invulnerabilidade temporária.
 * - Encerrar a partida.
 * - Solicitar o nome e registrar a pontuação.
 */

const jogadorVisual = document.querySelector("#personagem");
const areaJogo = document.querySelector("#jogo");
const contadorVidas = document.querySelector("#vidas");

let invulneravelAte = 0;
let jogoEncerrado = false;

const TEMPO_INVULNERAVEL = 1200;
const inicioPartida = Date.now();

function verificarColisaoDano(a, b) {
    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}

function receberDano() {
    const agora = Date.now();

    if (jogoEncerrado || agora < invulneravelAte) {
        return;
    }

    let vidas = Number(contadorVidas.textContent);

    if (vidas <= 0) return;

    vidas--;
    contadorVidas.textContent = vidas;

    invulneravelAte = agora + TEMPO_INVULNERAVEL;

    jogadorVisual.classList.add("recebendo-dano");

    setTimeout(() => {
        jogadorVisual.classList.remove("recebendo-dano");
    }, TEMPO_INVULNERAVEL);

    if (vidas === 0) {
        encerrarJogo();
    }
}

function atualizarDano() {
    if (jogoEncerrado || !jogadorVisual) return;

    const jogador = jogadorVisual.getBoundingClientRect();

    const obstaculos = document.querySelectorAll(
        ".serra, .espinhos"
    );

    for (const obstaculo of obstaculos) {
        const retangulo = obstaculo.getBoundingClientRect();

        if (verificarColisaoDano(jogador, retangulo)) {
            receberDano();
            break;
        }
    }
}

function encerrarJogo() {
    if (jogoEncerrado) return;

    jogoEncerrado = true;

    if (window.controlesJogo) {
        window.controlesJogo.esquerda = false;
        window.controlesJogo.direita = false;
        window.controlesJogo.puloSolicitado = false;
    }

    // Pontuação = segundos sobrevividos nesta partida.
    const pontos = Math.floor(
        (Date.now() - inicioPartida) / 1000
    );

    const mensagem = document.createElement("section");
    mensagem.className = "mensagem-game-over";

    const titulo = document.createElement("h2");
    titulo.textContent = "GAME OVER";

    const resultado = document.createElement("p");
    resultado.textContent = `Pontuação: ${pontos} segundos`;

    const formulario = document.createElement("form");
    formulario.className = "form-placar";

    const rotulo = document.createElement("label");
    rotulo.htmlFor = "nome-jogador";
    rotulo.textContent = "Digite seu nome com cinco letras:";

    const campoNome = document.createElement("input");
    campoNome.id = "nome-jogador";
    campoNome.type = "text";
    campoNome.maxLength = 5;
    campoNome.minLength = 5;
    campoNome.pattern = "[A-Za-z]{5}";
    campoNome.autocomplete = "off";
    campoNome.required = true;
    campoNome.title = "Digite exatamente cinco letras.";

    const botao = document.createElement("button");
    botao.type = "submit";
    botao.textContent = "Salvar pontuação";

    const erro = document.createElement("p");
    erro.setAttribute("role", "alert");

    formulario.append(rotulo, campoNome, botao);
    mensagem.append(titulo, resultado, formulario, erro);
    areaJogo.appendChild(mensagem);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = campoNome.value.trim().toUpperCase();

        if (!/^[A-Z]{5}$/.test(nome)) {
            erro.textContent =
                "Use exatamente cinco letras, sem espaços ou números.";
            return;
        }

        try {
            if (!window.Placar) {
                throw new Error("O arquivo Placar.js não foi carregado.");
            }

            window.Placar.salvar(nome, pontos);

            erro.textContent = "Pontuação salva com sucesso!";

            formulario.remove();

            const link = document.createElement("a");
            link.href = "placar.html";
            link.textContent = "Ver TOP 10";
            mensagem.appendChild(link);
        } catch (erroSalvar) {
            console.error(erroSalvar);
            erro.textContent =
                "Não foi possível salvar. Verifique se o armazenamento está disponível.";
        }
    });
}
