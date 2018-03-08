$(document).ready(function(){
	var $videos = $('.embed-container');
	$videos.each(function(){
		var $embed = $(this);
		var videoId = $(this).find('video').attr('id');
		var video = document.getElementById(videoId);
		var autoPlay = $(this).data('autoplay');
		var loops = $(this).data('loops');
		var videoUrl = $embed.data('desktop-url');
		var mobileVideoUrl = $embed.data('mobile-url');

		if ( $(window).width() < LS.desktopBreakpoint && mobileVideoUrl ) {
	        $('#'+videoId).append('<source src="' + mobileVideoUrl + '" type="video/mp4" />');
	    } else {
	        $('#'+videoId).append('<source src="' + videoUrl + '" type="video/mp4" />');
	    }

		video.oncanplay = function() {
			$embed.find('.loading').fadeOut();
			// play it if we can see it 
			if( LS.isElementInViewport(video) && $embed.data('autoplay') ){
				var playPromise = video.play();
				if (playPromise !== undefined) {
					playPromise.then(function() {
						// Automatic playback started, nothing to do
					}).catch(function(error) {
						console.log('Playback did not start. Reason: ' + error)
					});
				}
			}
		};

		// play/pause based on visibility
		$(window).scroll(function(){
			if( LS.isElementInViewport(video) ){
				if( !$embed.hasClass('ended') && $embed.data('autoplay') ){
					var playPromise = video.play();
					if (playPromise !== undefined) {
						playPromise.then(function() {
							// Automatic playback started, nothing to do
						}).catch(function(error) {
							console.log('Playback did not start. Reason: ' + error)
						});
					}
				}
			}else{
				var pausePromise = video.pause();
				if (pausePromise !== undefined) {
					pausePromise.then(function() {
						// Paused, nothing to do
					}).catch(function(error) {
						console.log('Pause error. Reason: ' + error)
					});
				}
			}
		});

		// limit number of plays and maybe hide overlay text
		var playCount= 0;
		var lastTime = 0;
		video.addEventListener("timeupdate", function() {
			if( playCount === loops ){
				video.pause();
				$embed.addClass('ended');
				$embed.find('.video-trigger').fadeIn('slow');
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
	$('body').on('click', '.overview-video-trigger', function(e){
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
});