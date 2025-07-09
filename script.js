// Timer variables
        let breakTime = 15;
        let workTime = 45;
        let totalSeconds = 0;
        let remainingTime = workTime * 60;
        let timerInterval;
        let isRunning = false;
        let currentMode = 'work'; // 'work' or 'break'
        
        // DOM elements
        const timeDisplay = document.getElementById('timeDisplay');
        const modeDisplay = document.getElementById('modeDisplay');
        const totalTimeDisplay = document.getElementById('totalTime');
        const playBtn = document.getElementById('play-btn');
        const resetBtn = document.getElementById('reset-btn');
        const workSector = document.getElementById('workSector');
        const breakSector = document.getElementById('breakSector');
        const hourHand = document.getElementById('hourHand');
        const minuteHand = document.getElementById('minuteHand');
        const secondHand = document.getElementById('secondHand');
        const clockNumbers = document.getElementById('clockNumbers');
       
        
        // Create clock numbers (1-12)
        function createClockNumbers() {
            const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const clock = document.querySelector('.clock');
            const clockWidth = clock.offsetWidth;
            const radius = clockWidth * 0.4;
            const center = clockWidth / 2;
            
            // Clear existing numbers
            clockNumbers.innerHTML = '';
            
            numbers.forEach((num, index) => {
                const number = document.createElement('div');
                number.className = 'number';
                number.textContent = num;
                
                const angle = (index * 30) * (Math.PI / 180);
                const x = center + Math.sin(angle) * radius;
                const y = center - Math.cos(angle) * radius;
                
                number.style.left = `${x}px`;
                number.style.top = `${y}px`;
                clockNumbers.appendChild(number);
            });
        }
        
        // Initialize
        window.addEventListener('load', function() {
            createClockNumbers();
            updateDisplay();
            updateClockVisuals();
            highlightSelection(breakTime, workTime);
            updateTimeLabels();
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            createClockNumbers();
        });
        
        // Event listeners
        playBtn.addEventListener('click', function() {
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });
        
        resetBtn.addEventListener('click', resetTimer);
        
        // Timer functions
        function startTimer() {
            if (isRunning) return;
            
            isRunning = true;
            playBtn.textContent = 'PAUSE ⏸';
            
            timerInterval = setInterval(function() {
                remainingTime--;
                totalSeconds++;
                updateDisplay();
                updateClockAnimation();
                updateClockHands();
                
                if (remainingTime <= 0) {
                    // Switch between work and break modes
                    if (currentMode === 'work') {
                        currentMode = 'break';
                        remainingTime = breakTime * 60;
                        modeDisplay.textContent = 'Break';
                    } else {
                        currentMode = 'work';
                        remainingTime = workTime * 60;
                        modeDisplay.textContent = 'Work';
                    }
                    updateClockVisuals();
                }
            }, 1000);
        }
        
        function pauseTimer() {
            clearInterval(timerInterval);
            isRunning = false;
            playBtn.textContent = 'PLAY ▶';
        }
        
        function resetTimer() {
            pauseTimer();
            currentMode = 'work';
            modeDisplay.textContent = 'Work';
            remainingTime = workTime * 60;
            updateDisplay();
            updateClockVisuals();
            updateClockHands();
        }
        
        function updateDisplay() {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        function updateClockVisuals() {
            // Clear existing divisions
            document.querySelectorAll('.clock-division').forEach(el => el.remove());

            const minutesPerDivision = 5;
            const degreesPerMinute = 360 / 60; // 6 degrees per minute
            const degreesPerDivision = minutesPerDivision * degreesPerMinute;

            // Work time breakdown
            const fullWorkDivs = Math.floor(workTime / minutesPerDivision);
            const workRemainder = workTime % minutesPerDivision;

            // Break time breakdown
            const fullBreakDivs = Math.floor(breakTime / minutesPerDivision);
            const breakRemainder = breakTime % minutesPerDivision;

            const clock = document.querySelector('.clock');
            let currentAngle = 0;

            // Work full divisions
            for (let i = 0; i < fullWorkDivs; i++) {
                const division = document.createElement('div');
                division.className = 'clock-division work-division';
                division.style.transform = `rotate(${currentAngle}deg)`;
                clock.appendChild(division);
                currentAngle += degreesPerDivision;
            }

            // Work partial division
            if (workRemainder > 0) {
                const partialAngle = workRemainder * degreesPerMinute;
                const division = document.createElement('div');
                division.className = 'clock-division work-division';
                division.style.transform = `rotate(${currentAngle}deg)`;
                division.style.clipPath = getClipPathForAngle(partialAngle);
                clock.appendChild(division);
                currentAngle += partialAngle;
            }

            // Break full divisions
            for (let i = 0; i < fullBreakDivs; i++) {
                const division = document.createElement('div');
                division.className = 'clock-division break-division';
                division.style.transform = `rotate(${currentAngle}deg)`;
                clock.appendChild(division);
                currentAngle += degreesPerDivision;
            }

            // Break partial division
            if (breakRemainder > 0) {
                const partialAngle = breakRemainder * degreesPerMinute;
                const division = document.createElement('div');
                division.className = 'clock-division break-division';
                division.style.transform = `rotate(${currentAngle}deg)`;
                division.style.clipPath = getClipPathForAngle(partialAngle);
                clock.appendChild(division);
                currentAngle += partialAngle;
            }

            // Show current mode sector (animated fill)
            if (currentMode === 'work') {
                workSector.style.opacity = '1';
                breakSector.style.opacity = '0';
            } else {
                workSector.style.opacity = '0';
                breakSector.style.opacity = '1';
            }
        }

        // Helper to calculate clip-path for a given angle
        function getClipPathForAngle(angleDeg) {
            const angleRad = angleDeg * Math.PI / 180;
            const x = 50 + 50 * Math.sin(angleRad);
            const y = 50 - 50 * Math.cos(angleRad);
            return `polygon(50% 50%, 50% 0%, ${x}% ${y}%)`;
        }
     
        function updateClockAnimation() {
            const total = currentMode === 'work' ? workTime * 60 : breakTime * 60;
            const angle = 360 * (1 - (remainingTime / total));
            
            if (currentMode === 'work') {
                workSector.style.transform = `rotate(${angle}deg)`;
            } else {
                breakSector.style.transform = `rotate(${angle}deg)`;
            }
        }
        
           function updateClockHands() {
    const elapsed = (currentMode === 'work' ? workTime * 60 : breakTime * 60) - remainingTime;

    const seconds = elapsed % 60;
    const minutes = Math.floor(elapsed / 60) % 60;
    const hours = Math.floor(elapsed / 3600);

    const secondsAngle = seconds * 6;         // 360 / 60
    const minutesAngle = minutes * 6 + (seconds / 60) * 6; // smooth minute hand
    const hoursAngle = (hours % 12) * 30 + (minutes / 60) * 30;

    secondHand.style.transform = `rotate(${secondsAngle}deg)`;
    minuteHand.style.transform = `rotate(${minutesAngle}deg)`;
    hourHand.style.transform = `rotate(${hoursAngle}deg)`;
}
        

       function selectRow(w, b) {
            if (isRunning) return;

            breakTime = b;
            workTime = w;
            remainingTime = workTime * 60;
            currentMode = 'work';
            modeDisplay.textContent = 'Work';
            updateDisplay();
            updateClockVisuals();
            updateClockHands();
            updateTimeLabels();

            // Highlight selected option-btn
            document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected-row'));
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                const work = btn.querySelector('.work-time')?.textContent;
                const brk = btn.querySelector('.break-time')?.textContent;
                if (parseInt(work) === w && parseInt(brk) === b) {
                btn.classList.add('selected-row');
                }
            });
            }
        
        function highlightSelection(b, w) {
            // Remove selection from all rows
            document.querySelectorAll('table tr').forEach(tr => tr.classList.remove('selected-row'));
            
            // Find and highlight the matching row
            document.querySelectorAll('table tr').forEach(tr => {
                const tds = tr.querySelectorAll('td');
                if (tds.length === 2 && Number(tds[0].innerText) === b && Number(tds[1].innerText) === w) {
                    tr.classList.add('selected-row');
                }
            });
        }