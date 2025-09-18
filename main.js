// main.js

window.addEventListener("load", () => {

    const content = document.getElementById("content");

    function fadeInSection(section) {
        content.classList.remove("show");
        content.classList.add("fade");
        setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth" });
            content.classList.add("show");
        }, 300);
    }

    let bartokChords = [
        [261.63, 349.23, 466.16],
        [293.66, 415.30, 554.37],
        [329.63, 440.00, 622.25],
        [261.63, 311.13, 392.00],
        [293.66, 349.23, 440.00],
        [349.23, 466.16, 587.33],
        [392.00, 523.25, 622.25],
        [440.00, 554.37, 659.25]
    ];

    function playChord(frequencies, duration = 150) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        frequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const splitter = audioCtx.createChannelSplitter(2);
            const merger = audioCtx.createChannelMerger(2);

            osc.connect(gain);
            gain.connect(splitter);

            const delayL = audioCtx.createDelay();
            const delayR = audioCtx.createDelay();
            delayL.delayTime.value = 0.3 + i * 0.05;
            delayR.delayTime.value = 0.35 + i * 0.05;

            const fbL = audioCtx.createGain();
            const fbR = audioCtx.createGain();
            fbL.gain.value = 0.3;
            fbR.gain.value = 0.3;

            splitter.connect(delayL, 0);
            splitter.connect(delayR, 1);

            delayL.connect(fbL);
            fbL.connect(delayL);
            delayR.connect(fbR);
            fbR.connect(delayR);

            delayL.connect(merger, 0, 0);
            delayR.connect(merger, 0, 1);

            merger.connect(audioCtx.destination);

            osc.type = "triangle";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

            osc.start();
            osc.stop(audioCtx.currentTime + duration / 1000);
        });
    }

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (e) => {
            const sectionId = link.getAttribute("href").substring(1);
            const section = document.getElementById(sectionId);

            if (section) fadeInSection(section);

            const chord = bartokChords[index % bartokChords.length];
            playChord(chord, 150);

            e.preventDefault();
        });
    });

    const labLink = document.getElementById("lab-777");
    const lab777Chords = [
        [277.18, 369.99, 493.88],
        [311.13, 415.30, 554.37],
        [369.99, 466.16, 622.25],
        [277.18, 349.23, 392.00],
        [311.13, 415.30, 466.16],
        [369.99, 466.16, 587.33],
        [415.30, 523.25, 622.25],
        [466.16, 554.37, 659.25]
    ];

    labLink.addEventListener("click", (e) => {
        bartokChords = lab777Chords;
        playChord([440, 554.37, 659.25], 150);
       // alert("Tonalidad cambiada a LAB.777!");
        e.preventDefault();
    });

});
