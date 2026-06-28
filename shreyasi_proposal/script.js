/**
 * Core Proposal Webpage Script for Shreyasi
 * Integrates Canvas effects, Envelope opening, Typing letter,
 * runaway 'No' button mechanics, and celebration animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  
  const startBtn = document.getElementById('start-btn');
  const muteBtn = document.getElementById('mute-btn');
  const envelope = document.getElementById('envelope');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const letterContent = document.getElementById('letter-content');
  const proposalContainer = document.getElementById('proposal-container');
  const noteDisplay = document.getElementById('note-display');
  const petalBtns = document.querySelectorAll('.petal-btn');

  // --- State Variables ---
  let bgHearts = [];
  let confettiParticles = [];
  let isCelebrationActive = false;
  let hasMusicStarted = false;
  let escapeCount = 0;
  
  // Teasing lines for the No button
  const teasingLines = [
    "Wait, seriously? 🥺",
    "Pachhtaogi! Think again 💖",
    "Dil todogi mera? 💔",
    "Error: Option Disabled! ❌",
    "Try again! 😉",
    "Aise kaise? 😂",
    "No is not allowed! 🤫",
    "Yes hi bol do... 👉👈"
  ];

  // Letter Paragraphs
  const letterParagraphs = [
    "Dear Shreyasi,",
    "Jabse tum meri life mein aayi ho, sab kuch bohot khoobsurat ho gaya hai. Tumhari wo pyaari si smile, tumhari choti-choti baatein, aur tumhara sath... mere liye sabse bada tohfa hain.",
    "Main apni aane wali zindagi ka har ek din tumhare saath bitana chahta hoon, tumhare har sapne ko milkar sach karna chahta hoon, aur har dukh-sukh mein tumhara haath thaam kar chalna chahta hoon.",
    "Tumhare bina mera har pal adhoora lagta hai. Tum sirf meri girlfriend nahi, mera sukoon aur meri poori duniya ho...",
    "Aaj main dil se ek baat kehna chahta hoon..."
  ];

  // --- Setup Canvas Sizes ---
  function resizeCanvases() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // --- Background Hearts Particle System ---
  class BackgroundHeart {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.size = Math.random() * 12 + 8;
      this.x = Math.random() * bgCanvas.width;
      this.y = initial ? Math.random() * bgCanvas.height : bgCanvas.height + this.size;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.35 + 0.15;
      this.angle = Math.random() * Math.PI * 2;
      this.angleIncrement = Math.random() * 0.02 - 0.01;
      // Soft variations of pink/magenta/purple colors
      const r = Math.floor(Math.random() * 40) + 215; // 215-255
      const g = Math.floor(Math.random() * 50) + 80;  // 80-130
      const b = Math.floor(Math.random() * 60) + 120; // 120-180
      this.color = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.angle) * 0.3;
      this.angle += this.angleIncrement;

      // Fade out near the top
      if (this.y < 100) {
        this.opacity -= 0.005;
      }

      // Recycle if off-screen or faded out
      if (this.y < -this.size || this.opacity <= 0) {
        this.reset(false);
      }
    }

    draw() {
      bgCtx.save();
      bgCtx.fillStyle = this.color;
      bgCtx.translate(this.x, this.y);
      
      // Draw Heart Shape
      bgCtx.beginPath();
      bgCtx.moveTo(0, -this.size / 4);
      bgCtx.bezierCurveTo(this.size / 2, -this.size, this.size, -this.size / 3, 0, this.size);
      bgCtx.bezierCurveTo(-this.size, -this.size / 3, -this.size / 2, -this.size, 0, -this.size / 4);
      bgCtx.fill();
      bgCtx.restore();
    }
  }

  // Initialize background particles
  const totalBgHearts = Math.min(65, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < totalBgHearts; i++) {
    bgHearts.push(new BackgroundHeart());
  }

  // --- Confetti / Celebration Particle System ---
  class ConfettiParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 14 + 6;
      
      // Explode outward radially
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed - Math.random() * 4; // bias upward
      
      this.gravity = 0.18;
      this.friction = 0.985;
      this.opacity = 1;
      this.decay = Math.random() * 0.012 + 0.006;
      
      // Colors: gold, pink, crimson, rose
      const colors = ['#ff2e63', '#ff7597', '#ffd700', '#ff007f', '#ffffff', '#ff8da1'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 8 - 4;
      this.type = Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'circle' : 'star');
    }

    update() {
      this.speedX *= this.friction;
      this.speedY = (this.speedY * this.friction) + this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      confettiCtx.save();
      confettiCtx.globalAlpha = this.opacity;
      confettiCtx.fillStyle = this.color;
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate((this.rotation * Math.PI) / 180);

      if (this.type === 'heart') {
        confettiCtx.beginPath();
        confettiCtx.moveTo(0, -this.size / 4);
        confettiCtx.bezierCurveTo(this.size / 2, -this.size, this.size, -this.size / 3, 0, this.size);
        confettiCtx.bezierCurveTo(-this.size, -this.size / 3, -this.size / 2, -this.size, 0, -this.size / 4);
        confettiCtx.fill();
      } else if (this.type === 'star') {
        confettiCtx.beginPath();
        for (let i = 0; i < 5; i++) {
          confettiCtx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * this.size,
                             Math.sin(((18 + i * 72) * Math.PI) / 180) * this.size);
          confettiCtx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (this.size / 2),
                             Math.sin(((54 + i * 72) * Math.PI) / 180) * (this.size / 2));
        }
        confettiCtx.closePath();
        confettiCtx.fill();
      } else {
        // Circle / Dot
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    }
  }

  function triggerCelebrationConfetti() {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2 - 80;
    
    // Initial blast
    for (let i = 0; i < 180; i++) {
      confettiParticles.push(new ConfettiParticle(startX, startY));
    }
    
    // Continuous side spurts for 4 seconds
    const interval = setInterval(() => {
      if (!isCelebrationActive) {
        clearInterval(interval);
        return;
      }
      // Left side spurt
      for (let i = 0; i < 15; i++) {
        const p = new ConfettiParticle(0, window.innerHeight * 0.7);
        p.speedX = Math.random() * 8 + 4;
        p.speedY = -Math.random() * 8 - 4;
        confettiParticles.push(p);
      }
      // Right side spurt
      for (let i = 0; i < 15; i++) {
        const p = new ConfettiParticle(window.innerWidth, window.innerHeight * 0.7);
        p.speedX = -Math.random() * 8 - 4;
        p.speedY = -Math.random() * 8 - 4;
        confettiParticles.push(p);
      }
    }, 450);

    setTimeout(() => clearInterval(interval), 5000);
  }

  // --- Animation loop ---
  function animate() {
    // 1. Draw Background
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    for (let heart of bgHearts) {
      heart.update();
      heart.draw();
    }

    // 2. Draw Confetti
    if (confettiParticles.length > 0) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.update();
        p.draw();
        
        // Remove dead particles
        if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
          confettiParticles.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

  // --- UI Screen Navigation ---
  function showScreen(targetScreenId) {
    // Find visible screen and hide it
    const activeScreen = document.querySelector('.screen.visible');
    if (activeScreen) {
      activeScreen.classList.remove('visible');
      activeScreen.classList.add('hidden');
    }

    // Show target screen
    const targetScreen = document.getElementById(targetScreenId);
    if (targetScreen) {
      targetScreen.classList.remove('hidden');
      targetScreen.classList.add('visible');
    }
  }

  // --- Screen 1 Intro Logic ---
  startBtn.addEventListener('click', () => {
    // Initialize & play audio (complies with browser auto-play logic)
    if (!hasMusicStarted) {
      window.synth.startMelody();
      hasMusicStarted = true;
      muteBtn.classList.remove('hidden');
    }
    window.synth.playChime();
    showScreen('screen-envelope');
  });

  // Mute/Unmute Toggle
  muteBtn.addEventListener('click', () => {
    const isMuted = window.synth.toggleMute();
    if (isMuted) {
      muteBtn.classList.add('muted');
    } else {
      muteBtn.classList.remove('muted');
    }
  });

  // --- Screen 2 Envelope Logic ---
  envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    window.synth.playChime();
    
    // Delay switching to the letter screen to allow open flap animation
    setTimeout(() => {
      showScreen('screen-letter');
      startTypewriter();
    }, 1600);
  });

  // --- Screen 3 Letter Typewriter Logic ---
  function startTypewriter() {
    let paraIndex = 0;
    let charIndex = 0;
    letterContent.innerHTML = '';
    
    // Create first paragraph container with typewriter caret
    let currentParaElement = document.createElement('p');
    letterContent.appendChild(currentParaElement);
    const caret = document.createElement('span');
    caret.className = 'caret';
    letterContent.appendChild(caret);

    function typeChar() {
      if (paraIndex < letterParagraphs.length) {
        const text = letterParagraphs[paraIndex];
        
        if (charIndex < text.length) {
          // Append character to the paragraph element
          currentParaElement.textContent += text.charAt(charIndex);
          charIndex++;
          
          // Move caret to end of current text
          letterContent.appendChild(caret);
          
          // Auto scroll to bottom
          letterContent.scrollTop = letterContent.scrollHeight;

          // Natural variable typing speed
          const speed = Math.random() * 20 + 35; // 35-55ms
          setTimeout(typeChar, speed);
        } else {
          // Paragraph completed. Move to next one.
          paraIndex++;
          charIndex = 0;
          
          if (paraIndex < letterParagraphs.length) {
            // Add spacing between paragraphs
            currentParaElement = document.createElement('p');
            // Insert new paragraph before the caret
            letterContent.insertBefore(currentParaElement, caret);
            
            // Slightly longer delay between paragraphs
            setTimeout(typeChar, 700);
          } else {
            // Typing complete! Hide caret and show proposal buttons
            caret.style.display = 'none';
            setTimeout(() => {
              proposalContainer.classList.remove('hidden');
              letterContent.scrollTop = letterContent.scrollHeight;
            }, 600);
          }
        }
      }
    }
    
    // Start typing after initial delay
    setTimeout(typeChar, 500);
  }

  // --- Runaway 'No' Button Logic ---
  // Coordinates and moves the "No" button smoothly when the user gets near it.
  
  function runawayNoButton(event) {
    // Get cursor or touch coordinate
    let clientX, clientY;
    if (event.type.startsWith('touch')) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    // Calculate distance between mouse/touch and button center
    const distX = clientX - btnCenterX;
    const distY = clientY - btnCenterY;
    const distance = Math.hypot(distX, distY);

    // Escape trigger distance (in pixels)
    const triggerDistance = 75;

    if (distance < triggerDistance) {
      escapeCount++;

      // Pick a random teasing message
      const randomLine = teasingLines[Math.floor(Math.random() * teasingLines.length)];
      noBtn.textContent = randomLine;

      if (escapeCount >= 5) {
        // Disable the "No" button entirely by shrinking it to 0
        noBtn.style.transform = 'scale(0)';
        noBtn.style.opacity = '0';
        noBtn.disabled = true;
        
        // Remove tracking listeners
        document.removeEventListener('mousemove', runawayNoButton);
        document.removeEventListener('touchmove', runawayNoButton);
        
        // Make the "Yes" button huge and pulsing!
        yesBtn.classList.add('glow-effect');
        yesBtn.style.transform = 'scale(1.25)';
        yesBtn.textContent = "YES, I WILL! ❤️";

        // Display a funny status message
        const notice = document.createElement('p');
        notice.style.fontSize = '0.85rem';
        notice.style.color = 'var(--accent-pink)';
        notice.style.marginTop = '12px';
        notice.style.animation = 'slideUp 0.4s ease';
        notice.textContent = "No option disabled. Click YES! 😉";
        proposalContainer.appendChild(notice);
        return;
      }

      // Calculate translation away from cursor
      // Move within limits of the viewport card container
      const containerRect = proposalContainer.getBoundingClientRect();
      
      // Compute random boundaries inside the proposal container
      // Keep it within proposal container region to prevent clipping off screen
      const rangeX = containerRect.width - btnRect.width - 20;
      const rangeY = 80; // Keep it within a vertical offset boundary
      
      // Calculate random offsets inside container limits
      const randomX = (Math.random() - 0.5) * rangeX;
      const randomY = (Math.random() - 0.5) * rangeY;

      // Apply transition offsets
      noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }
  }

  // Register move listeners once letter finishes and choice pops up
  document.addEventListener('mousemove', runawayNoButton);
  document.addEventListener('touchmove', runawayNoButton, { passive: true });

  // --- Screen 4 Celebration / Click Yes Logic ---
  yesBtn.addEventListener('click', () => {
    isCelebrationActive = true;
    
    // Play sound effects
    window.synth.playChime();
    setTimeout(() => {
      window.synth.switchToCelebration();
    }, 400);

    // Switch screen to Celebration
    showScreen('screen-success');
    
    // Launch VFX canvas hearts confetti
    triggerCelebrationConfetti();
  });

  // --- Interactive Memory Notes Logic ---
  petalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Synthesize a quick high music bell note for click feedback
      if (window.synth) {
        window.synth.playChime();
      }

      // Deactivate other buttons, activate this one
      petalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update text with fade effect
      noteDisplay.classList.remove('highlight');
      
      // Trigger a mini-reflow to restart transition
      void noteDisplay.offsetWidth;
      
      noteDisplay.textContent = btn.getAttribute('data-note');
      noteDisplay.classList.add('highlight');
    });
  });

});
