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

var idleTimer = null;

var idleGroup = 0;
var idleIndex = 0;

var lastStepTime = 0;


/* =================================================
   기본 표정
   ================================================= */

var defaultEmotion = 5;


/* =================================================
   대사 알림음
   ================================================= */

var audioContext = null;


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
   40초 후 대사
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

        clearTimeout(idleTimer);

        idleTimer = null;

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
   일반 대사 클릭
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
       일반 대사가 끝나면
       반드시 기본 표정 5번으로 복구
    */

    resetCharacterEmotion();

    resetIdleTimer();

}


/* =================================================
   idle 대화 시작
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

    idleIndex =
        0;

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

    playDialogueSound();

}


/* =================================================
   idle 대사 클릭
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

        return;

    }


    /*
       idle 대사가 끝나면
       반드시 기본 표정 5번으로 복구
    */

    dialogueMode =
        "normal";

    idleIndex =
        0;

    resetCharacterEmotion();


    /*
       다음 idle 대사 그룹을 준비
    */

    if (
        idleGroup <
        idleDialogues.length - 1
    ) {

        idleGroup++;

    }


    resetIdleTimer();

}


/* =================================================
   idle 40초 타이머
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
                    dialogueMode === "normal"
                ) {

                    startIdleDialogue();

                }

            },
            40000
        );

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


    if (
        dialogueMode === "idle"
    ) {

        dialogueMode =
            "normal";

        idleIndex =
            0;

        resetCharacterEmotion();

    }


    resetIdleTimer();


    var newMilestone =
        getCurrentMilestone();


    if (
        newMilestone !== oldMilestone
    ) {

        startDialogue(
            newMilestone
        );

        resetIdleTimer();

    }

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
       기존보다 조금 널널하게
       걸음 판정을 잡음.

       휴대폰을 실제로 들고 걸을 때
       움직임이 약해도 걸음으로 인식할 수 있도록
       기준을 11 -> 10.3으로 낮춤.
    */

    if (
        magnitude > 10.3 &&
        now - lastStepTime > 300
    ) {

        lastStepTime =
            now;

        addSteps(1);

    }

}


/* =================================================
   걷기 패턴 분석
   ================================================= */


/*
   최근 걸음이 발생한 시간들
*/

var recentStepTimes = [];


/*
   걷고 있다고 판단할 시간
*/

var walkingTimeout = 1800;


/*
   최근 걸음 기록
*/

function registerStepPattern() {

    var now =
        new Date().getTime();


    recentStepTimes.push(
        now
    );


    /*
       너무 오래된 기록 제거
    */

    recentStepTimes =
        recentStepTimes.filter(
            function(time) {

                return (
                    now - time <= 2500
                );

            }
        );

}


/*
   현재 걷는 중인지 확인
*/

function isWalking() {

    var now =
        new Date().getTime();


    recentStepTimes =
        recentStepTimes.filter(
            function(time) {

                return (
                    now - time <=
                    walkingTimeout
                );

            }
        );


    /*
       최근 1.8초 안에
       걸음이 2번 이상 있으면
       걷는 중으로 판단
    */

    return (
        recentStepTimes.length >= 2
    );

}


/* =================================================
   걸음 감지에 패턴 기록 추가
   ================================================= */

var originalAddSteps =
    addSteps;

addSteps =
    function(amount) {

        registerStepPattern();

        originalAddSteps(amount);

    };


/* =================================================
   센서 시작
   ================================================= */

function startMotionSensor() {

    window.addEventListener(
        "devicemotion",
        detectStep
    );

}


/* =================================================
   센서 권한
   ================================================= */

if (
    typeof DeviceMotionEvent !== "undefined"
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
                                permission === "granted"
                            ) {

                                startMotionSensor();

                            }

                        }
                    )
                    .catch(
                        function(error) {

                            console.log(error);

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

var dialogueBox =
    document.getElementById("dialogueBox");

if (
    dialogueBox
) {

    dialogueBox.onclick =
        handleDialogueClick;

}


/* =================================================
   캐릭터 클릭
   ================================================= */

var characterArea =
    document.getElementById("characterArea");

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

resetIdleTimer();