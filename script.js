/* ==========================================
   QUIZ QUESTIONS
========================================== */

const questions = [

    {
        question: "What does HTML stand for?",

        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],

        answer: 0
    },

    {
        question: "Which language is mainly used to style HTML pages?",

        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],

        answer: 1
    },

    {
        question: "Which language is used to add interactivity to websites?",

        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "PHP"
        ],

        answer: 2
    },

    {
        question: "Which CSS symbol is used to select an element by ID?",

        options: [
            ".",
            "#",
            "*",
            "@"
        ],

        answer: 1
    },

    {
        question: "Which keyword is used to declare a constant in JavaScript?",

        options: [
            "var",
            "let",
            "constant",
            "const"
        ],

        answer: 3
    },

    {
        question: "Which HTML tag is used to create a hyperlink?",

        options: [
            "<link>",
            "<a>",
            "<href>",
            "<url>"
        ],

        answer: 1
    },

    {
        question: "Which method is used to select an element by its ID in JavaScript?",

        options: [
            "document.getElement()",
            "document.getElementById()",
            "document.selectId()",
            "document.findId()"
        ],

        answer: 1
    },

    {
        question: "Which CSS property changes the text color?",

        options: [
            "font-color",
            "text-color",
            "color",
            "foreground"
        ],

        answer: 2
    },

    {
        question: "Which array method adds an item to the end of an array?",

        options: [
            "push()",
            "pop()",
            "shift()",
            "remove()"
        ],

        answer: 0
    },

    {
        question: "Which HTML tag is used for the largest heading?",

        options: [
            "<heading>",
            "<h6>",
            "<head>",
            "<h1>"
        ],

        answer: 3
    }

];


/* ==========================================
   VARIABLES
========================================== */

let currentQuestionIndex = 0;

let userAnswers =
    new Array(questions.length).fill(null);

let studentName = "";

let timeRemaining = 5 * 60;

let timerInterval = null;

let quizStarted = false;

let quizFinished = false;


/* ==========================================
   ANTI-CHEAT VARIABLES
========================================== */

const MAX_VIOLATIONS = 3;

let violationCount = 0;

let antiCheatViolations = [];


/* ==========================================
   ELEMENTS
========================================== */

const startScreen =
    document.getElementById("startScreen");

const quizScreen =
    document.getElementById("quizScreen");

const submittedScreen =
    document.getElementById("submittedScreen");

const studentNameInput =
    document.getElementById("studentName");

const startBtn =
    document.getElementById("startBtn");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const currentQuestionElement =
    document.getElementById("currentQuestion");

const totalQuestionsElement =
    document.getElementById("totalQuestions");

const questionBadge =
    document.getElementById("questionBadge");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const questionNumbers =
    document.getElementById("questionNumbers");

const progressBar =
    document.getElementById("progressBar");

const timerElement =
    document.getElementById("timer");


/* ==========================================
   START QUIZ
========================================== */

startBtn.addEventListener("click", function () {

    studentName =
        studentNameInput.value.trim();


    if (studentName === "") {

        alert("Please enter your name.");

        return;
    }


    /* Reset quiz */

    currentQuestionIndex = 0;

    userAnswers =
        new Array(questions.length).fill(null);

    timeRemaining = 5 * 60;

    quizStarted = true;

    quizFinished = false;


    /* Reset anti-cheat */

    violationCount = 0;

    antiCheatViolations = [];


    /* Reset timer */

    timerElement.style.color = "#2563eb";

    timerElement.style.background = "#eff6ff";


    /* Change screens */

    startScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");


    /* Total questions */

    totalQuestionsElement.textContent =
        questions.length;


    /* Question navigation */

    createQuestionNumbers();


    /* First question */

    loadQuestion();


    /* Start timer */

    startTimer();

});


/* ==========================================
   LOAD QUESTION
========================================== */

function loadQuestion() {

    if (quizFinished) {
        return;
    }


    const question =
        questions[currentQuestionIndex];


    currentQuestionElement.textContent =
        currentQuestionIndex + 1;


    questionBadge.textContent =
        `Question ${currentQuestionIndex + 1}`;


    questionText.textContent =
        question.question;


    optionsContainer.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const label =
                document.createElement("label");


            label.classList.add("option");


            if (
                userAnswers[currentQuestionIndex]
                === index
            ) {

                label.classList.add("selected");

            }


            label.innerHTML = `

                <input
                    type="radio"
                    name="answer"
                    value="${index}"
                >

                <span class="option-label"></span>

            `;


            const radio =
                label.querySelector(
                    'input[type="radio"]'
                );


            if (
                userAnswers[currentQuestionIndex]
                === index
            ) {

                radio.checked = true;

            }


            const optionLabel =
                label.querySelector(
                    ".option-label"
                );


            optionLabel.textContent =
                option;


            label.addEventListener(
                "click",
                function () {

                    if (quizFinished) {
                        return;
                    }

                    selectAnswer(index);

                }
            );


            optionsContainer.appendChild(
                label
            );

        }
    );


    updateNavigation();

    updateProgress();

    updateQuestionNumbers();

}


/* ==========================================
   SELECT ANSWER
========================================== */

function selectAnswer(answerIndex) {

    if (quizFinished) {
        return;
    }


    userAnswers[currentQuestionIndex] =
        answerIndex;


    loadQuestion();

}


/* ==========================================
   NEXT BUTTON
========================================== */

nextBtn.addEventListener(
    "click",
    function () {

        if (quizFinished) {
            return;
        }


        if (
            userAnswers[currentQuestionIndex]
            === null
        ) {

            alert(
                "Please select an answer before continuing."
            );

            return;
        }


        if (
            currentQuestionIndex
            < questions.length - 1
        ) {

            currentQuestionIndex++;

            loadQuestion();

        }

        else {

            submitQuiz("completed");

        }

    }
);


/* ==========================================
   PREVIOUS BUTTON
========================================== */

previousBtn.addEventListener(
    "click",
    function () {

        if (quizFinished) {
            return;
        }


        if (
            currentQuestionIndex > 0
        ) {

            currentQuestionIndex--;

            loadQuestion();

        }

    }
);


/* ==========================================
   NAVIGATION UPDATE
========================================== */

function updateNavigation() {

    if (quizFinished) {

        previousBtn.disabled = true;

        nextBtn.disabled = true;

        return;
    }


    previousBtn.disabled =
        currentQuestionIndex === 0;


    if (
        currentQuestionIndex
        === questions.length - 1
    ) {

        nextBtn.textContent =
            "Submit Quiz";

    }

    else {

        nextBtn.textContent =
            "Next";

    }

}


/* ==========================================
   PROGRESS BAR
========================================== */

function updateProgress() {

    const progress =
        (
            (currentQuestionIndex + 1)
            / questions.length
        ) * 100;


    progressBar.style.width =
        `${progress}%`;

}


/* ==========================================
   CREATE QUESTION NUMBERS
========================================== */

function createQuestionNumbers() {

    questionNumbers.innerHTML = "";


    questions.forEach(
        (_, index) => {

            const button =
                document.createElement("button");


            button.classList.add(
                "question-number"
            );


            button.textContent =
                index + 1;


            button.addEventListener(
                "click",
                function () {

                    if (quizFinished) {
                        return;
                    }


                    currentQuestionIndex =
                        index;


                    loadQuestion();

                }
            );


            questionNumbers.appendChild(
                button
            );

        }
    );

}


/* ==========================================
   UPDATE QUESTION NUMBERS
========================================== */

function updateQuestionNumbers() {

    const buttons =
        document.querySelectorAll(
            ".question-number"
        );


    buttons.forEach(
        (button, index) => {

            button.classList.remove(
                "current",
                "answered"
            );


            if (
                index === currentQuestionIndex
            ) {

                button.classList.add(
                    "current"
                );

            }

            else if (
                userAnswers[index]
                !== null
            ) {

                button.classList.add(
                    "answered"
                );

            }


            button.disabled =
                quizFinished;

        }
    );

}


/* ==========================================
   TIMER
========================================== */

function startTimer() {

    clearInterval(
        timerInterval
    );


    updateTimerDisplay();


    timerInterval =
        setInterval(
            function () {

                if (quizFinished) {

                    clearInterval(
                        timerInterval
                    );

                    return;
                }


                timeRemaining--;


                updateTimerDisplay();


                if (
                    timeRemaining <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    submitQuiz("time");

                }

            },
            1000
        );

}


/* ==========================================
   TIMER DISPLAY
========================================== */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timeRemaining / 60
        );


    const seconds =
        timeRemaining % 60;


    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    if (
        timeRemaining <= 30
    ) {

        timerElement.style.color =
            "#dc2626";

        timerElement.style.background =
            "#fee2e2";

    }

}


/* =====================================================
                    SUBMIT QUIZ
===================================================== */

function submitQuiz(reason) {

    if (quizFinished) {
        return;
    }


    quizFinished = true;

    quizStarted = false;


    clearInterval(
        timerInterval
    );


    /* ==========================================
       CALCULATE SCORE
    ========================================== */

    let score = 0;


    questions.forEach(
        (question, index) => {

            if (
                userAnswers[index]
                === question.answer
            ) {

                score++;

            }

        }
    );


    /* ==========================================
       SAVE RESULT
    ========================================== */

    saveResult(
        reason,
        score
    );


    /* Disable navigation */

    previousBtn.disabled = true;

    nextBtn.disabled = true;


    const buttons =
        document.querySelectorAll(
            ".question-number"
        );


    buttons.forEach(
        function (button) {

            button.disabled = true;

        }
    );


    /* Disable answers */

    const answerInputs =
        document.querySelectorAll(
            'input[name="answer"]'
        );


    answerInputs.forEach(
        function (input) {

            input.disabled = true;

        }
    );


    /* Show submitted screen */

    quizScreen.classList.add(
        "hidden"
    );


    submittedScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
                    SAVE RESULT
===================================================== */

function saveResult(
    reason,
    score
) {

    const existingResults =
        JSON.parse(
            localStorage.getItem(
                "quizResults"
            )
        ) || [];


    const result = {

        id:
            Date.now(),

        studentName:
            studentName,

        score:
            score,

        total:
            questions.length,

        reason:
            reason,

        submittedAt:
            new Date().toLocaleString(),


        /* ==========================================
           ANTI-CHEAT RESULT
        ========================================== */

        antiCheat: {

            violationCount:
                violationCount,

            violations:
                antiCheatViolations,

            flagged:
                violationCount > 0,

            autoSubmitted:
                violationCount >= MAX_VIOLATIONS

        }

    };


    existingResults.push(
        result
    );


    localStorage.setItem(
        "quizResults",
        JSON.stringify(
            existingResults
        )
    );

}

