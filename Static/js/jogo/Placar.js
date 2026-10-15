
/*
 * PLACAR DO CYBERCHARGER
 * Responsabilidade:
 * - Salvar pontuações no localStorage.
 * - Manter as dez maiores pontuações.
 * - Recuperar os dados para exibir o ranking.
 */

const CHAVE_PLACAR = "cyberChargerPlacar";
const LIMITE_PLACAR = 10;

window.Placar = {
    listar() {
        try {
            const dados = JSON.parse(
                localStorage.getItem(CHAVE_PLACAR) || "[]"
            );

            if (!Array.isArray(dados)) return [];

            return dados
                .filter(item =>
                    typeof item.nome === "string" &&
                    /^[A-Z]{5}$/.test(item.nome) &&
                    Number.isFinite(item.pontos) &&
                    item.pontos >= 0
                )
                .sort((a, b) => b.pontos - a.pontos)
                .slice(0, LIMITE_PLACAR);
        } catch (erro) {
            console.error("Erro ao ler o placar:", erro);
            return [];
        }
    },

    salvar(nome, pontos) {
        const nomeValido = String(nome).trim().toUpperCase();

        if (!/^[A-Z]{5}$/.test(nomeValido)) {
            throw new Error("O nome deve ter exatamente cinco letras.");
        }

        if (!Number.isSafeInteger(pontos) || pontos < 0) {
            throw new Error("A pontuação é inválida.");
        }

        const pontuacoes = this.listar();

        pontuacoes.push({
            nome: nomeValido,
            pontos: pontos
        });

        pontuacoes.sort((a, b) => b.pontos - a.pontos);

        const melhores = pontuacoes.slice(0, LIMITE_PLACAR);

        localStorage.setItem(
            CHAVE_PLACAR,
            JSON.stringify(melhores)
        );

        return melhores;
    }
};
