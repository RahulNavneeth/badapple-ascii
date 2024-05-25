document.addEventListener('DOMContentLoaded', () => {

	const video = document.getElementById('main-vid');
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');
	const asciiContainer = document.getElementById('ascii');

	ascii.style.transform = 'scale(0.18)';

	const asciiChars = "@%#*+=-:. ";
	const cutOffSeconds = 5;

	function startPlayback() {
		video.currentTime = 0;
		video.play();
		captureFrame();
	}

	video.addEventListener('loadedmetadata', () => {
		resizeCanvasAndFont();
		window.addEventListener('resize', resizeCanvasAndFont);
		video.play();
	});

	video.addEventListener('play', () => {
		captureFrame();
	});

	video.addEventListener('ended', () => {
		console.log('Video has ended.');
	});

	function resizeCanvasAndFont() {
		const aspectRatio = video.videoWidth / video.videoHeight;
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;
		let canvasWidth, canvasHeight;

		if (maxWidth / aspectRatio > maxHeight) {
			canvasHeight = maxHeight;
			canvasWidth = maxHeight * aspectRatio;
		} else {
			canvasWidth = maxWidth;
			canvasHeight = maxWidth / aspectRatio;
		}

		const scaleDownFactor = 0.2;
		canvasWidth *= scaleDownFactor;
		canvasHeight *= scaleDownFactor;

		const fontSize = (maxWidth / canvasWidth) * 5;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		asciiContainer.style.fontSize = `${fontSize}px`;
		asciiContainer.style.lineHeight = `${fontSize}px`;
	}

	function captureFrame() {
		if (video.paused || video.ended || video.currentTime >= (video.duration - cutOffSeconds)) {
			video.pause();
			console.log('Stopped video before the end.');
			setTimeout(startPlayback, 5000);
			return;
		}

		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixelData = imageData.data;

		let asciiImage = '';

		for (let y = 0; y < canvas.height; y++) {
			for (let x = 0; x < canvas.width; x++) {
				const offset = (y * canvas.width + x) * 4;
				const r = pixelData[offset];
				const g = pixelData[offset + 1];
				const b = pixelData[offset + 2];
				const gray = (r + g + b) / 3;
				const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
				asciiImage += asciiChars[charIndex];
			}
			asciiImage += '\n';
		}

		asciiContainer.textContent = asciiImage;

		requestAnimationFrame(captureFrame);
	}
});
