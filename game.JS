/* =================================================
   감독생 만보기
   ================================================= */


/* =================================================
   기본 변수
   ================================================= */

var steps = 0;

var currentStep = 0;

var currentDialogueIndex = 0;

var dialogueMode = "normal";

var idleTimer = null;

var idleIndex = 0;

var shakeDialogueIndex = 0;


/* 걸음 감지용 */

var lastStepTime = 0;


/* 흔들기 감지용 */

var shakeCount = 0;

var shakeStartTime = 0;

var shakeLastTime = 0;

var shakeCooldownUntil = 0;


/* =================================================
   설정
   ================================================= */


/*
   기본 표정
*/

var defaultEmotion = 5;


/*
   흔들기 몇 번 해야 하는가
*/

var shakeRequiredCount = 6;


/*
   흔들기라고 인정할 최소 변화량
*/

var shakeThreshold = 5.5;


/*
   흔들기 사이 최소 시간
*/

var shakeMinInterval = 180;


/*
   흔들기를 시작한 뒤
   이 시간 안에 필요한 횟수를 채워야 함
*/

var shakeWindow = 5000;


/*
   흔들기 이벤트가 발생한 뒤
   다시 감지하기까지 대기
*/

var shakeCooldown = 3500;


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


    /*
       첫 번째 음
    */

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


    /*
       두 번째 음
    */

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
   화면 요소
   ================================================= */

var stepsElement =
    document.getElementById("steps");


var messageElement =
    document.getElementById("message");


var characterImage =
    document.getElementById("characterImage");


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
                "... 뭐야, 내가 무슨 얘기를 더 해주길 바라는 것처럼 보고.",
            emotion: 3
        },

        {
            text:
                "그렇게 잡담만 하다간 해 다 진다?",
            emotion: 1
        },

        {
            text:
                "자, 잔말 말고 걸어. 감독생!",
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
                "집에서 걸어도 이것보다 더 나와.",
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
                "설마 9900걸음은 좀 아닌데~ 하고 들어갈 생각이라면 내 칭찬은 못 듣는걸로.",
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
                "... 아니, 이정도면 기본으로 해야하는 거잖아?!",
            emotion: 4
        },

        {
            text:
                "당연히 더 걸어야지.",
            emotion: 3
        },

        {
            text:
                "특히 너는 체력 좀 키워야돼.",
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
                "그치만 난 아직 땀 한방울도 안 흘렸거든?",
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
                "내일도 네가 할 지는 잘 모르겠지만, 응원은 할 테니까.",
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
   30초 후 idle 대사
   ================================================= */

var idleDialogues = [

    {
        text:
            "슬슬 일어나, 언제까지 늘어져 있을거야?",
        emotion: 1
    },

    {
        text:
            "내가 계속 응원... 아니, 응원이라고 해야하나.",
        emotion: 7
    },

    {
        text:
            "곁에 있을 테니까.",
        emotion: 5
    },

    {
        text:
            "슬슬 일어나, 언제까지 늘어져 있을거야?",
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
   걸음 수 표시
   ================================================= */

function updateStepDisplay() {

    stepsElement.textContent =
        steps + "보";

}


/* =================================================
   현재 마일스톤 확인
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
   기본 표정으로 복구
   ================================================= */

function resetCharacterEmotion() {

    characterImage.src =
        "images/" +
        defaultEmotion +
        ".png";

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


    /*
       새로운 일반 대사가 시작되면
       흔들기 카운트도 초기화
    */

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
   일반 대사 넘기기
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
       일반 대사가 끝남
    */

    resetCharacterEmotion();

    resetIdleTimer();

}


/* =================================================
   idle 대화 시작
   ================================================= */

function startIdleDialogue() {

    /*
       만보를 채웠으면
       idle 대사를 띄우지 않는다.
    */

    if (
        steps >= 10000
    ) {

        return;

    }


    clearIdleTimer();


    dialogueMode =
        "idle";


    /*
       idle은 항상 처음부터 시작
    */

    idleIndex =
        0;


    showIdleDialogue();

}


/* =================================================
   idle 대사 표시
   ================================================= */

function showIdleDialogue() {

    if (
        idleDialogues.length === 0
    ) {

        return;

    }


    if (
        idleIndex >=
        idleDialogues.length
    ) {

        idleIndex = 0;

    }


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
   idle 대사 넘기기
   ================================================= */

function nextIdleDialogue() {

    if (
        dialogueMode !== "idle"
    ) {

        return;

    }


    idleIndex++;


    /*
       아직 idle 대사가 남아 있음
    */

    if (
        idleIndex <
        idleDialogues.length
    ) {

        showIdleDialogue();

        return;

    }


    /*
       idle 대사가 모두 끝남
    */

    idleIndex =
        0;


    dialogueMode =
        "normal";


    resetCharacterEmotion();


    resetIdleTimer();

}


/* =================================================
   30초 idle 타이머
   ================================================= */

function resetIdleTimer() {

    clearIdleTimer();


    if (
        steps >= 10000
    ) {

        return;

    }


    if (
        dialogueMode !== "normal"
    ) {

        return;

    }


    idleTimer =
        setTimeout(
            function() {

                /*
                   타이머가 끝났을 때도
                   반드시 normal인지 확인
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
   흔들기 카운트 초기화
   ================================================= */

function resetShake() {

    shakeCount =
        0;

    shakeStartTime =
        0;

}


/* =================================================
   흔들기 이벤트 시작
   ================================================= */

function startShakeDialogue() {

    /*
       다른 대화 중에는 절대 끼어들지 않는다.
    */

    if (
        dialogueMode !== "normal"
    ) {

        return;

    }


    /*
       일반 대사가 아직 남아 있으면
       흔들기 이벤트를 발생시키지 않는다.
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


    clearIdleTimer();


    dialogueMode =
        "shake";


    shakeDialogueIndex =
        0;


    resetShake();


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


    /*
       흔들기 대사가 끝남
    */

    shakeDialogueIndex =
        0;


    dialogueMode =
        "normal";


    resetCharacterEmotion();


    resetIdleTimer();

}


/* =================================================
   걸음 수 추가
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
       걷기 시작하면 idle 대사를 종료
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
       걸음을 걸었다고 흔들기 이벤트가
       같이 발생하지 않도록 카운트 초기화
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


    /*
       일반 상태라면 다시
       30초 타이머 시작
    */

    if (
        dialogueMode === "normal"
    ) {

        resetIdleTimer();

    }

}


/* =================================================
   걸음 감지
   ================================================= */

function detectStep(event) {

    /*
       걸음 수는 기존처럼
       accelerationIncludingGravity 사용.
    */

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


    /*
       너무 빠르게 걸음이 중복되는 것 방지
    */

    if (
        now - lastStepTime <
        350
    ) {

        return;

    }


    /*
       기존 기준 유지
    */

    if (
        magnitude > 11
    ) {

        lastStepTime =
            now;


        addSteps(1);

    }

}


/* =================================================
   흔들기 감지
   ================================================= */

/*
   중요:
   accelerationIncludingGravity의
   절대값을 기준으로 잡지 않는다.

   가만히 있어도 중력 때문에 약 9.8이 나오므로
   그렇게 하면 가만히 있는 폰도 흔든 것으로
   오인할 수 있다.


   대신 센서값의 "변화량"을 본다.
*/


var previousShakeMagnitude = null;


/* =================================================
   흔들기 감지 함수
   ================================================= */

function detectShake(event) {

    /*
       idle / shake 대화 중에는
       흔들기 감지를 하지 않는다.
    */

    if (
        dialogueMode !== "normal"
    ) {

        resetShake();

        previousShakeMagnitude =
            null;

        return;

    }


    /*
       일반 대사가 아직 남아있다면
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

        previousShakeMagnitude =
            null;

        return;

    }


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


    /*
       현재 센서값의 크기
    */

    var magnitude =
        Math.sqrt(
            x * x +
            y * y +
            z * z
        );


    /*
       첫 번째 센서값이면
       비교할 값만 저장.
    */

    if (
        previousShakeMagnitude === null
    ) {

        previousShakeMagnitude =
            magnitude;

        return;

    }


    var change =
        Math.abs(
            magnitude -
            previousShakeMagnitude
        );


    previousShakeMagnitude =
        magnitude;


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
       변화량이 작으면
       그냥 일반적인 움직임으로 판단.
    */

    if (
        change <
        shakeThreshold
    ) {

        return;

    }


    /*
       너무 빠르게 들어오는 센서 이벤트는
       같은 흔들기의 일부로 취급.
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
       흔들기 시작 후 너무 오래 걸렸다면
       다시 처음부터.
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


    /*
       흔들기 1회 추가
    */

    shakeCount++;


    console.log(
        "흔들기:",
        shakeCount,
        "/",
        shakeRequiredCount
    );


    /*
       필요한 횟수 도달
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

    /*
       걸음 감지
    */

    window.addEventListener(
        "devicemotion",
        detectStep
    );


    /*
       흔들기 감지
    */

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

    /*
       iPhone / iPad
    */

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

    /*
       Android / 기타 브라우저
    */

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
   대화창 클릭
   ================================================= */

function handleDialogueClick() {

    unlockAudio();


    /*
       흔들기 대사
    */

    if (
        dialogueMode === "shake"
    ) {

        nextShakeDialogue();

        return;

    }


    /*
       idle 대사
    */

    if (
        dialogueMode === "idle"
    ) {

        nextIdleDialogue();

        return;

    }


    /*
       일반 대사
    */

    if (
        dialogueMode === "normal"
    ) {

        nextNormalDialogue();

        return;

    }

}


/* =================================================
   대화창 연결
   ================================================= */

var dialogueBox =
    document.getElementById(
        "dialogueBox"
    );


if (
    dialogueBox
) {

    dialogueBox.onclick =
        handleDialogueClick;

}


/* =================================================
   캐릭터 영역 연결
   ================================================= */

var characterArea =
    document.getElementById(
        "characterArea"
    );


if (
    characterArea
) {

    characterArea.onclick =
        handleDialogueClick;

}


/* =================================================
   시작
   ================================================= */

updateStepDisplay();


startDialogue(0);


/*
   시작 후 30초 idle 타이머
*/

resetIdleTimer();