// --- AUDIO SYNTH ENGINE (UNBLOCKABLE HARDWARE SFX) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'magic') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5); 
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    } 
    else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } 
    else if (type === 'meow') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(580, audioCtx.currentTime);
        osc.frequency.quadraticRampToValueAtTime(880, audioCtx.currentTime + 0.12);
        osc.frequency.quadraticRampToValueAtTime(720, audioCtx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);
        osc.start(); osc.stop(audioCtx.currentTime + 0.28);
    } 
    else if (type === 'nom') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        osc.frequency.setValueAtTime(320, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
        osc.start(); osc.stop(audioCtx.currentTime + 0.18);
    }
}

// --- FAIRY DUST POINTER INTERACTION ---
window.addEventListener('pointermove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'magic-sparkle';
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';
    
    const mx = (Math.random() - 0.5) * 120 + 'px';
    const my = (Math.random() - 0.5) * 120 + 'px';
    sparkle.style.setProperty('--mx', mx);
    sparkle.style.setProperty('--my', my);
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// --- ZONE 1: UNWRAP REVEAL ---
function unwrapMagic(box) {
    playSynthSound('magic');
    playSynthSound('meow');
    box.style.transform = 'scale(0) rotate(720deg)';
    box.style.transition = 'all 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
    
    setTimeout(() => {
        box.style.display = 'none';
        document.getElementById('titleName').classList.add('reveal');
        document.getElementById('scroller').style.display = 'flex';
        // Burst initial foil balloons
        for(let i=0; i<12; i++) { createFoilBalloon(true); }
    }, 550);
}

// --- ZONE 2: CANDLES & BEAR FEEDING GAME ---
let blownCandlesCount = 0;
function extinguishCandle(candle) {
    const flame = candle.querySelector('.flame-real');
    if (flame && flame.style.display !== 'none') {
        flame.style.display = 'none';
        playSynthSound('pop');
        blownCandlesCount++;
        
        if (blownCandlesCount === 4) {
            document.getElementById('mainBear').classList.add('bear-clapping');
            document.getElementById('cakeSlice').style.display = 'block';
            // Start spontaneous balloon loop for Zone 3
            setInterval(createFoilBalloon, 900);
        }
    }
}

// Mobile and Tablet Touch Drag-and-Drop Implementation
const cakeSlice = document.getElementById('cakeSlice');
const mainBear = document.getElementById('mainBear');

cakeSlice.addEventListener('touchmove', (e) => {
    const touch = e.targetTouches[0];
    cakeSlice.style.position = 'absolute';
    cakeSlice.style.left = touch.pageX - 30 + 'px';
    cakeSlice.style.top = touch.pageY - 30 + 'px';
    
    // Collision detection with 3D Bear bounding box
    const bearRect = mainBear.getBoundingClientRect();
    if(touch.clientX > bearRect.left && touch.clientX < bearRect.right &&
       touch.clientY > bearRect.top && touch.clientY < bearRect.bottom) {
        if(cakeSlice.style.display !== 'none') {
            cakeSlice.style.display = 'none';
            playSynthSound('nom');
            mainBear.style.transform = 'scale(1.4) rotate(360deg)';
            mainBear.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            setTimeout(() => {
                mainBear.style.transform = 'scale(1) rotate(0deg)';
            }, 1000);
        }
    }
});

// --- ZONE 3: 3D BALLOON GENERATOR ENGINE ---
const balloonColors = ['#ff4757', '#ff6b81', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6', '#ff4081'];
function createFoilBalloon(isBurstMode = false) {
    const yard = document.getElementById('balloon-yard');
    if (!yard) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon-3d';
    balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.left = Math.random() * 82 + 'vw';
    
    const speed = isBurstMode ? (2 + Math.random() * 2) : (4 + Math.random() * 3);
    balloon.style.setProperty('--speed', speed + 's');
    
    if(isBurstMode) {
        balloon.style.bottom = Math.random() * 40 + 'vh';
    }

    // Interactive Tap Pop
    balloon.addEventListener('pointerdown', () => {
        playSynthSound('pop');
        
        // Spin Rabbit animation trigger
        const rabbit = document.getElementById('mainRabbit');
        rabbit.classList.add('rabbit-spin');
        setTimeout(() => rabbit.classList.remove('rabbit-spin'), 500);
        
        balloon.remove();
    });

    yard.appendChild(balloon);
    setTimeout(() => { if(balloon.parentNode) balloon.remove(); }, speed * 1000);
}

// --- ZONE 4: LOVE SHOWER SHOWER ---
const loveEmojis = ['💖', '💝', '🐰', '🧸', '🐱', '🌟', '🌈'];
function triggerLoveShower() {
    playSynthSound('magic');
    for(let i=0; i<35; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'falling-emoji';
            emoji.innerText = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
            emoji.style.left = Math.random() * 92 + 'vw';
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 2500);
        }, i * 50);
    }
                                                             }
