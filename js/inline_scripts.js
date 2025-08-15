
        let selectedCount = 4;
        let currentVideoUrl = '';
        let videoIframes = [];

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            selectDefaultCount();
            addCyberEffects();
        });

        function initializeEventListeners() {
            // Video count selection
            document.querySelectorAll('.count-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    selectVideoCount(parseInt(this.dataset.count));
                });
            });

            // Start playing button
            document.getElementById('start-playing').addEventListener('click', startPlaying);

            // Play all button
            document.getElementById('play-all').addEventListener('click', playAllVideos);

            // Stop all button
            document.getElementById('stop-all').addEventListener('click', stopAllVideos);

            // URL input validation
            document.getElementById('youtube-url').addEventListener('input', function() {
                hideError();
                currentVideoUrl = this.value.trim();
            });

            // Enter key support
            document.getElementById('youtube-url').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    startPlaying();
                }
            });
        }

        function selectDefaultCount() {
            document.querySelector('.count-btn[data-count="4"]').classList.add('active');
        }

        function selectVideoCount(count) {
            selectedCount = count;
            
            // Update button states
            document.querySelectorAll('.count-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-count="${count}"]`).classList.add('active');
        }

        function startPlaying() {
            const urlInput = document.getElementById('youtube-url');
            const url = urlInput.value.trim();

            if (!url) {
                showError('Please enter a YouTube video URL');
                return;
            }

            if (!isValidYouTubeUrl(url)) {
                showError('Please enter a valid YouTube URL');
                return;
            }

            hideError();
            createVideoGrid(url, selectedCount);
        }

        function isValidYouTubeUrl(url) {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
            return youtubeRegex.test(url);
        }

        function extractVideoId(url) {
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

        function createVideoGrid(url, count) {
            const videoGrid = document.getElementById('video-grid');
            const videoId = extractVideoId(url);

            if (!videoId) {
                showError('Could not extract video ID from URL');
                return;
            }

            // Show loading with cyber theme
            videoGrid.innerHTML = '<div class="loading"><div class="spinner"></div>Initializing Video Streams...</div>';

            // Clear previous grid and set new grid class
            setTimeout(() => {
                videoGrid.innerHTML = '';
                videoGrid.className = `video-grid grid-${count}`;
                videoIframes = [];

                // Create video containers
                for (let i = 0; i < count; i++) {
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'video-container';
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&enablejsapi=1`;
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;
                    iframe.id = `video-${i}`;
                    
                    videoContainer.appendChild(iframe);
                    videoGrid.appendChild(videoContainer);
                    videoIframes.push(iframe);
                }

                // Show video controls
                document.getElementById('video-controls').classList.add('show');

                // Scroll to video grid
                videoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1000);
        }

        function playAllVideos() {
            videoIframes.forEach((iframe, index) => {
                try {
                    // Send play command to iframe
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                } catch (e) {
                    console.log('Could not control video', index);
                }
            });
            
            // Visual feedback
            const playBtn = document.getElementById('play-all');
            playBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                playBtn.style.transform = 'scale(1)';
            }, 150);
        }

        function stopAllVideos() {
            videoIframes.forEach((iframe, index) => {
                try {
                    // Send pause command to iframe
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                } catch (e) {
                    console.log('Could not control video', index);
                }
            });
            
            // Visual feedback
            const stopBtn = document.getElementById('stop-all');
            stopBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                stopBtn.style.transform = 'scale(1)';
            }, 150);
        }

        function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            const errorDiv = document.getElementById('error-message');
            errorDiv.style.display = 'none';
        }

        function addCyberEffects() {
            // Add random glitch effects
            setInterval(() => {
                const elements = document.querySelectorAll('.count-btn, .start-btn, .control-btn');
                const randomElement = elements[Math.floor(Math.random() * elements.length)];
                if (randomElement && Math.random() < 0.1) {
                    randomElement.style.animation = 'glitch-1 0.3s ease-in-out';
                    setTimeout(() => {
                        randomElement.style.animation = '';
                    }, 300);
                }
            }, 2000);

            // Add floating particles
            createFloatingParticles();
        }

        function createFloatingParticles() {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 2px;
                    height: 2px;
                    background: #00ffff;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: -1;
                    animation: float ${5 + Math.random() * 10}s linear infinite;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    opacity: ${0.3 + Math.random() * 0.7};
                `;
                document.body.appendChild(particle);
            }

            // Add CSS for floating animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(100vh) rotate(0deg); }
                    100% { transform: translateY(-100vh) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    