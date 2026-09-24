/* =====================================================
                  ANTI-CHEAT SYSTEM
===================================================== */


/* ==========================================
   ANTI-CHEAT CONTROL
========================================== */

let lastFocusViolationTime = 0;

const FOCUS_VIOLATION_COOLDOWN = 1500;

let warningOpen = false;


/* ==========================================
   RECORD VIOLATION
========================================== */

function recordAntiCheatViolation(reason) {

    if (
        !quizStarted ||
        quizFinished ||
        warningOpen
    ) {
        return;
    }


    violationCount++;


    const violation = {

        reason: reason,

        count: violationCount,

        time: new Date().toISOString()

    };


    antiCheatViolations.push(
        violation
    );


    console.warn(
        "ANTI-CHEAT VIOLATION:",
        violation
    );


    /* ==========================================
       THIRD VIOLATION = SUBMIT
    ========================================== */

    if (
        violationCount >= MAX_VIOLATIONS
    ) {

        warningOpen = true;


        alert(
            "Maximum cheating violations reached.\n\n" +
            "Violation " +
            violationCount +
            " of " +
            MAX_VIOLATIONS +
            ".\n\n" +
            "Your quiz will now be submitted."
        );


        warningOpen = false;


        submitQuiz(
            "anti-cheat"
        );


        return;
    }


    /* ==========================================
       FIRST / SECOND VIOLATION = WARNING
    ========================================== */

    warningOpen = true;


    alert(
        "Warning!\n\n" +
        reason +
        "\n\n" +
        "Violation " +
        violationCount +
        " of " +
        MAX_VIOLATIONS +
        ".\n\n" +
        "Your quiz will be submitted on the 3rd violation."
    );


    /*
       Keep protection active briefly after
       alert closes so alert/focus events
       do not become another violation.
    */

    setTimeout(
        function () {

            warningOpen = false;

        },
        300
    );

}


/* ==========================================
   FOCUS / TAB VIOLATION
========================================== */

function recordFocusViolation(reason) {

    if (
        !quizStarted ||
        quizFinished ||
        warningOpen
    ) {
        return;
    }


    const now = Date.now();


    /*
       blur + visibilitychange can fire together.

       Treat both as ONE violation.
    */

    if (
        now - lastFocusViolationTime <
        FOCUS_VIOLATION_COOLDOWN
    ) {

        return;

    }


    lastFocusViolationTime = now;


    recordAntiCheatViolation(
        reason
    );

}


/* ==========================================
   TAB SWITCH DETECTION
========================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            quizStarted &&
            !quizFinished &&
            document.hidden
        ) {

            recordFocusViolation(
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

            recordFocusViolation(
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
                "Cutting is not allowed during the quiz."
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

   IMPORTANT:

   Ctrl+C
   Ctrl+V
   Ctrl+X

   are NOT handled here anymore because
   copy/cut/paste listeners already detect them.
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !quizStarted ||
            quizFinished ||
            warningOpen
        ) {

            return;

        }


        const key =
            event.key.toLowerCase();


        /* ==========================================
           CTRL + U
        ========================================== */

        if (
            event.ctrlKey &&
            key === "u"
        ) {

            event.preventDefault();


            /*
               Prevent resulting browser focus
               change from becoming another violation.
            */

            lastFocusViolationTime =
                Date.now();


            recordAntiCheatViolation(
                "View-source shortcut detected."
            );


            return;

        }


        /* ==========================================
           F12
        ========================================== */

        if (
            event.key === "F12"
        ) {

            event.preventDefault();


            lastFocusViolationTime =
                Date.now();


            recordAntiCheatViolation(
                "Developer tools shortcut detected."
            );


            return;

        }


        /* ==========================================
           CTRL + SHIFT + I
        ========================================== */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "i"
        ) {

            event.preventDefault();


            lastFocusViolationTime =
                Date.now();


            recordAntiCheatViolation(
                "Developer tools shortcut detected."
            );


            return;

        }


        /* ==========================================
           CTRL + SHIFT + J
        ========================================== */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "j"
        ) {

            event.preventDefault();


            lastFocusViolationTime =
                Date.now();


            recordAntiCheatViolation(
                "Developer console shortcut detected."
            );


            return;

        }

    }
);