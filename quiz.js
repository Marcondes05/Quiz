const temaSorteadoDiv = document.getElementById("temaSorteado");
const perguntaDiv = document.getElementById("pergunta");
const alternativasDiv = document.getElementById("alternativas");
const resultadoDiv = document.getElementById("resultado");
const iniciarQuizBtn = document.getElementById("iniciarQuiz");

let perguntas = [];
let perguntasRespondidas = [];
let pontuacao = 0;
let numeroPerguntas = 10;
let perguntasCorretasParaVitoria = 6;
let tentativasRestantes = 4;
let temaAnterior = null;

function sortearTema() {
    const temas = [
        "Liderança",
        "Controle",
        "Planejamento",
        "Organização",
        "Áreas Funcionais",
        "Sustentabilidade"
    ];

    let novoTema = temaAnterior;
    while (novoTema === temaAnterior) {
        novoTema = temas[Math.floor(Math.random() * temas.length)];
    }

    temaAnterior = novoTema;

    return novoTema;
}

function carregarPerguntas(tema) {
    fetch(`perguntas_${tema}.json`)
        .then((response) => response.json())
        .then((data) => {
            perguntas = data;
            perguntasRespondidas = [];
            pontuacao = 0;
            tentativasRestantes = 4;

            temaSorteadoDiv.textContent = `Tema Sorteado: ${tema}`;
            temaSorteadoDiv.style.display = "block";

            iniciarQuizBtn.style.display = "none"; // Oculta o botão "Iniciar Quiz"
            iniciarQuizBtn.removeEventListener("click", iniciarQuiz);

            sortearEExibirPergunta();
        });
}

function sortearEExibirPergunta() {
    if (perguntas.length > 0 && perguntasRespondidas.length < numeroPerguntas) {
        const indiceSorteado = Math.floor(Math.random() * perguntas.length);
        const perguntaSorteada = perguntas.splice(indiceSorteado, 1)[0];
        perguntasRespondidas.push(perguntaSorteada);

        perguntaDiv.textContent = perguntaSorteada.pergunta;
        alternativasDiv.innerHTML = "";

        const alternativas = perguntaSorteada.alternativas;

        for (let i = 0; i < alternativas.length; i++) {
            const alternativa = document.createElement("button");
            alternativa.textContent = String.fromCharCode(65 + i) + ") " + alternativas[i];
            alternativa.addEventListener("click", () => verificarResposta(alternativa.textContent, perguntaSorteada.resposta));
            alternativasDiv.appendChild(alternativa);
        }

        resultadoDiv.textContent = "";
    } else {
        mostrarResultado();
    }
}

function verificarResposta(respostaSelecionada, respostaCorreta) {
    if (respostaSelecionada.charAt(0) === respostaCorreta) {
        resultadoDiv.textContent = "Resposta correta!";
        pontuacao++;
    } else {
        resultadoDiv.textContent = `Resposta incorreta. A resposta correta é: ${respostaCorreta}`;
        tentativasRestantes--;

        if (tentativasRestantes === 0) {
            mostrarResultado();
            return;
        }
    }

    if (pontuacao >= perguntasCorretasParaVitoria && perguntasRespondidas.length === numeroPerguntas) {
        mostrarResultado(true);
    } else {
        setTimeout(sortearEExibirPergunta, 1000);
    }
}

function mostrarResultado(vitoria) {
    perguntaDiv.textContent = vitoria ? "Você ganhou o Quiz!" : "Você perdeu o Quiz!";
    alternativasDiv.innerHTML = "";
    resultadoDiv.textContent = vitoria ? `Pontuação: ${pontuacao} de ${numeroPerguntas}` : "Você excedeu o número de tentativas permitidas.";

    iniciarQuizBtn.style.display = "block"; // Exibe novamente o botão "Iniciar Quiz"
    iniciarQuizBtn.addEventListener("click", iniciarQuiz);
}

function iniciarQuiz() {
    const temaSorteado = sortearTema();
    carregarPerguntas(temaSorteado);
}

// Adiciona um evento de clique para o botão "Iniciar Quiz"
iniciarQuizBtn.addEventListener("click", iniciarQuiz);
