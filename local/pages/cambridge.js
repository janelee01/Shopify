jQuery(document).ready(function($){
	var video60 = document.getElementById("video60");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video60').append('<source src="https://player.vimeo.com/external/129575638.sd.mp4?s=7a79dd0cde596d309486ece8fa4b9b65222682b6&profile_id=112" type="video/mp4" />');
    } else {
        $('#video60').append('<source src="https://player.vimeo.com/external/129575638.hd.mp4?s=a17142d2998e4a95fdbf1a511c35e27ff1c40171&profile_id=119" type="video/mp4" />');
    }
    		    video60.oncanplay = function() {
       $('#inline-video-60 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-60")) ){
       	var playPromise = video60.play();
       	if (playPromise !== undefined) {
       	  playPromise.then(function() {
       	    // Automatic playback started, nothing to do
       	  }).catch(function(error) {
       	    console.log('Playback did not start. Reason: ' + error)
       	  });
       	}
       }
    };
				$(window).scroll(function(){
		if( LS.isElementInViewport(document.getElementById("inline-video-60")) ){
			if( !$('#inline-video-60').hasClass('ended') ){
				var playPromise = video60.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video60.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
				var playCount60 = 0;
	var lastTime = 0;
	var $overlayText = $('#video60').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video60.addEventListener("timeupdate", function() {
		if( video60.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount60 === 100 ){
			video60.pause();
			$('#inline-video-60').addClass('ended');
			$('.video-trigger60').fadeIn('slow');
		}
						if( video60.currentTime < lastTime ){
			playCount60++;
			lastTime = 0;
		}else{
			lastTime = video60.currentTime;
		}
	}, true);
				$('.video-trigger60').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-60').removeClass('ended');
		playCount60 = 0;
	    video60.play();
	});
});