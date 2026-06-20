// Sound variables
const magicSound = document.getElementById('magicSound');
const popSound = document.getElementById('popSound');
const birthdayMusic = document.getElementById('birthdayMusic');

let blownCandlesCount = 0;
let score = 0;
let balloonInterval;

// STAGE 1 -> STAGE 2 (Gift open karne par)
function openGift() {
    magicSound.play();
    
    // Screen transition animation delay ke sath
    document.getElementById('stage1').classList.remove('active');
    document.getElementById('stage2').classList.add('active');
}

// STAGE 2: Candle blow logic
function blowCandle(candleElement) {
    const flame = candleElement.querySelector('.flame');
    
    // Agar flame pehle se bujhi nahi hai to
    if (flame.style.display !== 'none') {
        flame.style.display = 'none'; // Candle bujh gayi
        popSound.currentTime = 0;
        popSound.play(); // Puff/Pop sound
        blownCandlesCount++;
        
        // Agar saari 4 candles bujh gayi hain
        if (blownCandlesCount === 4) {
            setTimeout(() => {
                birthdayMusic.play();
                goToBalloonGame();
            }, 600);
        }
    }
}

// STAGE 2 -> STAGE 3 (Balloon Game Start)
function goToBalloonGame() {
    document.getElementById('stage2').classList.remove('active');
    document.getElementById('stage3').classList.add('active');
    
    // Har 800ms mein naye balloons screen par aayenge
    balloonInterval = setInterval(createBalloon, 800);
}

// STAGE 3: Random Balloons Creator
function createBalloon() {
    const container = document.getElementById('balloon-container');
    if (!container) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // Random Colors bacho ke pasand ke
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6', '#ff6b81'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;
    
    // Random horizontal position
    const randomX = Math.random() * (window.innerWidth - 80);
    balloon.style.left = `${randomX}px`;
    
    // Random speed taaki bacha aaram se touch kar sake
    const randomDuration = 3 + Math.random() * 3; 
    balloon.style.animationDuration = `${randomDuration}s`;
    
    // Balloon par click/tap karne ka event
    balloon.addEventListener('click', () => {
        popSound.currentTime = 0;
        popSound.play(); // Pop sound effect
        
        // Score update
        score++;
        document.getElementById('score').innerText = score;
        
        // Baby photo jump animation jab bacha balloon phodega
        const baby = document.getElementById('babyPhoto');
        baby.classList.add('baby-jump');
        setTimeout(() => baby.classList.remove('baby-jump'), 400);
        
        balloon.remove(); // Screen se balloon hatao
    });
    
    container.appendChild(balloon);
    
    // Agar balloon upar nikal jaye bina pop huye to memory se delete karo
    setTimeout(() => {
        if(balloon.parentNode) {
            balloon.remove();
        }
    }, randomDuration * 1000);
}
