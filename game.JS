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
   화면 요소
   ================================================= */

var stepsElement =
    document.getElementById("steps");

var messageElement =
    document.getElementById("message");

var characterImage =
    document.getElementById("characterImage");


/* =================================================
   대사 데이터
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
   대화 시작
   ================================================= */

function startDialogue(step) {

    if (
        !dialogues[step]
    ) {

        return;

    }

    currentStep =
        step;

    currentDialogueIndex =
        0;

    showDialogue();

}


/* =================================================
   대사 표시
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
   다음 대사
   ================================================= */

function nextDialogue() {

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
   걸음 수 설정
   ================================================= */

function setSteps(newSteps) {

    var oldMilestone =
        getCurrentMilestone();

    steps =
        newSteps;

    updateStepDisplay();

    var newMilestone =
        getCurrentMilestone();

    if (
        newMilestone !==
        oldMilestone
    ) {

        startDialogue(
            newMilestone
        );

    }

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

    var newMilestone =
        getCurrentMilestone();

    if (
        newMilestone !==
        oldMilestone
    ) {

        startDialogue(
            newMilestone
        );

    }

}


/* =================================================
   대화창 클릭
   ================================================= */

document
    .getElementById("dialogueBox")
    .onclick = function() {

        nextDialogue();

    };


/* =================================================
   캐릭터 클릭
   ================================================= */

document
    .getElementById("characterArea")
    .onclick = function() {

        nextDialogue();

    };


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


var idleTimer = null;

var idleCount = 0;

var idleDialogueIndex = 0;


/* =================================================
   가만히 있기 대사 표시
   ================================================= */

function showIdleDialogue() {

    if (
        steps >= 10000
    ) {

        return;

    }

    var lines =
        idleDialogues[idleCount];

    if (!lines) {

        return;

    }

    idleDialogueIndex =
        0;

    messageElement.textContent =
        lines[idleDialogueIndex].text;

    characterImage.src =
        "images/" +
        lines[idleDialogueIndex].emotion +
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

    messageElement.textContent =
        lines[idleDialogueIndex].text;

    characterImage.src =
        "images/" +
        lines[idleDialogueIndex].emotion +
        ".png";

}


/* =================================================
   가만히 있기 타이머
   ================================================= */

function resetIdleTimer() {

    if (idleTimer) {

        clearTimeout(idleTimer);

    }

    idleTimer =
        setTimeout(
            function() {

                if (
                    steps >= 10000
                ) {

                    return;

                }

                if (
                    idleCount >=
                    idleDialogues.length
                ) {

                    idleCount =
                        idleDialogues.length - 1;

                }

                showIdleDialogue();

                if (
                    idleCount === 2
                ) {

                    if (
                        navigator.vibrate
                    ) {

                        navigator.vibrate(
                            [300, 150, 300]
                        );

                    }

                }

                idleCount++;

            },
            30000
        );

}


/* =================================================
   실제 걸음 감지
   ================================================= */

var lastStepTime = 0;

var stepThreshold = 12;


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

var lastShakeTime = 0;


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


    if (
        magnitude > 20 &&
        now - lastShakeTime > 5000 &&
        steps < 10000
    ) {

        lastShakeTime =
            now;

        messageElement.textContent =
            "... 너 뭐하냐?";

        characterImage.src =
            "images/4.png";


        if (
            navigator.vibrate
        ) {

            navigator.vibrate(100);

        }


        setTimeout(
            function() {

                if (
                    steps < 10000
                ) {

                    messageElement.textContent =
                        "지금 안 걷고 있지? 어?";

                    characterImage.src =
                        "images/1.png";

                }

            },
            1500
        );


        setTimeout(
            function() {

                if (
                    steps < 10000
                ) {

                    messageElement.textContent =
                        "잔머리 쓰지 말고 똑바로 걸으라고!";

                    characterImage.src =
                        "images/4.png";


                    if (
                        navigator.vibrate
                    ) {

                        navigator.vibrate(200);

                    }

                }

            },
            3000
        );

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
   걸음이 발생하면 가만히 있기 타이머 초기화
   ================================================= */

var originalAddSteps =
    addSteps;


addSteps =
    function(amount) {

        originalAddSteps(amount);

        idleCount = 0;

        idleDialogueIndex = 0;

        resetIdleTimer();

    };


/* =================================================
   가만히 있기 대사 클릭 처리
   ================================================= */

document
    .getElementById("dialogueBox")
    .addEventListener(
        "click",
        function() {

            var lines =
                idleDialogues[idleCount];

            if (
                lines &&
                idleDialogueIndex <
                lines.length - 1
            ) {

                nextIdleDialogue();

            }

        }
    );


document
    .getElementById("characterArea")
    .addEventListener(
        "click",
        function() {

            var lines =
                idleDialogues[idleCount];

            if (
                lines &&
                idleDialogueIndex <
                lines.length - 1
            ) {

                nextIdleDialogue();

            }

        }
    );


/* =================================================
   시작
   ================================================= */

updateStepDisplay();

startDialogue(0);

resetIdleTimer();