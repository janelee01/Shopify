jQuery(document).ready(function($){
			var video70 = document.getElementById("video70");
						if ( $(window).width() < LS.desktopBreakpoint) {
		        $('#video70').append('<source src="https://player.vimeo.com/external/129575639.hd.mp4?s=af4c96d3ea9b7b109b426d5b17251ff651c8ea4c&profile_id=113" type="video/mp4" />');
		    } else {
		        $('#video70').append('<source src="https://player.vimeo.com/external/129575639.sd.mp4?s=7cb3cd796df1e5072de992e7bc6f29d140d1cbfe&profile_id=112" type="video/mp4" />');
		    }
		    		    video70.oncanplay = function() {
		       $('#inline-video-70 .loading').fadeOut();
		       		       if( LS.isElementInViewport(document.getElementById("inline-video-70")) ){
		       	var playPromise = video70.play();
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
				if( LS.isElementInViewport(document.getElementById("inline-video-70")) ){
					if( !$('#inline-video-70').hasClass('ended') ){
						var playPromise = video70.play();
						if (playPromise !== undefined) {
						  playPromise.then(function() {
						    // Automatic playback started, nothing to do
						  }).catch(function(error) {
						    console.log('Playback did not start. Reason: ' + error)
						  });
						}
					}
				}else{
					var pausePromise = video70.pause();
					if (pausePromise !== undefined) {
					  pausePromise.then(function() {
					    // Paused, nothing to do
					  }).catch(function(error) {
					    console.log('Pause error. Reason: ' + error)
					  });
					}
				}
			});
						var playCount70 = 0;
			var lastTime = 0;
			var $overlayText = $('#video70').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
			video70.addEventListener("timeupdate", function() {
				if( video70.currentTime > 5 ){
					$overlayText.fadeOut();
				}
				if( playCount70 === 10 ){
					video70.pause();
					$('#inline-video-70').addClass('ended');
					$('.video-trigger70').fadeIn('slow');
				}
								if( video70.currentTime < lastTime ){
					playCount70++;
					lastTime = 0;
				}else{
					lastTime = video70.currentTime;
				}
			}, true);
						$('.video-trigger70').on('click', function(e){
				e.preventDefault();
				$(this).fadeOut('fast');
				$('#inline-video-70').removeClass('ended');
				playCount70 = 0;
			    video70.play();
			});
		});