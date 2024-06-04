let audioContext;
let mediaRecorder;
let audioChunks = [];
let audioBlob;

function speakText() {
    const text = document.getElementById('textInput').value;
    const language = document.getElementById('languageSelect').value;
    const speechSynthesis = window.speechSynthesis;

    if (speechSynthesis.speaking) {
        console.error('SpeechSynthesis is already speaking');
        return;
    }

    if (text !== '') {
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = language;

        utterThis.onend = function () {
            console.log('SpeechSynthesisUtterance.onend');
            stopRecording();
        }

        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror', event);
        }

        startRecording();
        speechSynthesis.speak(utterThis);
    }
}

function startRecording() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const input = audioContext.createMediaStreamSource(audioContext.createMediaStreamDestination().stream);

    mediaRecorder = new MediaRecorder(input.stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks = [];
    };
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

function downloadAudio() {
    if (!audioBlob) {
        alert("Please generate the audio first by clicking 'Speak'");
        return;
    }

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'speech.wav';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

// Utility function to combine audio context
function createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
}
