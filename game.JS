/* =================================================
   감독생 만보기
   ================================================= */


/* =================================================
   기본 상태
   ================================================= */

var steps = 0;

var currentStep = 0;

var currentDialogueIndex = 0;


/*
   현재 대화 종류

   normal = 일반 대화
   idle   = 가만히 있을 때
   shake  = 폰 흔들기
*/

var dialogueMode = "normal";


/* =================================================
   DOM
   ================================================= */

var stepsElement =
    document.getElementById("steps");

var messageElement =
    document.getElementById("message");

var characterImage =
    document.getElementById("characterImage");

var dialogueBox =
    document.getElementById("dialogueBox");


/* =================================================
   캐릭터 기본 표정
   ================================================= */

var defaultEmotion = 5;


/* =================================================
   idle
   ================================================= */

var idleTimer = null;

var idleIndex = 0;


/* =================================================
   흔들기
   ================================================= */

var shakeCount = 0;

var shakeStartTime = 0;

var shakeLastTime = 0;

var shakeCooldownUntil = 0;


/*
   이전에 비교적 잘 작동했던 기준을 유지.
*/

var shakeRequiredCount = 4;


/*
   너무 작은 움직임은 무시.
*/

var shakeThreshold = 5.5;


/*
   센서 중복 방지.
*/

var shakeMinInterval = 180;


/*
   흔들기 시작 후 5초 안에
   필요한 횟수를 채워야 함.
*/

var shakeWindow = 5000;


/*
   이벤트가 끝난 뒤 잠시 대기.
*/

var shakeCooldown = 3000;


/*
   이전 센서값.
*/

var previousShakeMagnitude = null;


/* =================================================
   걸음 감지
   ================================================= */

var lastStepTime = 0;


/* =================================================
   오디오
   ================================================= */

var audioContext = null;


/* =================================================
   오디오 활성화
   ================================================= */

function unlockAudio() {

    if (
        audioContext === null
    ) {

        var AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            return;

        }


        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

}


/* =================================================
   띠링띠링
   ================================================= */

function playDialogueSound() {

    if (
        audioContext === null
    ) {

        return;

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    var now =
        audioContext.currentTime;


    var oscillator1 =
        audioContext.createOscillator();

    var gain1 =
        audioContext.createGain();


    oscillator1.type =
        "sine";


    oscillator1.frequency.setValueAtTime(
        880,
        now
    );


    gain1.gain.setValueAtTime(
        0.0001,
        now
    );


    gain1.gain.exponentialRampToValueAtTime(
        0.12,
        now + 0.01
    );


    gain1.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.13
    );


    oscillator1.connect(gain1);

    gain1.connect(
        audioContext.destination
    );


    oscillator1.start(now);

    oscillator1.stop(
        now + 0.14
    );


    var oscillator2 =
        audioContext.createOscillator();

    var gain2 =
        audioContext.createGain();


    oscillator2.type =
        "sine";


    oscillator2.frequency.setValueAtTime(
        1174.66,
        now + 0.10
    );


    gain2.gain.setValueAtTime(
        0.0001,
        now + 0.10
    );


    gain2.gain.exponentialRampToValueAtTime(
        0.12,
        now + 0.11
    );


    gain2.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.24
    );


    oscillator2.connect(gain2);

    gain2.connect(
        audioContext.destination
    );


    oscillator2.start(
        now + 0.10
    );

    oscillator2.stop(
        now + 0.25
    );

}


/* =================================================
   일반 대사
   ================================================= */

var dialogues = {


    0: [

        {
            text:
                "너 말이야, 마법도 못 쓰면서 체력까지 없으면 어쩌려고 그래?",
            emotion: 1
        },

        {
            text:
                "내가 제대로 봐주지 않으면 안 되겠네.",
            emotion: 2
        },

        {
            text:
                "뭐야, 그렇게 빤히 보면 내가 계속 말해줘야 할 것 같잖아.",
            emotion: 3
        },

        {
            text:
                "잔말 말고 걸어. 감독생!",
            emotion: 1
        },

        {
            text:
                "자, 가자고.",
            emotion: 5
        }

    ],


    50: [

        {
            text:
                "50보 걸어놓고 칭찬 같은 거 바라는 건 아니지?",
            emotion: 8
        },

        {
            text:
                "집에서 걸어도 이것보다 더 나오겠다.",
            emotion: 3
        }

    ],


    100: [

        {
            text:
                "출발은 좋네~",
            emotion: 6
        },

        {
            text:
                "그래도 이제 100보니까, 앞으로 9900걸음만 걸으면 되겠네!",
            emotion: 2
        },

        {
            text:
                "설마 벌써 지친 건 아니지?",
            emotion: 8
        }

    ],


    500: [

        {
            text:
                "지금 500걸음 걷고 나 보는 거야?",
            emotion: 1
        },

        {
            text:
                "... 아니, 이 정도면 기본으로 해야 하는 거잖아?!",
            emotion: 4
        },

        {
            text:
                "당연히 더 걸어야지.",
            emotion: 3
        },

        {
            text:
                "특히 너는 체력 좀 키워야 돼.",
            emotion: 3
        }

    ],


    1000: [

        {
            text:
                "이제 1000걸음이라...",
            emotion: 7
        },

        {
            text:
                "감독생도 하면 잘 하잖아~",
            emotion: 6
        },

        {
            text:
                "그치만 난 아직 땀 한 방울도 안 흘렸거든?",
            emotion: 5
        },

        {
            text:
                "열심히 뛰라고.",
            emotion: 2
        }

    ],


    2500: [

        {
            text:
                "와, 솔직히 슬슬 말하기 귀찮은데~ 자도 돼?",
            emotion: 6
        },

        {
            text:
                "...",
            emotion: 7
        },

        {
            text:
                "알았어, 알겠으니까! 그렇게 절망하지 마.",
            emotion: 3
        },

        {
            text:
                "여기 있으면 되는 거지?",
            emotion: 8
        }

    ],


    5000: [

        {
            text:
                "숨 찼어? 아까보다 속도가 느려진 것 같은데.",
            emotion: 7
        },

        {
            text:
                "어쩔 수 없네, 좀 느긋하게 걸어도 괜찮으니까 천천히 해.",
            emotion: 1
        }

    ],


    10000: [

        {
            text:
                "정말 만보 채웠네, 솔직히 중간에 포기할 줄 알았는데 말이야.",
            emotion: 2
        },

        {
            text:
                "흐음~ 제법이잖아, 감독생.",
            emotion: 8
        },

        {
            text:
                "내일도 네가 할지는 잘 모르겠지만, 응원은 할 테니까.",
            emotion: 5
        },

        {
            text:
                "수고했어.",
            emotion: 6
        }

    ]

};


/* =================================================
   idle 대사
   ================================================= */


/*
   이 부분은 절대로 일반 대사와 섞지 않는다.

   30초 후
   1 -> 2 -> 3 -> 4 -> 5
   순서대로만 진행.
*/

var idleDialogues = [

    {
        text:
            "슬슬 일어나, 언제까지 늘어져 있을 거야?",
        emotion: 1
    },

    {
        text:
            "내가 계속 응원... 아니, 응원이라고 해야 하나.",
        emotion: 7
    },

    {
        text:
            "곁에 있을 테니까.",
        emotion: 5
    },

    {
        text:
            "그래도 이제는 일어나야지.",
        emotion: 1
    },

    {
        text:
            "일어나!",
        emotion: 4
    }

];


/* =================================================
   흔들기 대사
   ================================================= */

var shakeDialogues = [

    {
        text:
            "... 너 뭐하냐?",
        emotion: 4
    },

    {
        text:
            "지금 안 걷고 있지? 어?",
        emotion: 1
    },

    {
        text:
            "잔머리 쓰지 말고 똑바로 걸으라고!",
        emotion: 4
    }

];


/* =================================================
   마일스톤
   ================================================= */

var milestones = [

    0,
    50,
    100,
    500,
    1000,
    2500,
    5000,
    10000

];


/* =================================================
   걸음 수 표시
   ================================================= */

function updateStepDisplay() {

    stepsElement.textContent =
        steps + "보";

}


/* =================================================
   현재 마일스톤
   ================================================= */

function getCurrentMilestone() {

    var result = 0;


    for (
        var i = 0;
        i < milestones.length;
        i++
    ) {

        if (
            steps >= milestones[i]
        ) {

            result =
                milestones[i];

        }

    }


    return result;

}


/* =================================================
   idle 타이머 제거
   ================================================= */

function clearIdleTimer() {

    if (
        idleTimer !== null
    ) {

        clearTimeout(
            idleTimer
        );

        idleTimer =
            null;

    }

}


/* =================================================
   표정 기본값
   ================================================= */

function resetCharacterEmotion() {

    characterImage.src =
        "images/5.png";

}


/* =================================================
   일반 대화 시작
   ================================================= */

function startDialogue(step) {

    if (
        !dialogues[step]
    ) {

        return;

    }


    clearIdleTimer();


    dialogueMode =
        "normal";


    currentStep =
        step;


    currentDialogueIndex =
        0;


    resetShake();


    showNormalDialogue();

}


/* =================================================
   일반 대사 표시
   ================================================= */

function showNormalDialogue() {

    var lines =
        dialogues[currentStep];


    if (!lines) {

        return;

    }


    var dialogue =
        lines[currentDialogueIndex];


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
   일반 대사 다음
   ================================================= */

function nextNormalDialogue() {

    if (
        dialogueMode !== "normal"
    ) {

        return;

    }


    var lines =
        dialogues[currentStep];


    if (!lines) {

        return;

    }


    if (
        currentDialogueIndex <
        lines.length - 1
    ) {

        currentDialogueIndex++;

        showNormalDialogue();

        return;

    }


    /*
       일반 대사 끝
    */

    resetCharacterEmotion();


    resetIdleTimer();

}


/* =================================================
   idle 시작
   ================================================= */

function startIdleDialogue() {

    /*
       만보 이후에는 idle 금지
    */

    if (
        steps >= 10000
    ) {

        return;

    }


    clearIdleTimer();


    dialogueMode =
        "idle";


    idleIndex =
        0;


    showIdleDialogue();

}


/* =================================================
   idle 표시
   ================================================= */

function showIdleDialogue() {

    /*
       idle 배열의 현재 한 줄만 표시.
    */

    var dialogue =
        idleDialogues[idleIndex];


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
   idle 다음
   ================================================= */

function nextIdleDialogue() {

    if (
        dialogueMode !== "idle"
    ) {

        return;

    }


    /*
       다음 한 줄만.
    */

    if (
        idleIndex <
        idleDialogues.length - 1
    ) {

        idleIndex++;

        showIdleDialogue();

        return;

    }


    /*
       idle 대사가 전부 끝남
    */

    idleIndex =
        0;


    dialogueMode =
        "normal";


    resetCharacterEmotion();


    resetIdleTimer();

}


/* =================================================
   idle 타이머
   ================================================= */

function resetIdleTimer() {

    clearIdleTimer();


    if (
        steps >= 10000
    ) {

        return;

    }


    /*
       normal 상태에서만 타이머 작동
    */

    if (
        dialogueMode !== "normal"
    ) {

        return;

    }


    idleTimer =
        setTimeout(
            function() {

                /*
                   타이머가 끝난 순간에도
                   normal일 때만 실행.
                */

                if (
                    dialogueMode === "normal"
                ) {

                    startIdleDialogue();

                }

            },
            30000
        );

}


/* =================================================
   흔들기 초기화
   ================================================= */

function resetShake() {

    shakeCount =
        0;

    shakeStartTime =
        0;

    previousShakeMagnitude =
        null;

}


/* =================================================
   흔들기 이벤트 시작
   ================================================= */

function startShakeDialogue() {

    /*
       일반 대화 중간에는 절대 끼어들지 않음.
    */

    if (
        dialogueMode !== "normal"
    ) {

        return;

    }


    var lines =
        dialogues[currentStep];


    /*
       현재 일반 대사를 아직 다 안 읽었다면
       흔들기 이벤트 금지.
    */

    if (
        lines &&
        currentDialogueIndex <
        lines.length - 1
    ) {

        resetShake();

        return;

    }


    clearIdleTimer();


    dialogueMode =
        "shake";


    shakeDialogueIndex =
        0;


    resetShake();


    showShakeDialogue();

}


/* =================================================
   흔들기 표시
   ================================================= */

var shakeDialogueIndex = 0;


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
   흔들기 다음
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


    shakeDialogueIndex =
        0;


    dialogueMode =
        "normal";


    resetCharacterEmotion();


    resetIdleTimer();

}


/* =================================================
   걸음 추가
   ================================================= */

function addSteps(amount) {

    var oldMilestone =
        getCurrentMilestone();


    steps += amount;


    if (
        steps > 10000
    ) {

        steps =
            10000;

    }


    updateStepDisplay();


    /*
       걷기 시작하면 idle 대화 종료
    */

    if (
        dialogueMode === "idle"
    ) {

        dialogueMode =
            "normal";


        idleIndex =
            0;


        resetCharacterEmotion();

    }


    /*
       걷는 동안 흔들기 카운트 제거.
    */

    resetShake();


    var newMilestone =
        getCurrentMilestone();


    if (
        newMilestone !== oldMilestone
    ) {

        startDialogue(
            newMilestone
        );

        return;

    }


    resetIdleTimer();

}


/* =================================================
   걸음 센서
   ================================================= */

function detectStep(event) {

    var acceleration =
        event.accelerationIncludingGravity;


    if (!acceleration) {

        return;

    }


    var x =
        acceleration.x || 0;

    var y =
        acceleration.y || 0;

    var z =
        acceleration.z || 0;


    var magnitude =
        Math.sqrt(
            x * x +
            y * y +
            z * z
        );


    var now =
        new Date().getTime();


    if (
        now - lastStepTime <
        350
    ) {

        return;

    }


    if (
        magnitude > 11
    ) {

        lastStepTime =
            now;


        addSteps(1);

    }

}


/* =================================================
   흔들기 센서
   ================================================= */

function detectShake(event) {

    /*
       idle 중에는 흔들기 이벤트 금지.
    */

    if (
        dialogueMode !== "normal"
    ) {

        resetShake();

        return;

    }


    /*
       일반 대사가 끝나기 전에는
       흔들기 이벤트 금지.
    */

    var lines =
        dialogues[currentStep];


    if (
        lines &&
        currentDialogueIndex <
        lines.length - 1
    ) {

        resetShake();

        return;

    }


    /*
       가능한 경우
       중력 제거 acceleration 사용.
    */

    var acceleration =
        event.acceleration;


    /*
       acceleration을 지원하지 않는 기기에서는
       이번 흔들기 감지를 하지 않는다.
    */

    if (!acceleration) {

        return;

    }


    var x =
        acceleration.x || 0;

    var y =
        acceleration.y || 0;

    var z =
        acceleration.z || 0;


    /*
       실제 가속도의 크기
    */

    var magnitude =
        Math.sqrt(
            x * x +
            y * y +
            z * z
        );


    var now =
        new Date().getTime();


    /*
       쿨다운
    */

    if (
        now <
        shakeCooldownUntil
    ) {

        return;

    }


    /*
       이전 값이 없다면 저장만.
    */

    if (
        previousShakeMagnitude === null
    ) {

        previousShakeMagnitude =
            magnitude;

        return;

    }


    /*
       이전 값과 현재 값의 차이.
    */

    var change =
        Math.abs(
            magnitude -
            previousShakeMagnitude
        );


    previousShakeMagnitude =
        magnitude;


    /*
       작은 변화 무시.
    */

    if (
        change <
        shakeThreshold
    ) {

        return;

    }


    /*
       센서 중복 방지.
    */

    if (
        now - shakeLastTime <
        shakeMinInterval
    ) {

        return;

    }


    shakeLastTime =
        now;


    /*
       첫 흔들기
    */

    if (
        shakeStartTime === 0
    ) {

        shakeStartTime =
            now;

        shakeCount =
            0;

    }


    /*
       너무 오래 걸리면 초기화.
    */

    if (
        now - shakeStartTime >
        shakeWindow
    ) {

        shakeStartTime =
            now;

        shakeCount =
            0;

    }


    shakeCount++;


    console.log(
        "흔들기:",
        shakeCount,
        "/",
        shakeRequiredCount
    );


    /*
       4회 성공
    */

    if (
        shakeCount >=
        shakeRequiredCount
    ) {

        shakeCount =
            0;

        shakeStartTime =
            0;

        shakeCooldownUntil =
            now +
            shakeCooldown;

        previousShakeMagnitude =
            null;


        startShakeDialogue();

    }

}


/* =================================================
   센서 시작
   ================================================= */

function startMotionSensor() {

    window.addEventListener(
        "devicemotion",
        detectStep
    );


    window.addEventListener(
        "devicemotion",
        detectShake
    );

}


/* =================================================
   iPhone 센서 권한
   ================================================= */

if (
    typeof DeviceMotionEvent !==
    "undefined"
) {

    if (
        typeof DeviceMotionEvent.requestPermission ===
        "function"
    ) {

        document.body.addEventListener(
            "click",
            function motionPermission() {

                unlockAudio();


                DeviceMotionEvent
                    .requestPermission()
                    .then(
                        function(permission) {

                            if (
                                permission ===
                                "granted"
                            ) {

                                startMotionSensor();

                            }

                        }
                    )
                    .catch(
                        function(error) {

                            console.log(
                                error
                            );

                        }
                    );


                document.body.removeEventListener(
                    "click",
                    motionPermission
                );

            }
        );

    }

    else {

        document.body.addEventListener(
            "click",
            unlockAudio,
            {
                once: true
            }
        );


        startMotionSensor();

    }

}


/* =================================================
   화면 클릭
   ================================================= */

function handleDialogueClick() {

    unlockAudio();


    /*
       흔들기 대화
    */

    if (
        dialogueMode === "shake"
    ) {

        nextShakeDialogue();

        return;

    }


    /*
       idle 대화
    */

    if (
        dialogueMode === "idle"
    ) {

        nextIdleDialogue();

        return;

    }


    /*
       일반 대화
    */

    if (
        dialogueMode === "normal"
    ) {

        nextNormalDialogue();

        return;

    }

}


/* =================================================
   대화창 클릭 연결
   ================================================= */

if (
    dialogueBox
) {

    dialogueBox.onclick =
        handleDialogueClick;

}


/* =================================================
   시작
   ================================================= */

updateStepDisplay();


startDialogue(0);


resetIdleTimer();