/* =================================================
   흔들기 감지
   ================================================= */

/*
   흔들기 판정용 값

   한 번 크게 움직였다고 바로 발동하지 않고,
   짧은 시간 안에 여러 번 큰 변화가 발생했을 때
   흔들기로 판단한다.
*/

var shakeLastMagnitude = null;

var shakeChanges = [];

var shakeStartTime = 0;


/*
   흔들기 판정 시간

   이 시간 안에 여러 번 움직여야 함
*/

var shakeWindow = 1200;


/*
   이 값보다 변화량이 작으면
   흔들기로 보지 않음
*/

var shakeThreshold = 2.8;


/*
   이 횟수만큼 큰 변화가 발생하면
   흔들기 발동
*/

var shakeRequiredCount = 4;


/*
   흔들기 후 다시 발동하기까지의 시간
*/

var shakeCooldown = 3000;


/*
   마지막 흔들기 시간
*/

var lastShakeTime = 0;


/* =================================================
   흔들기 판정 함수
   ================================================= */

function detectShake(event) {

    var acceleration =
        event.accelerationIncludingGravity;

    if (!acceleration) {

        return;

    }


    /*
       대사가 진행 중이면
       흔들기 이벤트를 발생시키지 않음
    */

    if (
        dialogueMode === "shake" ||
        dialogueMode === "idle"
    ) {

        return;

    }


    /*
       일반 대화가 아직 끝나지 않았다면
       흔들기 판정 자체를 초기화
    */

    var lines =
        dialogues[currentStep];


    if (
        dialogueMode === "normal" &&
        lines &&
        currentDialogueIndex <
        lines.length - 1
    ) {

        shakeChanges = [];

        shakeStartTime = 0;

        shakeLastMagnitude = null;

        return;

    }


    var x =
        acceleration.x || 0;

    var y =
        acceleration.y || 0;

    var z =
        acceleration.z || 0;


    /*
       현재 움직임의 크기
    */

    var magnitude =
        Math.sqrt(
            x * x +
            y * y +
            z * z
        );


    /*
       첫 센서값 저장
    */

    if (
        shakeLastMagnitude === null
    ) {

        shakeLastMagnitude =
            magnitude;

        return;

    }


    /*
       이전 값과 현재 값의 차이
    */

    var change =
        Math.abs(
            magnitude -
            shakeLastMagnitude
        );


    shakeLastMagnitude =
        magnitude;


    /*
       작은 움직임은 무시
    */

    if (
        change <
        shakeThreshold
    ) {

        return;

    }


    var now =
        new Date().getTime();


    /*
       흔들기 쿨다운
    */

    if (
        now - lastShakeTime <
        shakeCooldown
    ) {

        return;

    }


    /*
       첫 번째 큰 움직임
    */

    if (
        shakeStartTime === 0
    ) {

        shakeStartTime =
            now;

        shakeChanges = [];

    }


    /*
       너무 오래 걸렸다면
       기존 기록을 버리고 다시 시작
    */

    if (
        now - shakeStartTime >
        shakeWindow
    ) {

        shakeStartTime =
            now;

        shakeChanges = [];

    }


    /*
       큰 움직임 하나 추가
    */

    shakeChanges.push(
        now
    );


    /*
       필요한 횟수만큼
       짧은 시간 안에 움직였으면 발동
    */

    if (
        shakeChanges.length >=
        shakeRequiredCount
    ) {

        lastShakeTime =
            now;

        shakeChanges = [];

        shakeStartTime =
            0;

        shakeLastMagnitude =
            null;

        startShakeDialogue();

    }

}


/* =================================================
   흔들기 대화 시작
   ================================================= */

function startShakeDialogue() {

    /*
       이미 다른 특별 대화 중이면
       실행하지 않음
    */

    if (
        dialogueMode === "shake" ||
        dialogueMode === "idle"
    ) {

        return;

    }


    /*
       일반 대사가 아직 끝나지 않았으면
       실행하지 않음
    */

    var lines =
        dialogues[currentStep];


    if (
        lines &&
        currentDialogueIndex <
        lines.length - 1
    ) {

        return;

    }


    clearIdleTimer();

    dialogueMode =
        "shake";

    shakeDialogueIndex =
        0;

    showShakeDialogue();

}


/* =================================================
   흔들기 대사 표시
   ================================================= */

function showShakeDialogue() {

    var dialogue =
        shakeDialogues[
            shakeDialogueIndex
        ];

    if (!dialogue) {

        return;

    }


    messageElement.textContent =
        dialogue.text;


    characterImage.src =
        "images/" +
        dialogue.emotion +
        ".png";


    playDialogueSound();

}


/* =================================================
   흔들기 대사 넘기기
   ================================================= */

function nextShakeDialogue() {

    if (
        dialogueMode !== "shake"
    ) {

        return;

    }


    if (
        shakeDialogueIndex <
        shakeDialogues.length - 1
    ) {

        shakeDialogueIndex++;

        showShakeDialogue();

        return;

    }


    dialogueMode =
        "normal";


    shakeDialogueIndex =
        0;


    resetCharacterEmotion();

    resetIdleTimer();

}