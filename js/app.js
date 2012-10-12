(function () {

	// config start
	var OUTLINES = false;
	// config end

	window.hotSpots = [];

	var content = $('#content');
	var video = $('#webcam')[0];
	var canvases = $('canvas');

	var resize = function () {
		var ratio = video.width / video.height;
		var w = $(this).width();
		var h = $(this).height() - 110;

		if (content.width() > w) {
			content.width(w);
			content.height(w / ratio);
		} else {
			content.height(h);
			content.width(h * ratio);
		}
		canvases.width(content.width());
		canvases.height(content.height());
		content.css('left', (w - content.width()) / 2);
		content.css('top', ((h - content.height()) / 2) + 55);
	}
	$(window).resize(resize);
	$(window).ready(function () {
		resize();
		$('#watchVideo').click(function () {
			$(".browsers").fadeOut();
			$(".browsersWithVideo").delay(300).fadeIn();
			$("#video-demo").delay(300).fadeIn();
			$("#video-demo")[0].play();
			$('.backFromVideo').fadeIn();
			event.stopPropagation();
			return false;
		});
		$('.backFromVideo a').click(function () {
			$(".browsersWithVideo").fadeOut();
			$('.backFromVideo').fadeOut();
			$(".browsers").fadeIn();
			$("#video-demo")[0].pause();
			$('#video-demo').fadeOut();
			event.stopPropagation();
			return false;
		});
	});

	function hasGetUserMedia() {
		// Note: Opera builds are unprefixed.
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia || navigator.msGetUserMedia);
	}

	if (hasGetUserMedia()) {
		$('.introduction').fadeIn();
		$('.allow').fadeIn();
	} else {
		$('.browsers').fadeIn();
		return;
	}

	var webcamError = function (e) {
		alert('Webcam error!', e);
	};

	if (navigator.getUserMedia) {
		navigator.getUserMedia({audio: true, video: true}, function (stream) {
			video.src = stream;
			initialize();
		}, webcamError);
	} else if (navigator.webkitGetUserMedia) {
		navigator.webkitGetUserMedia({audio: true, video: true}, function (stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			initialize();
		}, webcamError);
	} else {
		//video.src = 'somevideo.webm'; // fallback.
	}

	var lastImageData;
	var canvasSource = $("#canvas-source")[0];
	var canvasBlended = $("#canvas-blended")[0];

	var contextSource = canvasSource.getContext('2d');
	var contextBlended = canvasBlended.getContext('2d');

	// mirror video
	contextSource.translate(canvasSource.width, 0);
	contextSource.scale(-1, 1);

	var c = 5;

	function initialize() {
		$('.introduction').fadeOut();
		$('.allow').fadeOut();
		$('.loading').delay(300).fadeIn();
		start();
	}

	function start() {
		$('.loading').fadeOut();
		$('#hotSpots').fadeIn();
		$('body').addClass('black-background');
		$(".instructions").delay(600).fadeIn();
		$(canvasSource).delay(600).fadeIn();
		$(canvasBlended).delay(600).fadeIn();
		$('#canvas-highlights').delay(600).fadeIn();
		$(window).trigger('start');
		update();
	}

	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame       ||
			   window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame    ||
			   window.oRequestAnimationFrame      ||
			   window.msRequestAnimationFrame     ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function update() {
		drawVideo();
		blend();
		checkAreas();
		requestAnimFrame(update);
	}

	function drawVideo() {
		contextSource.drawImage(video, 0, 0, video.width, video.height);
	}

	function blend() {
		var width = canvasSource.width;
		var height = canvasSource.height;
		// get webcam image data
		var sourceData = contextSource.getImageData(0, 0, width, height);
		// create an image if the previous image doesn’t exist
		if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
		// create a ImageData instance to receive the blended result
		var blendedData = contextSource.createImageData(width, height);
		// blend the 2 images
		differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
		// draw the result in a canvas
		contextBlended.putImageData(blendedData, 0, 0);
		// store the current webcam image
		lastImageData = sourceData;
	}

	function fastAbs(value) {
		// funky bitwise, equal Math.abs
		return (value ^ (value >> 31)) - (value >> 31);
	}

	function threshold(value) {
		return (value > 0x15) ? 0xFF : 0;
	}

	function difference(target, data1, data2) {
		// blend mode difference
		if (data1.length != data2.length) return null;
		var i = 0;
		while (i < (data1.length * 0.25)) {
			target[4 * i] = data1[4 * i] == 0 ? 0 : fastAbs(data1[4 * i] - data2[4 * i]);
			target[4 * i + 1] = data1[4 * i + 1] == 0 ? 0 : fastAbs(data1[4 * i + 1] - data2[4 * i + 1]);
			target[4 * i + 2] = data1[4 * i + 2] == 0 ? 0 : fastAbs(data1[4 * i + 2] - data2[4 * i + 2]);
			target[4 * i + 3] = 0xFF;
			++i;
		}
	}

	function differenceAccuracy(target, data1, data2) {
		if (data1.length != data2.length) return null;
		var i = 0;
		while (i < (data1.length * 0.25)) {
			var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
			var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
			var diff = threshold(fastAbs(average1 - average2));
			target[4 * i] = diff;
			target[4 * i + 1] = diff;
			target[4 * i + 2] = diff;
			target[4 * i + 3] = 0xFF;
			++i;
		}
	}

	function checkAreas() {
		var data;
		for (var h = 0; h < hotSpots.length; h++) {
			var blendedData = contextBlended.getImageData(hotSpots[h].x, hotSpots[h].y, hotSpots[h].width, hotSpots[h].height);
			var i = 0;
			var average = 0;
			while (i < (blendedData.data.length * 0.25)) {
				// make an average between the color channel
				average += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2]) / 3;
				++i;
			}
			// calculate an average between the color values of the spot area
			average = Math.round(average / (blendedData.data.length * 0.25));
			if (average > 10) {
				// over a small limit, consider that a movement is detected
				data = {confidence: average, spot: hotSpots[h]};
				$(data.spot.el).trigger('motion', data);
			}
		}
	}

	function getCoords() {
		$('#hotSpots').children().each(function (i, el) {
			var ratio = $("#canvas-highlights").width() / $('video').width();
			hotSpots[i] = {
				x:      this.offsetLeft / ratio,
				y:      this.offsetTop / ratio,
				width:  this.scrollWidth / ratio,
				height: this.scrollHeight / ratio,
				el:     el
			};
		});
		if (OUTLINES) highlightHotSpots();
	}

	$(window).on('start resize', getCoords);

	function highlightHotSpots() {
		var canvas = $("#canvas-highlights")[0];
		var ctx = canvas.getContext('2d');
		canvas.width = canvas.width;
		hotSpots.forEach(function (o, i) {
			ctx.strokeStyle = 'rgba(0,255,0,0.6)';
			ctx.lineWidth = 1;
			ctx.strokeRect(o.x, o.y, o.width, o.height);
		});
	}
})();