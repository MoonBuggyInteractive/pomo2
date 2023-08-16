const TOTAL_TIME = 1500; 

let duration = TOTAL_TIME;
let elapsed = TOTAL_TIME;
let interval;
let score = 0;
let potentialScore = 0;
let tasksCompleted = 0;
let missionsCompleted = 0;

const tasksCompletedEl = document.querySelector('.tasks-completed');
const missionsCompletedEl = document.querySelector('.missions-completed');
const missionNameEl = document.querySelector('.mission-name');
const missionDialogueEl = document.querySelector('.mission-dialogue');
const playBtn = document.querySelector('.play-btn');
const resetBtn = document.querySelector('.reset-btn');
const timeEl = document.querySelector('.time');
const progressValue = document.querySelector('.progress-ring__value');
const scoreEl = document.querySelector('.score-value');
const missionProgressBar = document.querySelector('.mission-progress-bar');
const leftIconEl = document.querySelector('.mission-icon-left');
const rightIconEl = document.querySelector('.mission-icon-right');

const missions = [
    {
        name: "Journey to the Moon",
        dialogue: "Travel to the moon aboard your spaceship.",
        pointsRequired: 45000,
        leftIcon: "fa-regular fa-earth-americas",
        rightIcon: "fa-sharp fa-solid fa-moon"
    },
    // ... other missions
];

let currentMissionIndex = 0;

window.onload = function() {
    let savedScore = localStorage.getItem('score');
    if (savedScore) {
        score = parseInt(savedScore);
        scoreEl.innerText = score;
    }
    missionNameEl.innerText = missions[currentMissionIndex].name;
    missionDialogueEl.innerText = missions[currentMissionIndex].dialogue;
    leftIconEl.className = missions[currentMissionIndex].leftIcon;
    rightIconEl.className = missions[currentMissionIndex].rightIcon;
};

function setProgress(value) {
    const circumference = 2 * Math.PI * 98;
    const offset = circumference - (value / 100 * circumference);
    progressValue.style.strokeDasharray = `${circumference} ${circumference}`;
    progressValue.style.strokeDashoffset = offset;
}

playBtn.addEventListener('click', function() {
    if (playBtn.classList.contains("fa-play")) {
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
        
        let msElapsed = 0;
        interval = setInterval(function() {
            msElapsed += 200;

            potentialScore += 1;
            scoreEl.innerText = Math.floor(score + potentialScore);

            if (msElapsed % 1000 === 0) {
                elapsed--;
                let min = Math.floor(elapsed / 60);
                let sec = elapsed % 60;
                timeEl.innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
            }

            // Calculate the progress percentage and update every 200ms
            let radialProgressPercentage = (1 - (msElapsed / (duration * 1000))) * 100;
            setProgress(radialProgressPercentage);

            // Update mission progress bar
            let missionStartScore = currentMissionIndex > 0 ? missions[currentMissionIndex - 1].pointsRequired : 0;
            let currentMissionScore = score + potentialScore - missionStartScore;
            let missionRequiredScore = missions[currentMissionIndex].pointsRequired - missionStartScore;

            let missionProgressPercentage = (currentMissionScore / missionRequiredScore) * 100;
            missionProgressBar.style.width = `${missionProgressPercentage}%`;

            if (elapsed <= 0) {
                clearInterval(interval);
                score += potentialScore; 
                potentialScore = 0;
                localStorage.setItem('score', score);
                elapsed = TOTAL_TIME;
                timeEl.innerText = `${Math.floor(TOTAL_TIME / 60)}:${TOTAL_TIME % 60 < 10 ? '0' : ''}${TOTAL_TIME % 60}`;
                setProgress(100);
                playBtn.classList.remove("fa-pause");
                playBtn.classList.add("fa-play");
                tasksCompleted++;
                tasksCompletedEl.innerText = tasksCompleted;
            }
            
            if (score >= missions[currentMissionIndex].pointsRequired && missionsCompleted == currentMissionIndex) {
                missionsCompleted++;
                missionsCompletedEl.innerText = missionsCompleted;
                
                currentMissionIndex++;
                if (currentMissionIndex < missions.length) {
                    missionNameEl.innerText = missions[currentMissionIndex].name;
                    missionDialogueEl.innerText = missions[currentMissionIndex].dialogue;
                    leftIconEl.className = missions[currentMissionIndex].leftIcon;
                    rightIconEl.className = missions[currentMissionIndex].rightIcon;
                } else {
                    missionNameEl.innerText = "All missions completed!";
                    missionDialogueEl.innerText = "";
                }
            }

        }, 200);
    } else {
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
        clearInterval(interval);
    }
});

resetBtn.addEventListener('click', function() {
    clearInterval(interval);
    elapsed = TOTAL_TIME;
    timeEl.innerText = `${Math.floor(TOTAL_TIME / 60)}:${TOTAL_TIME % 60 < 10 ? '0' : ''}${TOTAL_TIME % 60}`;
    setProgress(100);
    potentialScore = 0;
    scoreEl.innerText = score;
    playBtn.classList.remove("fa-pause");
    playBtn.classList.add("fa-play");
});

document.querySelector('.reset-score-text').addEventListener('click', function() {
    score = 0;
    scoreEl.innerText = score;
    localStorage.setItem('score', score);

    // Reset missions and tasks counters
    missionsCompleted = 0;
    missionsCompletedEl.innerText = missionsCompleted;
    tasksCompleted = 0;
    tasksCompletedEl.innerText = tasksCompleted;

    // Reset current mission index and display the first mission's name and dialogue
    currentMissionIndex = 0;
    missionNameEl.innerText = missions[currentMissionIndex].name;
    missionDialogueEl.innerText = missions[currentMissionIndex].dialogue;
    leftIconEl.className = missions[currentMissionIndex].leftIcon;
    rightIconEl.className = missions[currentMissionIndex].rightIcon;
});
