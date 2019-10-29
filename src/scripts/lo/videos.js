$(document).ready(function(){
	var $videos = $('.embed-container');

	var startStopVideo = function($embed,video,forceStart){

	    // disable autoplay when:
	    // this is mobile
	    // click to play UI is present
	    // play hasn't been clicked
    	if ( $(window).width() < LS.tabletBreakpoint && $embed.parent('.click-to-play').length && !$embed.parent('.click-to-play').hasClass('playing') ) {
            return;
        }

		if( LS.isElementInViewport(video) && $embed.data('autoplay') || forceStart ){
			var playPromise = video.play();
			if (playPromise !== undefined) {
				playPromise.then(function() {
					// successfully started
				}).catch(function(error) {
					console.log('Playback did not start. Reason: ' + error)
				});
			}
		}else if( !video.paused ){
			var pausePromise = video.pause();
			if (pausePromise !== undefined) {
				pausePromise.then(function() {
					// sucessfully paused
				}).catch(function(error) {
					console.log('Pause error. Reason: ' + error)
				});
			}
		}
	};

	$videos.each(function(){
		var $embed = $(this);
		var videoId = $embed.find('video').attr('id');
		var video = document.getElementById(videoId);
		var autoPlay = $embed.data('autoplay');
		var loops = $embed.data('loops');
		var forceStart = $embed.data('force');

		if( !videoId ) return;

		video.oncanplay = function() {
			$embed.find('.loading').fadeOut();
			// play it if we can see it
			startStopVideo($embed, video, forceStart);
		};

		// play/pause based on visibility
		$(window).scroll(function(){
			startStopVideo($embed, video, forceStart);
		});

		// limit number of plays and maybe hide overlay text
		var playCount = 0;
		var lastTime = 0;
		video.addEventListener("timeupdate", function() {
			if( playCount === loops ){
				video.pause();
				$embed.addClass('ended');
				$embed.find('.video-trigger').fadeIn('slow');
			}

			// watch the first loop to see how long the user watches it
			// the video will only be playing while in the viewport so can assume they're seeing it intentially (in theory)
			if( playCount == 0 ){
				LS.reportVideoProgress(video.currentTime, video.duration);
			}

			// catching the start of the video is tricky with the loop, so see if the current time is the last time we saved ?>
			if( video.currentTime < lastTime ){
				playCount++;
				lastTime = 0;
			}else{
				lastTime = video.currentTime;
			}
		}, true);

		// that was cool, play it again ?>
		$embed.find('.video-trigger').on('click', function(e){
			e.preventDefault();
			$(this).fadeOut('fast');
			$embed.removeClass('ended');
			playCount = 0;
			video.play();
		});
	});

	// Product video
	$('body').on('click', '.product-video-trigger', function(e){
		e.preventDefault();
		LS.productVideoOpen(1); // button always shows the first video
	});
	$('body').on('click', '.has-video', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});
	$('body').on('click', '.video-trigger', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});

	$('body').on('click', '#product-video .panel-close', function(e){
		e.preventDefault();
		LS.productVideoClose();
	});
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) { // escape key maps to keycode `27`
	    	LS.productVideoClose();
	    }
	});
	// Gallery Videos
	$('.pdp-gallery-video').each(function(){
		var video = document.getElementById($(this).find('video').attr('id'));
		console.log($(this).find('video').attr('id'));
		video.addEventListener('loadedmetadata', function(){
			var playPromise = video.play();
			if (playPromise !== undefined) {
				playPromise.then(function() {
					console.log('video started');
				}).catch(function(error) {
					console.log('Playback did not start. Reason: ' + error)
				});
			}
		});
	});
});
