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
        const workTimeLabel = document.getElementById('workTimeLabel');
        const breakTimeLabel = document.getElementById('breakTimeLabel');
        
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
                updateTotalTime();
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
        
        function updateTotalTime() {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            totalTimeDisplay.textContent = `Total: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        function updateClockVisuals() {
            // Clear existing divisions
            document.querySelectorAll('.clock-division').forEach(el => el.remove());
            
            // Calculate total minutes in the cycle (work + break)
            const totalMinutes = workTime + breakTime;
            
            // Create work divisions (each division represents 5 minutes)
            const workDivisions = Math.floor(workTime / 5);
            for (let i = 0; i < workDivisions; i++) {
                const division = document.createElement('div');
                division.className = 'clock-division work-division';
                division.style.transform = `rotate(${i * 30}deg)`;
                document.querySelector('.clock').appendChild(division);
            }
            
            // Create break divisions
            const breakDivisions = Math.floor(breakTime / 5);
            for (let i = 0; i < breakDivisions; i++) {
                const division = document.createElement('div');
                division.className = 'clock-division break-division';
                division.style.transform = `rotate(${(workDivisions + i) * 30}deg)`;
                document.querySelector('.clock').appendChild(division);
            }
            
            // Show current mode sector (for the animation)
            if (currentMode === 'work') {
                workSector.style.opacity = '1';
                breakSector.style.opacity = '0';
            } else {
                workSector.style.opacity = '0';
                breakSector.style.opacity = '1';
            }
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
            const total = currentMode === 'work' ? workTime * 60 : breakTime * 60;
            const elapsed = total - remainingTime;
            const percentage = elapsed / total;
            
            // Calculate angles (starting from the top)
            const secondsAngle = percentage * 360;
            const minutesAngle = percentage * 360;
            const hoursAngle = percentage * 30; // 30 degrees per "hour" (30 min segment)
            
            // Apply rotation to clock hands
            secondHand.style.transform = `rotate(${secondsAngle}deg)`;
            minuteHand.style.transform = `rotate(${minutesAngle}deg)`;
            hourHand.style.transform = `rotate(${hoursAngle}deg)`;
        }
        
        function updateTimeLabels() {
            workTimeLabel.textContent = workTime;
            breakTimeLabel.textContent = breakTime;
        }
        
        function selectRow(b, w) {
            if (isRunning) return;
            
            breakTime = b;
            workTime = w;
            remainingTime = workTime * 60;
            currentMode = 'work';
            modeDisplay.textContent = 'Work';
            updateDisplay();
            updateClockVisuals();
            updateClockHands();
            highlightSelection(b, w);
            updateTimeLabels();
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