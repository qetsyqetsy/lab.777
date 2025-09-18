// splash.js

window.addEventListener("load", () => {
    const canvas = document.getElementById("splash-canvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%".split("");
    const fontSize = 20;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff00";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    function typeWriter(text, element, callback) {
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, 50);
            } else if (callback) callback();
        }
        typing();
    }

    function playBeep(frequency = 600, duration = 100) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration / 1000);
    }

    const startBtn = document.getElementById("start-btn");
    const nameInputField = document.getElementById("user-name");

    function startWeb() {
        playBeep(600, 100);
        const nameInput = nameInputField.value.trim();
        const userName = nameInput || "Invitado";

        const loadingName = document.getElementById("loading-name");
        loadingName.textContent = "";

        typeWriter(`Cargando ${userName}...`, loadingName, () => {
            setTimeout(() => {
                document.getElementById("welcome-form").style.display = "none";
                document.getElementById("header").style.display = "block";
                document.getElementById("content").style.display = "block";
                document.getElementById("footer").style.display = "block";

                const welcomeMessage = document.getElementById("welcome-message");
                welcomeMessage.textContent = `Bienvenido, ${userName}!`;
            }, 500);
        });
    }

    startBtn.addEventListener("click", startWeb);
    nameInputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") startWeb();
    });
});
