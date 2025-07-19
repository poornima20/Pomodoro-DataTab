document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const timerDisplay = document.querySelector('.timer-circle');
            const startBtn = document.querySelector('.start-btn');
            const resetBtn = document.querySelector('.reset-btn');
            const presetBtns = document.querySelectorAll('.preset-btn');
            const statusDisplay = document.querySelector('.status');
            const progressBar = document.querySelector('.progress-bar');
            const modal = document.querySelector('.modal');
            const closeModalBtn = document.querySelector('.close-modal');
            const modalTitle = document.querySelector('.modal-title');
            const modalMessage = document.querySelector('.modal-message');
            const doodle = document.querySelector('.doodle');
            const sessionCounter = document.querySelector('.session-counter');
            
            // Timer variables
            let timer;
            let timeLeft = 0;
            let totalTime = 0;
            let isRunning = false;
            let isWorkTime = true;
            let currentPreset = '25-5';
            let sessionsCompleted = 0;
            
            // Preset configurations
            const presets = {
                '25-5': { work: 25 * 60, break: 5 * 60, sessions: 4 },
                '30-10': { work: 30 * 60, break: 10 * 60, sessions: 4 },
                '45-15': { work: 45 * 60, break: 15 * 60, sessions: 4 },
                '1-1': { work: 1 * 60, break: 1 * 60, sessions: 4 }
            };
            
            // Initialize timer with default preset
            initTimer('25-5');
            
            // Event listeners
            startBtn.addEventListener('click', toggleTimer);
            resetBtn.addEventListener('click', resetTimer);
            closeModalBtn.addEventListener('click', closeModal);
            
            presetBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const preset = this.dataset.preset;
                    selectPreset(preset);
                    resetTimer();
                });
            });
            
            // Functions
            function initTimer(preset) {
                currentPreset = preset;
                timeLeft = presets[preset].work;
                totalTime = presets[preset].work;
                isWorkTime = true;
                updateDisplay();
                updateStatus();
                updateSessionCounter();
                
                // Update active preset button
                presetBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.preset === preset) {
                        btn.classList.add('active');
                    }
                });
            }
            
            function toggleTimer() {
                if (isRunning) {
                    pauseTimer();
                } else {
                    startTimer();
                }
            }
            
            function startTimer() {
                isRunning = true;
                startBtn.textContent = 'Pause ‖';
                timer = setInterval(updateTimer, 1000);
                timerDisplay.classList.add('pulse');
            }
            
            function pauseTimer() {
                isRunning = false;
                startBtn.textContent = 'Play ►';
                clearInterval(timer);
                timerDisplay.classList.remove('pulse');
            }
            
            function resetTimer() {
                pauseTimer();
                initTimer(currentPreset);
                progressBar.style.width = '0%';
            }
            
            function updateTimer() {
                timeLeft--;
                updateDisplay();
                updateProgress();
                
                if (timeLeft <= 0) {
                    timerComplete();
                }
            }
            
            function timerComplete() {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = 'Start';
                
                if (isWorkTime) {
                   
                    // Switch to break time
                    isWorkTime = false;
                    timeLeft = presets[currentPreset].break;
                    totalTime = presets[currentPreset].break;
                    
                    // Different doodles for different break lengths
                    let doodleEmoji = "☕";
                    if (currentPreset === "1-1") {
                        doodleEmoji = "⏱️";
                    }
                    showModal("Time for a break!", "Great job! Take a well-deserved break.", doodleEmoji);
                } else {
                    // Break completed, switch to work time
                    isWorkTime = true;
                    timeLeft = presets[currentPreset].work;
                    totalTime = presets[currentPreset].work;
                    
                    let doodleEmoji = "💪";
                    if (currentPreset === "1-1") {
                        doodleEmoji = "📝";
                    }
                    showModal("Back to work!", "Break's over! Time to focus again.", doodleEmoji);
                }
                
                updateStatus();
                updateDisplay();
                progressBar.style.width = '0%';
            }
            
            function updateDisplay() {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Update circle color based on work/break
                if (isWorkTime) {
                    timerDisplay.classList.add('work');
                    timerDisplay.classList.remove('break');
                } else {
                    timerDisplay.classList.add('break');
                    timerDisplay.classList.remove('work');
                }
            }
            
            function updateStatus() {
                if (isWorkTime) {
                    statusDisplay.textContent = "Time to focus!";
                } else {
                    statusDisplay.textContent = "Time for a break!";
                }
            }
            
            function updateProgress() {
                const progress = ((totalTime - timeLeft) / totalTime) * 100;
                progressBar.style.width = `${progress}%`;
            }
            
            function selectPreset(preset) {
                currentPreset = preset;
                initTimer(preset);
            }
            
            function updateSessionCounter() {
                sessionCounter.textContent = `© 2025 Fullmoon`;
            }
            
            function showModal(title, message, emoji) {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                doodle.textContent = emoji;
                modal.style.display = 'flex';
            }
            
            function closeModal() {
                modal.style.display = 'none';
            }
        });