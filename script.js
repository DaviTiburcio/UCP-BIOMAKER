/**
 * Aguarda o carregamento completo do DOM para iniciar o script.
 * Isso garante que todos os elementos HTML estejam prontos.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Referências dos Elementos DOM ---
    // (Seleção de todos os elementos necessários da página)
    const startScreen = document.getElementById('start-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const allScreens = document.querySelectorAll('.screen');

    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress-bar');
    const questionImage = document.getElementById('question-image');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    
    const scoreText = document.getElementById('score-text');
    const resultMessage = document.getElementById('result-message');

    // Referência ao overlay de flash
    const flashOverlay = document.getElementById('flash-overlay');

    // --- 2. Perguntas do Quiz ---
    // (Array de objetos com as perguntas. Note que as imagens são caminhos!)
    const questions = [
        {
            question: "Qual organela é o 'cérebro' da célula, armazenando o DNA e controlando as atividades celulares?",
            options: ["Mitocôndria", "Lisossomo", "Núcleo", "Ribossomo"],
            answer: "Núcleo",
            image: "IMGS/IMG1.png"
        },
        {
            question: "Conhecida como a 'usina de energia', qual organela realiza a respiração celular para produzir ATP?",
            options: ["Cloroplasto", "Mitocôndria", "Complexo de Golgi", "Vacúolo"],
            answer: "Mitocôndria",
            image: "IMGS/IMG2.png"
        },
        {
            question: "Qual organela, que pode ser encontrada livre ou ligada ao R.E., é responsável pela síntese de proteínas?",
            options: ["Ribossomo", "Lisossomo", "Peroxissomo", "Centríolo"],
            answer: "Ribossomo",
            image: "IMGS/IMG3.png"
        },
        {
            question: "O Retículo Endoplasmático Rugoso tem esse nome por ter qual outra organela aderida à sua superfície?",
            options: ["Lisossomos", "Vacúolos", "Ribossomos", "Peroxissomos"],
            answer: "Ribossomos",
            image: "IMGS/IMG4.png"
        },
        {
            question: "Qual organela atua como o 'centro de distribuição' da célula, modificando, empacotando e enviando substâncias?",
            options: ["Complexo de Golgi", "Núcleo", "Vacúolo", "Membrana Plasmática"],
            answer: "Complexo de Golgi",
            image: "IMGS/IMG5.png"
        },
        {
            question: "Responsável pela 'digestão' da célula, esta organela quebra substâncias e organelas velhas usando enzimas.",
            options: ["Mitocôndria", "Lisossomo", "Cloroplasto", "Ribossomo"],
            answer: "Lisossomo",
            image: "IMGS/IMG6.png"
        },
        {
            question: "Encontrada em plantas e algas, qual organela realiza a fotossíntese, convertendo luz solar em energia?",
            options: ["Mitocôndria", "Parede Celular", "Centríolo", "Cloroplasto"],
            answer: "Cloroplasto",
            image: "IMGS/IMG7.png"
        },
        {
            question: "Em células vegetais, qual organela ocupa a maior parte do volume, armazena água e mantém a pressão interna?",
            options: ["Vacúolo Central", "Núcleo", "Complexo de Golgi", "Lisossomo"],
            answer: "Vacúolo Central",
            image: "IMGS/IMG8.png"
        }
    ];

    // --- 3. Variáveis de Estado do Quiz ---
    let currentQuestionIndex = 0;
    let score = 0;
    let shuffledQuestions = [];

    /**
     * Navega para uma tela específica, escondendo todas as outras.
     * @param {HTMLElement} targetScreen - O elemento da tela a ser exibida.
     */
    function showScreen(targetScreen) {
        allScreens.forEach(screen => screen.classList.remove('active'));
        targetScreen.classList.add('active');
    }

    /**
     * Inicia o quiz: reinicia o estado, embaralha as perguntas e mostra a primeira.
     */
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextBtn.classList.add('hide');
        shuffledQuestions = shuffleArray(questions); // Embaralha as perguntas
        showQuestion();
        showScreen(quizContainer);
    }

    /**
     * Exibe a pergunta atual, opções, imagem e atualiza a barra de progresso.
     */
    function showQuestion() {
        // Limpa opções anteriores
        optionsContainer.innerHTML = "";
        
        // Pega a pergunta atual do array embaralhado
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        
        // Atualiza textos e imagem
        questionText.innerText = currentQuestion.question;
        questionImage.alt = currentQuestion.answer; // Boa prática de acessibilidade

        // Exibe a imagem, se houver
        if (currentQuestion.image) {
            questionImage.src = currentQuestion.image;
            questionImage.classList.remove('hide');
        } else {
            questionImage.classList.add('hide');
        }

        // Cria e exibe os botões de opção
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-btn');
            // Armazena a resposta correta no próprio botão para verificação
            button.dataset.correct = (option === currentQuestion.answer);
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });

        // Atualiza o progresso
        updateProgress();
    }

    /**
     * Atualiza o contador de perguntas e a barra de progresso.
     */
    function updateProgress() {
        const totalQuestions = shuffledQuestions.length;
        // Atualiza o texto do contador
        questionCounter.innerText = `Pergunta ${currentQuestionIndex + 1} de ${totalQuestions}`;
        
        // Atualiza a largura da barra de progresso
        const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    /**
     * Ativa um "flash" visual na tela inteira.
     * @param {string} flashClass - A classe CSS ('correct-flash' ou 'incorrect-flash').
     */
    function triggerFlash(flashClass) {
        // Remove a classe de animação anterior (se houver) para reiniciar
        flashOverlay.className = '';
        
        // Força o navegador a "repintar" o elemento
        void flashOverlay.offsetWidth; 

        // Adiciona a nova classe de animação
        flashOverlay.classList.add(flashClass);
    }


    /**
     * Chamada quando o usuário clica em uma opção.
     * Verifica a resposta, aplica estilos e mostra o botão "Próxima".
     */
    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        // Atualiza a pontuação
        if (isCorrect) {
            selectedButton.classList.add('correct');
            score++;
            triggerFlash('correct-flash');

            // --- ADICIONADO AQUI: COMANDO PARA O ESP32 ---
            fetch('/acertou');
            // ---------------------------------------------

        } else {
            selectedButton.classList.add('incorrect');
            triggerFlash('incorrect-flash');

            // --- ADICIONADO AQUI: COMANDO PARA O ESP32 ---
            fetch('/errou');
            // ---------------------------------------------
        }

        // Desabilita todos os botões e revela a resposta correta
        Array.from(optionsContainer.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
            button.disabled = true;
        });

        // Adiciona um pequeno atraso para o usuário ver o feedback
        setTimeout(() => {
            nextBtn.classList.remove('hide'); // Mostra o botão "Próxima"
        }, 800); // 800ms de atraso
    }

    /**
     * Avança para a próxima pergunta ou mostra os resultados se o quiz terminou.
     */
    function handleNextButton() {
        // --- ADICIONADO AQUI: COMANDO PARA O ESP32 ---
        // Apaga o LED (seja qual for o estado) ao ir para a próxima pergunta
        fetch('/apagar-led');
        // ---------------------------------------------

        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            showQuestion();
            nextBtn.classList.add('hide');
        } else {
            showResults(); // Se não houver mais perguntas, mostra os resultados
        }
    }

    /**
     * Exibe a tela final de resultados com pontuação e mensagem personalizada.
     */
    function showResults() {
        const totalQuestions = shuffledQuestions.length;
        scoreText.innerText = `Você acertou ${score} de ${totalQuestions} perguntas!`;
        
        // Mensagem de resultado dinâmica
        const scorePercent = (score / totalQuestions);
        if (scorePercent === 1) {
            resultMessage.innerText = "Excelente! Você gabaritou!";
        } else if (scorePercent >= 0.7) {
            resultMessage.innerText = "Muito bem! Você conhece o assunto!";
        } else if (scorePercent >= 0.4) {
            resultMessage.innerText = "Bom esforço! Continue estudando.";
        } else {
            resultMessage.innerText = "Não desanime! Reveja o material e tente novamente.";
        }
        
        showScreen(resultsContainer);
    }

    /**
     * Embaralha um array usando o algoritmo Fisher-Yates.
     * @param {Array} array - O array a ser embaralhado.
     * @returns {Array} - O array embaralhado.
     */
    function shuffleArray(array) {
        let newArray = [...array]; // Cria uma cópia para não modificar o original
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Configura os event listeners iniciais.
     */
    function setupEventListeners() {
        startBtn.addEventListener('click', startQuiz);
        nextBtn.addEventListener('click', handleNextButton);
        restartBtn.addEventListener('click', startQuiz); // Reinicia o quiz
    }

    // --- Início ---
    setupEventListeners();
    showScreen(startScreen); // Exibe a tela inicial por padrão
});
