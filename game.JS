/* =================================================
   감독생 만보기
   ================================================= */


/* =================================================
   기본 상태
   ================================================= */

var steps = 0;

var currentStep = 0;

var currentDialogueIndex = 0;

var dialogueMode = "normal";


/* =================================================
   idle 상태
   ================================================= */

var idleTimer = null;

var idleGroup = 0;

var idleIndex = 0;


/* =================================================
   흔들기 상태
   ================================================= */

var shakeDialogueIndex = 0;

var lastShakeTime = 0;


/* =================================================
   걸음 감지
   ================================================= */

var lastStepTime = 0;


/* =================================================
   오디오
   ================================================= */

var audioContext = null;


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
   기본 대사
   ================================================= */

var dialogues = {

    0: [

        {
            text: "너 말이야, 마법도 못 쓰면서 체력까지 없으면 어쩌려고 그래?",
            emotion: 1
        },

        {
            text: "내가 제대로 봐주지 않으면 안 되겠네.",
            emotion: 2
        },

        {
            text: "... 뭐야, 내가 무슨 얘기를 더 해주길 바라는 것처럼 보고.",
            emotion: 3
        },

        {
            text: "그렇게 잡담만 하다간 해 다 진다?",
            emotion: 1
        },

        {
            text: "자, 잔말 말고 걸어. 감독생!",
            emotion: 5
        }

    ],


    50: [

        {
            text: "50보 걸어놓고 칭찬 같은 거 바라는 건 아니지?",
            emotion: 8
        },

        {
            text: "집에서 걸어도 이것보다 더 나와.",
            emotion: 3
        }

    ],


    100: [

        {
            text: "출발은 좋네~",
            emotion: 6
        },

        {
            text: "그래도 이제 100보니까, 앞으로 9900걸음만 걸으면 되겠네!",
            emotion: 2
        },

        {
            text: "설마 9900걸음은 좀 아닌데~ 하고 들어갈 생각이라면 내 칭찬은 못 듣는걸로.",
            emotion: 8
        }

    ],


    500: [

        {
            text: "지금 500걸음 걷고 나 보는 거야?",
            emotion: 1
        },

        {
            text: "... 아니, 이정도면 기본으로 해야하는 거잖아?!",
            emotion: 4
        },

        {
            text: "당연히 더 걸어야지.",
            emotion: 3
        },

        {
            text: "특히 너는 체력 좀 키워야돼.",
            emotion: 3
        }

    ],


    1000: [

        {
            text: "이제 1000걸음이라...",
            emotion: 7
        },

        {
            text: "감독생도 하면 잘 하잖아~",
            emotion: 6
        },

        {
            text: "그치만 난 아직 땀 한방울도 안 흘렸거든?",
            emotion: 5
        },

        {
            text: "열심히 뛰라고.",
            emotion: 2
        }

    ],


    2500: [

        {
            text: "와, 솔직히 슬슬 말하기 귀찮은데~ 자도 돼?",
            emotion: 6
        },

        {
            text: "...",
            emotion: 7
        },

        {
            text: "알았어, 알겠으니까! 그렇게 절망하지 마.",
            emotion: 3
        },

        {
            text: "여기 있으면 되는 거지?",
            emotion: 8
        }

    ],


    5000: [

        {
            text: "숨 찼어? 아까보다 속도가 느려진 것 같은데.",
            emotion: 7
        },

        {
            text: "어쩔 수 없네, 좀 느긋하게 걸어도 괜찮으니까 천천히 해.",
            emotion: 1
        }

    ],


    10000: [

        {
            text: "정말 만보 채웠네, 솔직히 중간에 포기할 줄 알았는데 말이야.",
            emotion: 2
        },

        {
            text: "흐음~ 제법이잖아, 감독생.",
            emotion: 8
        },

        {
            text: "내일도 네가 할 지는 잘 모르겠지만, 응원은 할 테니까.",
            emotion: 5
        },

        {
            text: "수고했어.",
            emotion: 6
        }

    ]

};


/* =================================================
   오래 가만히 있을 때 나오는 대사
   ================================================= */

var idleDialogues = [

    [

        {
            text: "슬슬 일어나, 언제까지 늘어져있을 생각이야?",
            emotion: 1
        },

        {
            text: "내가 계속 응원... 아니, 응원이라고 해야하나.",
            emotion: 7
        },

        {
            text: "곁에 있을테니까.",
            emotion: 5
        }

    ],


    [

        {
            text: "슬슬 일어나, 언제까지 늘어져있을 생각이야?",
            emotion: 1
        },

        {
            text: "...",
            emotion: 7
        },

        {
            text: "감독생? 나 그런 거 안 봐주거든.",
            emotion: 4
        },

        {
            text: "내가 이런 거에선 좀 깐깐해서 말이야.",
            emotion: 3
        },

        {
            text: "일어나!",
            emotion: 4
        }

    ]

];


/* =================================================
   폰 흔들기 대사
   ================================================= */

var shakeDialogues = [

    {
        text: "... 너 뭐하냐?",
        emotion: 4
    },

    {
        text: "지금 안 걷고 있지? 어?",
        emotion: 1
    },

    {
        text: "잔머리 쓰지 말고 똑바로 걸으라고!",
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
   오디오 초기화
   ================================================= */

function unlockAudio() {

    if (
        audioContext === null
    ) {

        var AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {

            return;

        }

        audioContext =
            new AudioContextClass();

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

function playNotificationSound() {

    unlockAudio();


    if (
        audioContext === null
    ) {

        return;

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
        now + 0.02
    );


    gain1.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.25
    );


    oscillator1.connect(gain1);

    gain1.connect(
        audioContext.destination
    );


    oscillator1.start(now);

    oscillator1.stop(
        now + 0.27
    );


    var oscillator2 =
        audioContext.createOscillator();

    var gain2 =
        audioContext.createGain();


    oscillator2.type =
        "sine";


    oscillator2.frequency.setValueAtTime(
        1174,
        now + 0.16
    );


    gain2.gain.setValueAtTime(
        0.0001,
        now + 0.16
    );


    gain2.gain.exponentialRampToValueAtTime(
        0.12,
        now + 0.18
    );


    gain2.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.43
    );


    oscillator2.connect(gain2);

    gain2.connect(
        audioContext.destination
    );


    oscillator2.start(
        now + 0.16
    );

    oscillator2.stop(
        now + 0.45
    );

}


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


    playNotificationSound();

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


    resetIdleTimer();

}


/* =================================================
   오래 가만히 있기 이벤트 시작
   ================================================= */

function startIdleDialogue() {

    if (
        steps >= 10000
    ) {

        return;

    }


    clearIdleTimer();


    dialogueMode =
        "idle";


    idleGroup =
        0;


    idleIndex =
        0;


    playNotificationSound();


    showIdleDialogue();

}


/* =================================================
   idle 대사 표시
   ================================================= */

function showIdleDialogue() {

    var group =
        idleDialogues[idleGroup];


    if (!group) {

        return;

    }


    var dialogue =
        group[idleIndex];


    if (!dialogue) {

        return;

    }


    messageElement.textContent =
        dialogue.text;


    characterImage.src =
        "images/" +
        dialogue.emotion +
        ".png";

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


    var group =
        idleDialogues[idleGroup];


    if (!group) {

        return;

    }


    if (
        idleIndex <
        group.length - 1
    ) {

        idleIndex++;

        showIdleDialogue();


        /*
           "곁에 있을테니까."가 나온 뒤
           30초 동안 기다린다.
        */

        if (
            idleGroup === 0 &&
            idleIndex === group.length - 1
        ) {

            dialogueMode =
                "idleWait";


            clearIdleTimer();


            idleTimer =
                setTimeout(
                    function() {

                        if (
                            dialogueMode !==
                            "idleWait"
                        ) {

                            return;

                        }


                        idleGroup =
                            1;


                        idleIndex =
                            0;


                        dialogueMode =
                            "idle";


                        playNotificationSound();


                        showIdleDialogue();

                    },
                    30000
                );

        }


        return;

    }


    dialogueMode =
        "normal";


    idleGroup =
        0;


    idleIndex =
        0;


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


    if (
        dialogueMode !== "normal"
    ) {

        return;

    }


    idleTimer =
        setTimeout(
            function() {

                if (
                    dialogueMode ===
                    "normal"
                ) {

                    startIdleDialogue();

                }

            },
            30000
        );

}


/* =================================================
   흔들기 이벤트 시작
   ================================================= */

function startShakeDialogue() {

    if (
        dialogueMode === "idle" ||
        dialogueMode === "idleWait"
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


    playNotificationSound();

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


    dialogueMode =
        "normal";


    shakeDialogueIndex =
        0;


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


    if (
        dialogueMode === "idle" ||
        dialogueMode === "idleWait"
    ) {

        clearIdleTimer();


        dialogueMode =
            "normal";


        idleIndex =
            0;


        idleGroup =
            0;

    }


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
   걸음 감지
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


    /*
       너무 빠르게 여러 번 세는 것 방지
    */

    if (
        now - lastStepTime < 450
    ) {

        return;

    }


    /*
       중력값 약 9.8을 기준으로
       실제 움직임을 확인한다.
    */

    var movement =
        Math.abs(
            magnitude - 9.8
        );


    /*
       현재 잘 올라가는
       기존 판정값 유지
    */

    if (
        movement > 1.7
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
   아까 잘 작동했던 방식.

   센서 이벤트 개수를 그대로 세지 않고
   실제 움직임의 방향이 바뀌는 것을
   하나의 흔들기로 계산한다.
*/


var shakeCount = 0;

var shakeStartTime = 0;

var shakeMoving = false;

var shakeLastMoveTime = 0;

var lastShakeDirection = 0;


/*
   흔들기 민감도

   너무 작은 움직임은 무시한다.
*/

var shakeThreshold = 6.0;


/*
   실제 필요한 흔들기 횟수

   약 10번.
*/

var shakeRequiredCount = 10;


/*
   5초 안에 10번 흔들기.
*/

var shakeWindow = 5000;


/*
   한 번 흔든 뒤
   다음 흔들기까지 필요한 휴식 시간.
*/

var shakeRestTime = 180;


/*
   이벤트 발생 후 다시 감지하기 전
   최소 간격.
*/

var shakeMinInterval = 100;


/*
   흔들기 이벤트 발생 후
   다시 흔들기 이벤트를 받을 때까지
   잠깐 기다린다.
*/

var shakeCooldown = 4000;

var shakeCooldownUntil = 0;


/* =================================================
   흔들기 감지
   ================================================= */

function detectShake(event) {

    var acceleration =
        event.accelerationIncludingGravity;


    if (!acceleration) {

        return;

    }


    /*
       흔들기 이벤트가 이미 나왔다면
       현재 대화가 끝날 때까지
       추가 흔들기를 무시한다.
    */

    if (
        dialogueMode !== "normal"
    ) {

        shakeCount = 0;

        shakeStartTime = 0;

        shakeMoving = false;

        lastShakeDirection = 0;

        return;

    }


    /*
       현재 일반 대사가 아직 끝나지 않았다면
       흔들기 이벤트 금지.
    */

    var lines =
        dialogues[currentStep];


    if (
        lines &&
        currentDialogueIndex <
        lines.length - 1
    ) {

        shakeCount = 0;

        shakeStartTime = 0;

        shakeMoving = false;

        lastShakeDirection = 0;

        return;

    }


    var x =
        acceleration.x || 0;

    var y =
        acceleration.y || 0;

    var z =
        acceleration.z || 0;


    var now =
        new Date().getTime();


    /*
       흔들기 이벤트 후 쿨다운.
    */

    if (
        now < shakeCooldownUntil
    ) {

        return;

    }


    /*
       세 축 중 가장 크게 움직이는 축을 선택한다.

       어느 방향으로 폰을 흔들어도
       어느 정도 인식할 수 있도록 한다.
    */

    var axisValue;


    if (
        Math.abs(x) >= Math.abs(y) &&
        Math.abs(x) >= Math.abs(z)
    ) {

        axisValue = x;

    }

    else if (
        Math.abs(y) >= Math.abs(x) &&
        Math.abs(y) >= Math.abs(z)
    ) {

        axisValue = y;

    }

    else {

        axisValue = z;

    }


    /*
       작은 움직임은 무시한다.
    */

    if (
        Math.abs(axisValue) <
        shakeThreshold
    ) {

        /*
           움직임이 끝난 뒤
           다음 흔들기를 받을 준비.
        */

        if (
            shakeMoving &&
            now - shakeLastMoveTime >=
            shakeRestTime
        ) {

            shakeMoving = false;

        }

        return;

    }


    /*
       현재 움직임이 계속되는 동안에는
       여러 devicemotion 이벤트가 발생해도
       하나의 흔들기로 취급한다.
    */

    if (
        shakeMoving
    ) {

        shakeLastMoveTime =
            now;

        return;

    }


    /*
       너무 빠른 중복 이벤트 방지.
    */

    if (
        now - shakeLastMoveTime <
        shakeMinInterval
    ) {

        return;

    }


    /*
       새로운 흔들기 시작.
    */

    shakeMoving = true;

    shakeLastMoveTime =
        now;


    /*
       흔들기 전체 시간 시작.
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
       5초를 넘겼으면
       다시 처음부터 센다.
    */

    if (
        now - shakeStartTime >
        shakeWindow
    ) {

        shakeStartTime =
            now;

        shakeCount =
            0;

        lastShakeDirection =
            0;

    }


    /*
       현재 방향.
    */

    var direction;


    if (
        axisValue > 0
    ) {

        direction = 1;

    }

    else {

        direction = -1;

    }


    /*
       첫 흔들기.
    */

    if (
        shakeCount === 0
    ) {

        shakeCount =
            1;

        lastShakeDirection =
            direction;

    }


    /*
       방향이 바뀌었을 때만
       새로운 흔들기로 센다.
    */

    else if (
        direction !==
        lastShakeDirection
    ) {

        shakeCount++;

        lastShakeDirection =
            direction;

    }


    /*
       10번 흔들면 이벤트 발생.
    */

    if (
        shakeCount >=
        shakeRequiredCount
    ) {

        lastShakeTime =
            now;


        shakeCooldownUntil =
            now +
            shakeCooldown;


        shakeCount =
            0;


        shakeStartTime =
            0;


        shakeMoving =
            false;


        lastShakeDirection =
            0;


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
   센서 권한
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

        startMotionSensor();

    }

}


/* =================================================
   첫 터치에서 오디오 준비
   ================================================= */

document.addEventListener(
    "click",
    unlockAudio,
    {
        once: true
    }
);


/* =================================================
   화면 클릭
   ================================================= */

function handleDialogueClick(event) {

    if (
        event
    ) {

        event.stopPropagation();

    }


    unlockAudio();


    /*
       "곁에 있을테니까." 이후
       30초 기다리는 동안에는
       클릭해도 넘어가지 않는다.
    */

    if (
        dialogueMode === "idleWait"
    ) {

        return;

    }


    if (
        dialogueMode === "shake"
    ) {

        nextShakeDialogue();

        return;

    }


    if (
        dialogueMode === "idle"
    ) {

        nextIdleDialogue();

        return;

    }


    if (
        dialogueMode === "normal"
    ) {

        nextNormalDialogue();

        return;

    }

}


/* =================================================
   대화창 클릭
   ================================================= */

if (
    dialogueBox
) {

    dialogueBox.addEventListener(
        "click",
        handleDialogueClick
    );

}


/* =================================================
   시작
   ================================================= */

updateStepDisplay();

startDialogue(0);

resetIdleTimer();