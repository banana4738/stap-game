/* =================================================
   감독생 만보기
   ================================================= */


/* =================================================
   현재 걸음 수
   ================================================= */

var steps = 0;


/* =================================================
   현재 대화
   ================================================= */

var currentStep = 0;
var currentDialogueIndex = 0;


/* =================================================
   대화 상태

   normal = 일반 걸음수 대사
   idle   = 가만히 있을 때 대사
   shake  = 휴대폰 흔들기 대사
   ================================================= */

var dialogueMode = "normal";


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
   일반 걸음수 대사
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
   가만히 있을 때 대사
   ================================================= */

var idleDialogues = [

    [

        {
            text: "힘들어서 더 이상 못 걷겠어?",
            emotion: 7
        },

        {
            text: "감독생 이렇게 체력이 없어서야~",
            emotion: 6
        },

        {
            text: "뭐, 그러면 잠깐동안은 기다려줄게.",
            emotion: 3
        }

    ],


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
   휴대폰 흔들기 대사
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
   가만히 있기 상태
   ================================================= */

var idleTimer = null;
var idleCount = 0;
var idleDialogueIndex = 0;


/* =================================================
   흔들기 상태
   ================================================= */

var lastShakeTime = 0;
var shakeDialogueIndex = 0;
var shakeTimeout1 = null;
var shakeTimeout2 = null;


/* =================================================
   걸음 감지
   ================================================= */

var lastStepTime = 0;

var stepThreshold = 12;


/* =================================================
   걸음 수 표시
   ================================================= */

function updateStepDisplay() {

    stepsElement.textContent =
        steps + "보";

}


/* =================================================
   현재 마일스톤 찾기
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
   일반 대화 시작
   ================================================= */

function startDialogue(step) {

    if (
        !dialogues[step]
    ) {

        return;

    }

    dialogueMode = "normal";

    currentStep =
        step;

    currentDialogueIndex =
        0;

    showDialogue();

}


/* =================================================
   일반 대사 표시
   ================================================= */

function showDialogue() {

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

}


/* =================================================
   일반 대화 다음 대사
   ================================================= */

function nextNormalDialogue() {

    var lines =
        dialogues[currentStep];

    if (!lines) {

        return;

    }

    if (
        currentDialogueIndex >=
        lines.length - 1
    ) {

        characterImage.src =
            "images/5.png";

        return;

    }

    currentDialogueIndex++;

    showDialogue();

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

        steps = 10000;

    }

    updateStepDisplay();

    /*
       걸음을 걸었다면
       가만히 있기 대화는 취소한다.
    */

    stopIdleDialogue();

    if (
        steps < 10000
    ) {

        resetIdleTimer();

    }

    var newMilestone =
        getCurrentMilestone();

    if (
        newMilestone !== oldMilestone
    ) {

        startDialogue(
            newMilestone
        );

    }

}


/* =================================================
   가만히 있기 대화 멈추기
   ================================================= */

function stopIdleDialogue() {

    if (idleTimer) {

        clearTimeout(idleTimer);

        idleTimer = null;

    }

}


/* =================================================
   가만히 있기 대화 시작
   ================================================= */

function startIdleDialogue() {

    if (
        steps >= 10000
    ) {

        return;

    }

    /*
       흔들기 대화 중에는
       가만히 있기 대화를 실행하지 않는다.
    */

    if (
        dialogueMode === "shake"
    ) {

        return;

    }

    dialogueMode = "idle";

    if (
        idleCount >= idleDialogues.length
    ) {

        idleCount =
            idleDialogues.length - 1;

    }

    idleDialogueIndex = 0;

    showIdleDialogue();

}


/* =================================================
   가만히 있기 대사 표시
   ================================================= */

function showIdleDialogue() {

    var lines =
        idleDialogues[idleCount];

    if (!lines) {

        return;

    }

    var dialogue =
        lines[idleDialogueIndex];

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
   가만히 있기 다음 대사
   ================================================= */

function nextIdleDialogue() {

    var lines =
        idleDialogues[idleCount];

    if (!lines) {

        return;

    }

    if (
        idleDialogueIndex >=
        lines.length - 1
    ) {

        return;

    }

    idleDialogueIndex++;

    showIdleDialogue();

}


/* =================================================
   가만히 있기 타이머
   ================================================= */

function resetIdleTimer() {

    stopIdleDialogue();

    if (
        steps >= 10000
    ) {

        return;

    }

    idleTimer =
        setTimeout(
            function() {

                startIdleDialogue();

            },
            30000
        );

}


/* =================================================
   가만히 있기 대사가 끝난 뒤
   다시 30초 기다리기
   ================================================= */

function finishIdleDialogue() {

    if (
        idleCount <
        idleDialogues.length - 1
    ) {

        idleCount++;

    }

    idleDialogueIndex = 0;

    dialogueMode = "normal";

    resetIdleTimer();

}


/* =================================================
   휴대폰 흔들기 대화 멈추기
   ================================================= */

function stopShakeDialogue() {

    if (shakeTimeout1) {

        clearTimeout(shakeTimeout1);

        shakeTimeout1 = null;

    }

    if (shakeTimeout2) {

        clearTimeout(shakeTimeout2);

        shakeTimeout2 = null;

    }

}


/* =================================================
   휴대폰 흔들기
   ================================================= */

function startShakeDialogue() {

    if (
        steps >= 10000
    ) {

        return;

    }

    /*
       기존 가만히 있기 타이머를 완전히 취소한다.
    */

    stopIdleDialogue();

    stopShakeDialogue();

    dialogueMode = "shake";

    shakeDialogueIndex = 0;

    messageElement.textContent =
        shakeDialogues[0].text;

    characterImage.src =
        "images/" +
        shakeDialogues[0].emotion +
        ".png";


    if (
        navigator.vibrate
    ) {

        navigator.vibrate(100);

    }


    /*
       첫 번째 대사 후
       두 번째 대사
    */

    shakeTimeout1 =
        setTimeout(
            function() {

                if (
                    dialogueMode !== "shake"
                ) {

                    return;

                }

                shakeDialogueIndex = 1;

                messageElement.textContent =
                    shakeDialogues[1].text;

                characterImage.src =
                    "images/" +
                    shakeDialogues[1].emotion +
                    ".png";

            },
            1500
        );


    /*
       두 번째 대사 후
       세 번째 대사
    */

    shakeTimeout2 =
        setTimeout(
            function() {

                if (
                    dialogueMode !== "shake"
                ) {

                    return;

                }

                shakeDialogueIndex = 2;

                messageElement.textContent =
                    shakeDialogues[2].text;

                characterImage.src =
                    "images/" +
                    shakeDialogues[2].emotion +
                    ".png";


                if (
                    navigator.vibrate
                ) {

                    navigator.vibrate(200);

                }


                /*
                   흔들기 대사가 끝난 뒤에는
                   다시 30초 대기한다.
                */

                setTimeout(
                    function() {

                        if (
                            dialogueMode === "shake"
                        ) {

                            dialogueMode =
                                "normal";

                            idleCount = 0;

                            resetIdleTimer();

                        }

                    },
                    1500
                );

            },
            3000
        );

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


    /*
       흔들기 직후에는
       걸음으로 중복 판정하지 않는다.
    */

    if (
        now - lastShakeTime < 1200
    ) {

        return;

    }


    /*
       일반 걸음 판정
    */

    if (
        magnitude > stepThreshold &&
        now - lastStepTime > 400
    ) {

        lastStepTime =
            now;

        addSteps(1);

        if (
            navigator.vibrate
        ) {

            navigator.vibrate(40);

        }

    }

}


/* =================================================
   휴대폰 흔들기 감지
   ================================================= */

function detectShake(event) {

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
       너무 자주 발동하지 않게 한다.
    */

    if (
        now - lastShakeTime < 5000
    ) {

        return;

    }


    /*
       걷거나 뛰는 중에는
       흔들기로 판정하지 않는다.

       마지막 걸음으로부터
       어느 정도 시간이 지난 뒤
       큰 움직임이 생겼을 때만 흔들기.
    */

    if (
        now - lastStepTime < 1200
    ) {

        return;

    }


    /*
       일반적인 걸음보다
       확실히 큰 움직임만 흔들기로 판정.
    */

    if (
        magnitude > 22
    ) {

        lastShakeTime =
            now;

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
    typeof DeviceMotionEvent !== "undefined"
) {

    if (
        typeof DeviceMotionEvent.requestPermission === "function"
    ) {

        document.body.addEventListener(
            "click",
            function motionPermission() {

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

    } else {

        startMotionSensor();

    }

}


/* =================================================
   화면 클릭
   ================================================= */

function handleDialogueClick() {

    /*
       가만히 있기 대사
    */

    if (
        dialogueMode === "idle"
    ) {

        var idleLines =
            idleDialogues[idleCount];

        if (!idleLines) {

            return;

        }

        if (
            idleDialogueIndex <
            idleLines.length - 1
        ) {

            nextIdleDialogue();

        } else {

            finishIdleDialogue();

        }

        return;

    }


    /*
       흔들기 대사는
       자동으로 넘어가므로 클릭하지 않는다.
    */

    if (
        dialogueMode === "shake"
    ) {

        return;

    }


    /*
       일반 걸음수 대사
    */

    nextNormalDialogue();

}


document
    .getElementById("dialogueBox")
    .onclick =
    handleDialogueClick;


document
    .getElementById("characterArea")
    .onclick =
    handleDialogueClick;


/* =================================================
   시작
   ================================================= */

updateStepDisplay();

startDialogue(0);

resetIdleTimer();