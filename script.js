let duration = 1500;
let elapsed = 1500;
let interval;
let score = 0;
let potentialScore = 0;

const playBtn = document.querySelector('.play-btn');
const resetBtn = document.querySelector('.reset-btn');
const timeEl = document.querySelector('.time');
const progressValue = document.querySelector('.progress-ring__value');
const scoreEl = document.querySelector('.score-value');

window.onload = function() {
    let savedScore = localStorage.getItem('score');
    if (savedScore) {
        score = parseInt(savedScore);
        scoreEl.innerText = score;
    }
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
            let progressPercentage = (1 - (msElapsed / (duration * 1000))) * 100;
            setProgress(progressPercentage);

            if (elapsed <= 0) {
                clearInterval(interval);
                score += potentialScore; 
                potentialScore = 0;
                localStorage.setItem('score', score);
                elapsed = 1500;
                timeEl.innerText = "25:00";
                setProgress(100);
                playBtn.classList.remove("fa-pause");
                playBtn.classList.add("fa-play");
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
    elapsed = 1500;
    timeEl.innerText = "25:00";
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
});
