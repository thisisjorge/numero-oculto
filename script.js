document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const modeScreen = document.getElementById('mode-screen');
    const setupScreen = document.getElementById('setup-screen');
    const guessingScreen = document.getElementById('guessing-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const randomModeButton = document.getElementById('random-mode-button');
    const twoPlayerModeButton = document.getElementById('two-player-mode-button');
    
    const hiddenNumberInput = document.getElementById('hiddenNumber');
    const guessInput = document.getElementById('guess');
    
    const setupButton = document.getElementById('setup-button');
    const guessButton = document.getElementById('guess-button');
    const playAgainButton = document.getElementById('play-again-button');
    const changeModeButton = document.getElementById('change-mode-button');
    
    const playerIndicator = document.getElementById('player-indicator');
    const setupMessage = document.getElementById('setup-message');
    const guessMessage = document.getElementById('guess-message');
    const resultMessage = document.getElementById('result-message');
    const resultTitle = document.getElementById('result-title');
    
    const attemptsLeft = document.getElementById('attempts-left');
    const rangeText = document.getElementById('range-text');
    
    const guessHistory = document.getElementById('guess-history');
    const resultHistory = document.getElementById('result-history');

    // Estado do jogo
    let gameState = {
        mode: null, // 'random' ou 'two-player'
        hiddenNumber: null,
        attempts: 0,
        maxAttempts: 5,
        guessHistory: [],
        minRange: 1,
        maxRange: 100
    };

    // Funções auxiliares
    function showScreen(screen) {
        modeScreen.classList.add('hidden');
        setupScreen.classList.add('hidden');
        guessingScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        
        screen.classList.remove('hidden');
        
        // Focar no input apropriado quando a tela muda
        if (screen === setupScreen) {
            setTimeout(() => hiddenNumberInput.focus(), 100);
        } else if (screen === guessingScreen) {
            setTimeout(() => guessInput.focus(), 100);
        }
    }

    function updateRangeText() {
        rangeText.textContent = `O número secreto está entre ${gameState.minRange} e ${gameState.maxRange}`;
    }

    function updateGuessHistory() {
        // Limpar histórico atual
        guessHistory.innerHTML = '';
        resultHistory.innerHTML = '';
        
        // Adicionar itens ao histórico
        gameState.guessHistory.forEach((item) => {
            const historyItem = createHistoryItem(item);
            guessHistory.appendChild(historyItem.cloneNode(true));
            resultHistory.appendChild(historyItem.cloneNode(true));
        });
    }

    function createHistoryItem(item) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const historyValue = document.createElement('span');
        historyValue.className = 'history-value';
        historyValue.textContent = item.value;
        
        const historyResult = document.createElement('span');
        historyResult.className = 'history-result';
        
        if (item.result === 'high') {
            historyResult.textContent = '↑';
        } else if (item.result === 'low') {
            historyResult.textContent = '↓';
        } else {
            historyResult.textContent = '✓';
        }
        
        historyItem.appendChild(historyValue);
        historyItem.appendChild(historyResult);
        
        return historyItem;
    }

    // Função para gerar um número aleatório
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Função para iniciar o modo aleatório
    function startRandomMode() {
        gameState.mode = 'random';
        gameState.hiddenNumber = generateRandomNumber(1, 100);
        gameState.attempts = 0;
        gameState.maxAttempts = 5;
        gameState.guessHistory = [];
        gameState.minRange = 1;
        gameState.maxRange = 100;
        
        // Atualizar a interface
        playerIndicator.classList.add('hidden');
        attemptsLeft.textContent = gameState.maxAttempts;
        updateRangeText();
        updateGuessHistory();
        
        // Mostrar tela de adivinhação
        showScreen(guessingScreen);
        
        // Limpar campos
        guessInput.value = '';
        guessMessage.textContent = '';
    }

    // Função para iniciar o modo de dois jogadores
    function startTwoPlayerMode() {
        gameState.mode = 'two-player';
        showScreen(setupScreen);
    }

    // Função para configurar o jogo no modo de dois jogadores
    function setupTwoPlayerGame() {
        const num = parseInt(hiddenNumberInput.value);
        
        if (isNaN(num) || num < 1 || num > 100) {
            setupMessage.textContent = 'Por favor, insira um número válido entre 1 e 100.';
            return;
        }
        
        // Configurar o jogo
        gameState.hiddenNumber = num;
        gameState.attempts = 0;
        gameState.maxAttempts = 5;
        gameState.guessHistory = [];
        gameState.minRange = 1;
        gameState.maxRange = 100;
        
        // Atualizar a interface
        playerIndicator.classList.remove('hidden');
        attemptsLeft.textContent = gameState.maxAttempts;
        updateRangeText();
        updateGuessHistory();
        
        // Mostrar tela de adivinhação
        showScreen(guessingScreen);
        
        // Limpar campos
        hiddenNumberInput.value = '';
        guessInput.value = '';
        setupMessage.textContent = '';
        guessMessage.textContent = '';
    }

    // Função para verificar o palpite
    function checkGuess() {
        const num = parseInt(guessInput.value);
        
        if (isNaN(num) || num < gameState.minRange || num > gameState.maxRange) {
            guessMessage.textContent = `Por favor, insira um número válido entre ${gameState.minRange} e ${gameState.maxRange}.`;
            return;
        }
        
        // Incrementar tentativas
        gameState.attempts++;
        attemptsLeft.textContent = gameState.maxAttempts - gameState.attempts;
        
        // Verificar palpite
        if (num === gameState.hiddenNumber) {
            // Acertou
            gameState.guessHistory.push({ value: num, result: 'correct' });
            updateGuessHistory();
            
            // Mostrar tela de resultado
            resultTitle.textContent = 'Parabéns!';
            resultMessage.textContent = `Você acertou o número ${gameState.hiddenNumber} em ${gameState.attempts} tentativa(s)!`;
            
            showScreen(resultScreen);
        } else {
            // Errou
            const isHigh = num > gameState.hiddenNumber;
            
            if (isHigh) {
                gameState.maxRange = Math.min(gameState.maxRange, num - 1);
            } else {
                gameState.minRange = Math.max(gameState.minRange, num + 1);
            }
            
            gameState.guessHistory.push({ value: num, result: isHigh ? 'high' : 'low' });
            updateGuessHistory();
            updateRangeText();
            
            if (gameState.attempts >= gameState.maxAttempts) {
                // Perdeu
                resultTitle.textContent = 'Que pena!';
                resultMessage.textContent = `Você perdeu! O número oculto era ${gameState.hiddenNumber}.`;
                
                showScreen(resultScreen);
            } else {
                // Continua tentando
                guessMessage.textContent = `Seu palpite é ${isHigh ? 'maior' : 'menor'} que o número oculto.`;
                guessInput.value = '';
                guessInput.focus();
            }
        }
    }

    // Função para jogar novamente no mesmo modo
    function playAgain() {
        if (gameState.mode === 'random') {
            startRandomMode();
        } else {
            startTwoPlayerMode();
        }
    }

    // Manipuladores de eventos para botões
    randomModeButton.addEventListener('click', startRandomMode);
    twoPlayerModeButton.addEventListener('click', startTwoPlayerMode);
    setupButton.addEventListener('click', setupTwoPlayerGame);
    guessButton.addEventListener('click', checkGuess);
    playAgainButton.addEventListener('click', playAgain);
    changeModeButton.addEventListener('click', function() {
        showScreen(modeScreen);
    });

    // Manipuladores de eventos para tecla ENTER
    hiddenNumberInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            setupTwoPlayerGame();
        }
    });

    guessInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkGuess();
        }
    });

    // Inicializar o jogo
    showScreen(modeScreen);
});