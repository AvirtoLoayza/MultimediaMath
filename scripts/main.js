// Variables del juego
let currentScreen = 'title';
let selectedOperation = '';
let selectedLevel = 1;
let score = 0;
let highscore = localStorage.getItem('mathMagicHighscore') || 0;
let lives = 3;
let correctAnswers = 0;
let totalQuestions = 0;
let currentAnswer = 0;
let gameWon = false;
let enemyPosition = 100; // Posición del enemigo (100 = derecha, 0 = izquierda)
let playerPosition = 0; // Posición del jugador (izquierda fija)
let enemySpeed = 0.5; // Velocidad de movimiento del enemigo (más lento)
let enemyMoveInterval;
let questionsAnswered = 0;
let targetQuestions = 10; // Preguntas necesarias para ganar
let gameAudio; // Audio del juego

// Elementos del DOM
const titleScreen = document.getElementById('title-screen');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const questionDisplay = document.getElementById('question-display');
const answerOptions = document.getElementById('answer-options');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');
const livesDisplay = document.getElementById('lives');
const questionsProgressDisplay = document.getElementById('questions-progress');
const finalScoreDisplay = document.getElementById('final-score');
const finalHighscoreDisplay = document.getElementById('final-highscore');
const correctAnswersDisplay = document.getElementById('correct-answers');
const totalQuestionsDisplay = document.getElementById('total-questions');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackMessage = document.getElementById('feedback-message');
const gameScene = document.getElementById('game-scene');
const playerCharacter = document.getElementById('player-character');
const enemyCharacter = document.getElementById('enemy-character');
const enemyProgressBar = document.getElementById('enemy-progress-bar');

// Verificar que las imágenes se cargan correctamente
function checkImageLoad() {
  const actor1Img = new Image();
  actor1Img.onload = function() {
    console.log('✅ actor1.gif cargado correctamente');
  };
  actor1Img.onerror = function() {
    console.log('❌ Error cargando actor1.gif');
  };
  actor1Img.src = 'images/actor1.gif';
  
  const maloImg = new Image();
  maloImg.onload = function() {
    console.log('✅ malo.gif cargado correctamente');
  };
  maloImg.onerror = function() {
    console.log('❌ Error cargando malo.gif');
  };
  maloImg.src = 'images/malo.gif';
}

// Inicializar el juego
function initGame() {
  highscoreDisplay.textContent = highscore;
  setupEventListeners();
  
  // Inicializar audio
  gameAudio = new Audio('assets/sounds/je.mp3');
  gameAudio.volume = 0.3;
  
  // Verificar carga de imágenes
  checkImageLoad();
}

// Configurar event listeners
function setupEventListeners() {
  // Los event listeners se configuran en el HTML con onclick
}

// Iniciar el juego
function startGame() {
  titleScreen.style.display = 'none';
  menuScreen.style.display = 'block';
  currentScreen = 'menu';
}

// Volver al inicio
function goHome() {
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  titleScreen.style.display = 'block';
  currentScreen = 'title';
  
  // Resetear valores si estaba en juego
  resetGame();
}

// Ir al menú
function goToMenu() {
  resultScreen.style.display = 'none';
  menuScreen.style.display = 'block';
  currentScreen = 'menu';
  resetGame();
}

// Seleccionar operación
function selectOperation(op) {
  selectedOperation = op;
  
  // Actualizar UI para mostrar la operación seleccionada
  document.querySelectorAll('.operation-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Encontrar el botón correspondiente
  const buttons = document.querySelectorAll('.operation-btn');
  const operationMap = {
    'add': 0,
    'subtract': 1,
    'multiply': 2,
    'divide': 3,
    'mixed': 4
  };
  
  if (operationMap[op] !== undefined) {
    buttons[operationMap[op]].classList.add('selected');
  }
}

// Seleccionar nivel
function selectLevel(level) {
  selectedLevel = level;
  
  // Actualizar UI para mostrar el nivel seleccionado
  document.querySelectorAll('.level-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Encontrar la opción correspondiente
  const options = document.querySelectorAll('.level-option');
  if (options[level - 1]) {
    options[level - 1].classList.add('selected');
  }
}

// Comenzar la batalla
function startBattle() {
  if (!selectedOperation) {
    showAlert('Por favor selecciona una operación');
    return;
  }
  
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  currentScreen = 'game';
  
  // Configurar escena según nivel
  setupScene();
  
  // Iniciar valores del juego
  score = 0;
  lives = 3;
  correctAnswers = 0;
  totalQuestions = 0;
  questionsAnswered = 0;
  gameWon = false;
  enemyPosition = 100; // Enemigo empieza desde la derecha
  playerPosition = 0; // Jugador fijo en la izquierda
  
  // Ajustar velocidad del enemigo según nivel (más lento)
  enemySpeed = selectedLevel * 0.3;
  
  // Actualizar UI
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  questionsProgressDisplay.textContent = `${questionsAnswered}/${targetQuestions}`;
  
  // Mostrar instrucciones
  showInstructions();
  
  // Iniciar movimiento del enemigo después de un breve retraso
  setTimeout(() => {
    startEnemyMovement();
    generateQuestion();
  }, 2000);
}

// Mostrar instrucciones del juego
function showInstructions() {
  const instructions = `
    <div style="text-align: center; padding: 20px;">
      <h3 style="color: #ffcc00; margin-bottom: 15px;">INSTRUCCIONES</h3>
      <p style="margin-bottom: 10px;">• Responde correctamente para lanzar un cuchillo y eliminar al enemigo</p>
      <p style="margin-bottom: 10px;">• Si el enemigo llega hasta ti, perderás una vida</p>
      <p style="margin-bottom: 10px;">• Responde 10 preguntas correctamente para ganar</p>
      <p style="margin-bottom: 10px;">• ¡El enemigo se acerca más rápido con cada error!</p>
      <p style="color: #00ffff;">¡DEFIENDE TU POSICIÓN!</p>
    </div>
  `;
  
  showFeedback('¡BATALLA INICIADA!', instructions);
}

// Configurar escena del juego
function setupScene() {
  // Limpiar clases anteriores
  gameScene.className = 'game-background';
  playerCharacter.className = 'wizard-character animated';
  enemyCharacter.className = 'enemy-character animated';
  
  // Añadir clases según nivel
  gameScene.classList.add(`level-${selectedLevel}`);
  
  // Configurar fondo según nivel
  const backgrounds = {
    1: 'images/fondo2.jpg',
    2: 'images/fondo3.jpg',
    3: 'images/fondo4.jpg'
  };
  
  if (backgrounds[selectedLevel]) {
    gameScene.style.backgroundImage = `url('${backgrounds[selectedLevel]}')`;
  }
  
  // Configurar actor1 explícitamente
  setupPlayerCharacter();
  
  // Configurar enemigo según nivel
  setupEnemyByLevel();
  
  // Animaciones diferentes según nivel
  if (selectedLevel === 3) {
    playerCharacter.classList.add('power-up');
  }
}

// Configurar el personaje del jugador (actor1)
function setupPlayerCharacter() {
  playerCharacter.style.backgroundImage = "url('images/actor1.gif')";
  playerCharacter.style.backgroundSize = 'contain';
  playerCharacter.style.backgroundRepeat = 'no-repeat';
  playerCharacter.style.backgroundPosition = 'center';
  
  // Agregar texto de fallback
  playerCharacter.innerHTML = '<div style="color: white; text-align: center; padding-top: 50px; font-size: 12px;">ACTOR1</div>';
  
  console.log('Actor1 configurado explícitamente');
}

// Configurar enemigo según el nivel
function setupEnemyByLevel() {
  const enemies = {
    1: 'images/malo.gif',    // Enemigo básico
    2: 'images/malo2.gif',   // Enemigo intermedio
    3: 'images/malo3.gif'    // Enemigo avanzado
  };
  
  if (enemies[selectedLevel]) {
    enemyCharacter.style.backgroundImage = `url('${enemies[selectedLevel]}')`;
    enemyCharacter.style.backgroundSize = 'contain';
    enemyCharacter.style.backgroundRepeat = 'no-repeat';
    enemyCharacter.style.backgroundPosition = 'center';
    
    // Agregar texto de fallback
    enemyCharacter.innerHTML = '<div style="color: white; text-align: center; padding-top: 50px; font-size: 12px;">ENEMIGO</div>';
    
    console.log('Enemigo configurado:', enemies[selectedLevel]); // Debug
  }
}

// Iniciar movimiento del enemigo
function startEnemyMovement() {
  clearInterval(enemyMoveInterval);
  enemyMoveInterval = setInterval(() => {
    if (gameWon || lives <= 0) {
      clearInterval(enemyMoveInterval);
      return;
    }
    
    // Mover enemigo hacia la izquierda (hacia el jugador)
    enemyPosition -= enemySpeed;
    
    // Actualizar posición visual del enemigo
    updateEnemyPosition();
    
    // Verificar si el enemigo llegó al jugador
    if (enemyPosition <= playerPosition) {
      enemyReachedPlayer();
    }
  }, 50); // Actualizar más frecuentemente para movimiento más suave
}

// Actualizar posición visual del enemigo
function updateEnemyPosition() {
  // Calcular posición basada en el contenedor de pregunta
  const questionContainer = document.querySelector('.question-container');
  const containerRect = questionContainer.getBoundingClientRect();
  const maxDistance = containerRect.width - 200; // Más espacio para movimiento
  
  // Mapear la posición del enemigo (100-0) a la distancia real
  // 100 = derecha (más lejano), 0 = izquierda (cerca del jugador)
  const position = ((100 - enemyPosition) / 100) * maxDistance;
  enemyCharacter.style.left = `${80 + position}px`; // 80px es la posición inicial (más a la derecha)
  
  // Actualizar barra de progreso (invertida)
  const progressPercent = ((100 - enemyPosition) / 100) * 100;
  enemyProgressBar.style.width = `${Math.min(progressPercent, 100)}%`;
}

// Enemigo llegó al jugador
function enemyReachedPlayer() {
  clearInterval(enemyMoveInterval);
  lives--;
  livesDisplay.textContent = lives;
  
  // Reproducir sonido de ataque
  if (gameAudio) {
    gameAudio.currentTime = 0;
    gameAudio.play().catch(e => console.log('Error reproduciendo audio:', e));
  }
  
  // Animación de ataque del enemigo
  enemyCharacter.classList.add('attack');
  playerCharacter.classList.add('damage');
  
  showFeedback('¡EL ENEMIGO TE ALCANZÓ!', `-1 vida. Te quedan ${lives} vidas`);
  
  setTimeout(() => {
    enemyCharacter.classList.remove('attack');
    playerCharacter.classList.remove('damage');
    
    if (lives <= 0) {
      endGame(false);
    } else {
      // Resetear posición del enemigo
      enemyPosition = 100;
      updateEnemyPosition();
      startEnemyMovement();
      generateQuestion();
    }
  }, 1500);
}

// Generar pregunta
function generateQuestion() {
  const operators = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
    mixed: ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)]
  };

  // Determinar rango de números según nivel
  let maxNumber;
  switch(selectedLevel) {
    case 1: maxNumber = 10; break;
    case 2: maxNumber = 50; break;
    case 3: maxNumber = 100; break;
    default: maxNumber = 10;
  }

  let num1 = Math.floor(Math.random() * maxNumber) + 1;
  let num2 = Math.floor(Math.random() * maxNumber) + 1;
  
  // Asegurar división válida
  if (selectedOperation === 'divide' || (selectedOperation === 'mixed' && operators.mixed === '÷')) {
    // Hacer que la división sea exacta para simplificar
    num1 = num1 * num2;
  }

  const operator = selectedOperation === 'mixed' ? operators.mixed : operators[selectedOperation];
  const question = `${num1} ${operator} ${num2}`;
  
  // Calcular respuesta
  let answer;
  switch(operator) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '×': answer = num1 * num2; break;
    case '÷': answer = num1 / num2; break;
  }
  
  currentAnswer = answer;
  totalQuestions++;
  
  // Mostrar pregunta
  questionDisplay.innerHTML = `<span class="number">${num1}</span> <span class="operator">${operator}</span> <span class="number">${num2}</span> <span class="equals">=</span>`;
  
  // Generar opciones de respuesta
  generateAnswerOptions(answer, maxNumber);
}

// Generar opciones de respuesta
function generateAnswerOptions(correctAnswer, maxNumber) {
  answerOptions.innerHTML = '';
  const options = [correctAnswer];
  
  // Generar respuestas incorrectas basadas en el nivel
  while (options.length < 4) {
    let randomAnswer;
    const variation = Math.floor(maxNumber / 10) + 1;
    
    if (Math.random() > 0.5) {
      randomAnswer = correctAnswer + Math.floor(Math.random() * variation) + 1;
    } else {
      randomAnswer = correctAnswer - Math.floor(Math.random() * variation) - 1;
    }
    
    // Asegurar que no sea negativo en niveles bajos
    if (selectedLevel === 1 && randomAnswer < 0) {
      randomAnswer = Math.abs(randomAnswer);
    }
    
    // Evitar duplicados
    if (!options.includes(randomAnswer) && randomAnswer !== 0) {
      options.push(randomAnswer);
    }
  }
  
  // Mezclar opciones
  shuffleArray(options);
  
  // Crear botones de opciones
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(option));
    answerOptions.appendChild(button);
  });
}

// Verificar respuesta
function checkAnswer(selectedAnswer) {
  const isCorrect = selectedAnswer === currentAnswer;
  
  if (isCorrect) {
    // Respuesta correcta
    score += selectedLevel * 10;
    correctAnswers++;
    questionsAnswered++;
    updateScore();
    
    // Matar al enemigo
    killEnemy();
    
    showFeedback('¡CORRECTO!', `+${selectedLevel * 10} puntos. Enemigo eliminado!`);
    
    // Verificar si ganó
    if (questionsAnswered >= targetQuestions) {
      setTimeout(() => {
        endGame(true);
      }, 1500);
      return;
    }
    
    // Actualizar progreso de preguntas
    questionsProgressDisplay.textContent = `${questionsAnswered}/${targetQuestions}`;
  } else {
    // Respuesta incorrecta - el enemigo se acerca más rápido
    enemySpeed += 0.2;
    showFeedback('¡INCORRECTO!', `La respuesta era: ${currentAnswer}. El enemigo se acerca más rápido!`);
    
    // Animación de daño
    playerCharacter.classList.add('damage');
    setTimeout(() => playerCharacter.classList.remove('damage'), 500);
  }
  
  // Siguiente pregunta después de un breve retraso
  setTimeout(nextQuestion, 1500);
}

// Matar al enemigo
function killEnemy() {
  // Animación de ataque del jugador (lanzar cuchillo)
  playerCharacter.classList.add('attack');
  
  // Crear efecto de cuchillo volador
  createKnifeProjectile();
  
  // Después de un breve retraso, el enemigo muere
  setTimeout(() => {
    enemyCharacter.classList.add('death');
    createParticles(enemyCharacter);
  }, 300);
  
  // Resetear posición del enemigo
  setTimeout(() => {
    enemyPosition = 100;
    updateEnemyPosition();
    enemyCharacter.classList.remove('death');
    playerCharacter.classList.remove('attack');
  }, 800);
}

// Crear efecto de cuchillo volador
function createKnifeProjectile() {
  const knife = document.createElement('div');
  knife.className = 'knife-projectile';
  knife.innerHTML = '🗡️';
  knife.style.cssText = `
    position: absolute;
    font-size: 2rem;
    z-index: 15;
    left: 180px;
    bottom: 120px;
    animation: knifeThrow 0.8s ease-out forwards;
  `;
  
  document.querySelector('.question-container').appendChild(knife);
  
  // Remover cuchillo después de la animación
  setTimeout(() => {
    knife.remove();
  }, 800);
}

// Crear efectos de partículas
function createParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    document.body.appendChild(particle);
    
    // Remover partícula después de la animación
    setTimeout(() => {
      particle.remove();
    }, 2000);
  }
}

// Mostrar feedback
function showFeedback(title, message) {
  feedbackTitle.textContent = title;
  feedbackMessage.textContent = message;
  feedbackOverlay.classList.remove('hidden');
  
  setTimeout(() => {
    feedbackOverlay.classList.add('hidden');
  }, 1300);
}

// Siguiente pregunta
function nextQuestion() {
  if (lives <= 0 || gameWon) return;
  generateQuestion();
}

// Actualizar puntuación
function updateScore() {
  scoreDisplay.textContent = score;
  if (score > highscore) {
    highscore = score;
    highscoreDisplay.textContent = highscore;
    localStorage.setItem('mathMagicHighscore', highscore);
  }
}

// Terminar el juego
function endGame(won) {
  clearInterval(enemyMoveInterval);
  gameWon = won;
  
  gameScreen.style.display = 'none';
  resultScreen.style.display = 'block';
  currentScreen = 'result';
  
  // Actualizar estadísticas finales
  finalScoreDisplay.textContent = score;
  finalHighscoreDisplay.textContent = highscore;
  correctAnswersDisplay.textContent = correctAnswers;
  totalQuestionsDisplay.textContent = totalQuestions;
  
  // Mostrar mensaje de victoria o derrota
  const resultTitle = document.querySelector('.result-screen h2');
  if (won) {
    resultTitle.textContent = '¡VICTORIA!';
    resultTitle.style.color = '#00ff00';
  } else {
    resultTitle.textContent = 'DERROTA';
    resultTitle.style.color = '#ff0000';
  }
}

// Reintentar juego
function retryGame() {
  resultScreen.style.display = 'none';
  startBattle();
}

// Resetear juego
function resetGame() {
  clearInterval(enemyMoveInterval);
  score = 0;
  lives = 3;
  correctAnswers = 0;
  totalQuestions = 0;
  questionsAnswered = 0;
  gameWon = false;
  enemyPosition = 100;
  playerPosition = 0;
  enemySpeed = 0.5;
}

// Mezclar array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mostrar alerta
function showAlert(message) {
  // Implementación simple de alerta
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.textContent = message;
  alertBox.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 1000;
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
  `;
  document.body.appendChild(alertBox);
  
  setTimeout(() => {
    alertBox.remove();
  }, 2000);
}

// Mostrar pista
function showHint() {
  let hint = '';
  
  // Generar pista según la operación
  const questionText = questionDisplay.textContent;
  const parts = questionText.split(' ');
  const num1 = parseInt(parts[0]);
  const operator = parts[1];
  const num2 = parseInt(parts[2]);
  
  switch(operator) {
    case '+':
      hint = `Suma: ${num1} + ${num2} = ${num1 + num2}`;
      break;
    case '-':
      hint = `Resta: ${num1} - ${num2} = ${num1 - num2}`;
      break;
    case '×':
      hint = `Multiplicación: ${num1} × ${num2} = ${num1 * num2}`;
      break;
    case '÷':
      hint = `División: ${num1} ÷ ${num2} = ${num1 / num2}`;
      break;
  }
  
  showFeedback('PISTA', hint);
  
  // Penalizar por usar pista - el enemigo se acerca más rápido
  enemySpeed += 0.3;
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initGame);