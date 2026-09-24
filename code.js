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


    /*
        Name is required.
    */

    if (studentName === "") {

        alert("Please enter your name.");

        return;
    }


    /*
        Reset quiz values.
    */

    currentQuestionIndex = 0;

    userAnswers =
        new Array(questions.length).fill(null);

    timeRemaining = 5 * 60;

    quizStarted = true;

    quizFinished = false;


    /*
        Reset anti-cheat values.
    */

    violationCount = 0;

    antiCheatViolations = [];


    /*
        Reset timer color.
    */

    timerElement.style.color = "#2563eb";

    timerElement.style.background = "#eff6ff";


    /*
        Change screens.
    */

    startScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");


    /*
        Set total questions.
    */

    totalQuestionsElement.textContent =
        questions.length;


    /*
        Create question navigation.
    */

    createQuestionNumbers();


    /*
        Load first question.
    */

    loadQuestion();


    /*
        Start timer.
    */

    startTimer();

});


/* ==========================================
   LOAD QUESTION
========================================== */

function loadQuestion() {

    /*
        Don't load anything after submission.
    */

    if (quizFinished) {
        return;
    }


    const question =
        questions[currentQuestionIndex];


    /*
        Question number.
    */

    currentQuestionElement.textContent =
        currentQuestionIndex + 1;


    /*
        Question badge.
    */

    questionBadge.textContent =
        `Question ${currentQuestionIndex + 1}`;


    /*
        Question text.
    */

    questionText.textContent =
        question.question;


    /*
        Clear old options.
    */

    optionsContainer.innerHTML = "";


    /*
        Create options.
    */

    question.options.forEach(
        (option, index) => {

            const label =
                document.createElement("label");


            label.classList.add("option");


            /*
                Highlight selected option.
            */

            if (
                userAnswers[currentQuestionIndex]
                === index
            ) {

                label.classList.add("selected");

            }


            /*
                Create option structure.
            */

            label.innerHTML = `

                <input
                    type="radio"
                    name="answer"
                    value="${index}"
                >

                <span class="option-label"></span>

            `;


            /*
                Get radio input.
            */

            const radio =
                label.querySelector(
                    'input[type="radio"]'
                );


            /*
                Restore previous answer.
            */

            if (
                userAnswers[currentQuestionIndex]
                === index
            ) {

                radio.checked = true;

            }


            /*
                Display option as TEXT.
            */

            const optionLabel =
                label.querySelector(
                    ".option-label"
                );


            optionLabel.textContent =
                option;


            /*
                Select answer when option is clicked.
            */

            label.addEventListener(
                "click",
                function () {

                    if (quizFinished) {
                        return;
                    }

                    selectAnswer(index);

                }
            );


            /*
                Add option to page.
            */

            optionsContainer.appendChild(
                label
            );

        }
    );


    /*
        Update navigation.
    */

    updateNavigation();


    /*
        Update progress.
    */

    updateProgress();


    /*
        Update question numbers.
    */

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


    /*
        Reload question to show
        selected option.
    */

    loadQuestion();

}


/* ==========================================
   CHECK CURRENT QUESTION
========================================== */

function isCurrentQuestionAnswered() {

    return (
        userAnswers[currentQuestionIndex]
        !== null
    );

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


        /*
            Current question must be answered.
        */

        if (!isCurrentQuestionAnswered()) {

            alert(
                "Please select an answer before continuing."
            );

            return;
        }


        /*
            Move to next question.
        */

        if (
            currentQuestionIndex
            < questions.length - 1
        ) {

            currentQuestionIndex++;

            loadQuestion();

        }

        /*
            Last question:
            Submit quiz.
        */

        else {

            submitQuiz();

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


    /*
        Disable Previous on first question.
    */

    previousBtn.disabled =
        currentQuestionIndex === 0;


    /*
        Change button text on last question.
    */

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


            /*
                Question number click.
            */

            button.addEventListener(
                "click",
                function () {

                    if (quizFinished) {
                        return;
                    }


                    /*
                        If user tries to skip
                        an unanswered question,
                        stop them.
                    */

                    if (
                        index > currentQuestionIndex
                        &&
                        !isCurrentQuestionAnswered()
                    ) {

                        alert(
                            "Please answer the current question first."
                        );

                        return;
                    }


                    /*
                        Move to selected question.
                    */

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


            /*
                Current question.
            */

            if (
                index === currentQuestionIndex
            ) {

                button.classList.add(
                    "current"
                );

            }


            /*
                Answered question.
            */

            else if (
                userAnswers[index]
                !== null
            ) {

                button.classList.add(
                    "answered"
                );

            }


            /*
                Disable after submission.
            */

            button.disabled =
                quizFinished;

        }
    );

}


/* ==========================================
   TIMER
========================================== */

function startTimer() {

    /*
        Clear previous timer.
    */

    clearInterval(
        timerInterval
    );


    updateTimerDisplay();


    timerInterval =
        setInterval(
            function () {

                /*
                    Stop if quiz finished.
                */

                if (quizFinished) {

                    clearInterval(
                        timerInterval
                    );

                    return;
                }


                timeRemaining--;


                updateTimerDisplay();


                /*
                    Automatically submit
                    when time ends.
                */

                if (
                    timeRemaining <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    submitQuiz();

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


    /*
        Last 30 seconds:
        timer becomes red.
    */

    if (
        timeRemaining <= 30
    ) {

        timerElement.style.color =
            "#dc2626";

        timerElement.style.background =
            "#fee2e2";

    }

}


/* ==========================================
   SUBMIT QUIZ
========================================== */

function submitQuiz() {

    /*
        Prevent duplicate submission.
    */

    if (quizFinished) {
        return;
    }


    /*
        IMPORTANT:
        If anti-cheat forced the submission,
        we don't require all questions
        to be answered.
    */

    const forcedByAntiCheat =
        violationCount >= MAX_VIOLATIONS;


    /*
        Normal manual submission:
        all questions must be answered.
    */

    if (!forcedByAntiCheat) {

        const unansweredIndex =
            userAnswers.findIndex(
                answer => answer === null
            );


        if (unansweredIndex !== -1) {

            /*
                Go to unanswered question.
            */

            currentQuestionIndex =
                unansweredIndex;


            loadQuestion();


            alert(
                `Please answer Question ${unansweredIndex + 1} before submitting.`
            );


            return;
        }

    }


    /*
        Mark quiz as finished.
    */

    quizFinished = true;

    quizStarted = false;


    /*
        Stop timer.
    */

    clearInterval(
        timerInterval
    );


    /*
        Save answers and anti-cheat data.
    */

    saveAnswers();


    /*
        Disable navigation.
    */

    previousBtn.disabled = true;

    nextBtn.disabled = true;


    /*
        Disable question number buttons.
    */

    const buttons =
        document.querySelectorAll(
            ".question-number"
        );


    buttons.forEach(
        function (button) {

            button.disabled = true;

        }
    );


    /*
        Disable answer inputs.
    */

    const answerInputs =
        document.querySelectorAll(
            'input[name="answer"]'
        );


    answerInputs.forEach(
        function (input) {

            input.disabled = true;

        }
    );


    /*
        Hide quiz screen.
    */

    quizScreen.classList.add(
        "hidden"
    );


    /*
        Show submitted screen.
        NO SCORE IS DISPLAYED.
    */

    submittedScreen.classList.remove(
        "hidden"
    );

}


/* ==========================================
   SAVE ANSWERS
========================================== */

function saveAnswers() {

    /*
        Get existing submissions.
    */

    const existingSubmissions =
        JSON.parse(
            localStorage.getItem(
                "quizSubmissions"
            )
        ) || [];


    /*
        Create submission object.
    */

    const submission = {

        id:
            Date.now(),

        studentName:
            studentName,

        answers:
            userAnswers,

        totalQuestions:
            questions.length,

        submittedAt:
            new Date().toISOString(),

        /*
            Anti-cheat information
        */

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


    /*
        Add submission.
    */

    existingSubmissions.push(
        submission
    );


    /*
        Save answers and
        anti-cheat information.
    */

    localStorage.setItem(
        "quizSubmissions",
        JSON.stringify(
            existingSubmissions
        )
    );

}


/* =====================================================
   =====================================================
                    ANTI-CHEAT SYSTEM
   =====================================================
===================================================== */


/* ==========================================
   RECORD ANTI-CHEAT VIOLATION
========================================== */

function recordAntiCheatViolation(reason) {

    /*
        Anti-cheat sirf quiz ke waqt chalega.
    */

    if (!quizStarted || quizFinished) {
        return;
    }


    violationCount++;


    /*
        Save violation details.
    */

    const violation = {

        reason:
            reason,

        count:
            violationCount,

        time:
            new Date().toISOString()

    };


    antiCheatViolations.push(
        violation
    );


    console.warn(
        "ANTI-CHEAT VIOLATION:",
        violation
    );


    /*
        Maximum violations reached.
    */

    if (
        violationCount >= MAX_VIOLATIONS
    ) {

        alert(
            "Maximum cheating violations reached.\n\n" +
            "Your quiz will be submitted."
        );


        /*
            Submit after warning.
        */

        submitQuiz();

        return;
    }


    /*
        Normal warning.
    */

    alert(
        "Warning!\n\n" +
        reason +
        "\n\n" +
        "Violation " +
        violationCount +
        " of " +
        MAX_VIOLATIONS
    );

}


/* ==========================================
   TAB SWITCH DETECTION
========================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        /*
            Only detect while quiz is running.
        */

        if (
            quizStarted &&
            !quizFinished &&
            document.hidden
        ) {

            recordAntiCheatViolation(
                "You switched to another tab or left the quiz."
            );

        }

    }
);


/* ==========================================
   WINDOW FOCUS DETECTION
========================================== */

window.addEventListener(
    "blur",
    function () {

        if (
            quizStarted &&
            !quizFinished
        ) {

            recordAntiCheatViolation(
                "Quiz window lost focus."
            );

        }

    }
);


/* ==========================================
   COPY PROTECTION
========================================== */

document.addEventListener(
    "copy",
    function (event) {

        if (
            quizStarted &&
            !quizFinished
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Copying is not allowed during the quiz."
            );

        }

    }
);


/* ==========================================
   CUT PROTECTION
========================================== */

document.addEventListener(
    "cut",
    function (event) {

        if (
            quizStarted &&
            !quizFinished
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Cutting text is not allowed during the quiz."
            );

        }

    }
);


/* ==========================================
   PASTE PROTECTION
========================================== */

document.addEventListener(
    "paste",
    function (event) {

        if (
            quizStarted &&
            !quizFinished
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Pasting is not allowed during the quiz."
            );

        }

    }
);


/* ==========================================
   RIGHT CLICK PROTECTION
========================================== */

document.addEventListener(
    "contextmenu",
    function (event) {

        if (
            quizStarted &&
            !quizFinished
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Right-click is not allowed during the quiz."
            );

        }

    }
);


/* ==========================================
   TEXT SELECTION PROTECTION
========================================== */

document.addEventListener(
    "selectstart",
    function (event) {

        if (
            quizStarted &&
            !quizFinished
        ) {

            event.preventDefault();

        }

    }
);


/* ==========================================
   KEYBOARD PROTECTION
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !quizStarted ||
            quizFinished
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        /*
            Ctrl + C
        */

        if (
            event.ctrlKey &&
            key === "c"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Copy shortcut detected."
            );

            return;
        }


        /*
            Ctrl + V
        */

        if (
            event.ctrlKey &&
            key === "v"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Paste shortcut detected."
            );

            return;
        }


        /*
            Ctrl + X
        */

        if (
            event.ctrlKey &&
            key === "x"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Cut shortcut detected."
            );

            return;
        }


        /*
            Ctrl + U
        */

        if (
            event.ctrlKey &&
            key === "u"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "View-source shortcut detected."
            );

            return;
        }


        /*
            F12
        */

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Developer tools shortcut detected."
            );

            return;
        }


        /*
            Ctrl + Shift + I
        */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "i"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Developer tools shortcut detected."
            );

            return;
        }


        /*
            Ctrl + Shift + J
        */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "j"
        ) {

            event.preventDefault();

            recordAntiCheatViolation(
                "Developer console shortcut detected."
            );

            return;
        }

    }
);