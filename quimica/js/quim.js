const questions = [
  {
    question: "- Qual é a fórmula química do metano?",
    answers: [
      { id: 1, text: "CH₄", correct: true, feedback: "Você acertou! Parabéns!🎉" },
      { id: 2, text: "C₂H₆", correct: false, feedback: "Essa resposta está incorreta!😕 Essa é a fórmula do etano." },
      { id: 3, text: "H₂O", correct: false, feedback: "Essa resposta está incorreta!😕 Essa é a fórmula da água" },
      { id: 4, text: "CO₂", correct: false, feedback: "Essa resposta está incorreta!😕 Essa é a fórmula do dióxido de carbono." },
    ],
  },
  {
    question: "O metano pertence a qual grupo de compostos orgânicos?",
    answers: [
      { id: 1, text: "Alcenos", correct: false, feedback: "Essa resposta está incorreta!😕 Os alcenos têm ligações duplas." },
      { id: 2, text: "Ácidos carboxílicos", correct: false, feedback: "Essa resposta está incorreta!😕 Ácidos carboxílicos têm grupo COOH" },
      { id: 3, text: "Álcoois", correct: false, feedback: "Essa resposta está incorreta!😕 Álcoois têm grupo –OH" },
      { id: 4, text: "Alcanos", correct: true, feedback: "Você acertou! Parabéns!🎉" },
    ],
  },
  {
    question: "Onde o metano pode ser encontrado naturalmente?",
    answers: [
      { id: 1, text: "Em águas salgadas profundas", correct: false, feedback: "Essa resposta está incorreta!😕 Apesar de existirem hidratos de metano em sedimentos marinhos, eles não são fontes comuns de emissão natural." },
      { id: 2, text: "Em pântanos e no intestino de ruminantes", correct: true, feedback: "Você acertou! Parabéns!🎉" },
      { id: 3, text: "Em desertos secos", correct: false, feedback: "Essa resposta está incorreta!😕 Desertos não têm umidade nem matéria orgânica suficiente para gerar metano naturalmente." },
      { id: 4, text: "Em rochas ígneas", correct: false, feedback: "Essa resposta está incorreta!😕 Essas rochas vêm do magma e não estão ligadas à produção de compostos orgânicos como o metano." },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers-buttons");
const nextButton = document.getElementById("next-btn");
const feedbackElement = document.getElementById("feedback");

let currentQuestionIndex = 0;
let score = 0;
let showingFeedback = false;
let lastSelectedAnswer = null;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Próxima";
  feedbackElement.style.display = "none";
  showQuestion();
}

function resetState() {
  nextButton.style.display = "none";
  feedbackElement.style.display = "none";
  feedbackElement.innerText = "";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.dataset.id = answer.id;
    button.classList.add("btn");
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const selectedId = selectedBtn.dataset.id;
  const answers = questions[currentQuestionIndex].answers;
  const selectedAnswer = answers.find((answer) => answer.id == selectedId);

  lastSelectedAnswer = selectedAnswer;

  if (selectedAnswer.correct) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach((button) => {
    button.disabled = true;
  });

  nextButton.style.display = "block";
  nextButton.innerText = "Ver explicação";
  showingFeedback = true;
}

function showScore() {
  resetState();
  questionElement.innerHTML = `Você acertou ${score} de ${questions.length}!`;
}

function handleNextButton() {
  if (showingFeedback) {
    feedbackElement.innerText = lastSelectedAnswer.feedback;
    feedbackElement.style.display = "block";

    if (currentQuestionIndex === questions.length - 1) {
      nextButton.innerText = "Concluir quiz";
    } else {
      nextButton.innerText = "Próxima pergunta";
    }

    showingFeedback = false;
  } else {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }
}

nextButton.addEventListener("click", handleNextButton);

startQuiz();