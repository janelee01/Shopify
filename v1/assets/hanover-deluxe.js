jQuery(document).ready(function($){

	var video10 = document.getElementById("video10");
	if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video10').append('<source src="https://player.vimeo.com/external/241600172.sd.mp4?s=e2a54255d2fb98569b6a56dbc70554f88899feca&profile_id=164" type="video/mp4" />');
    } else {
        $('#video10').append('<source src="https://player.vimeo.com/external/241600172.hd.mp4?s=5fc55a7cb88cfdc1b97f712b8a8689b4a99cce1d&profile_id=175" type="video/mp4" />');
    }
    video10.oncanplay = function() {
       $('#inline-video-10 .loading').fadeOut();
       if( LS.isElementInViewport(document.getElementById("inline-video-10")) ){
       	var playPromise = video10.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-10")) ){
			if( !$('#inline-video-10').hasClass('ended') ){
				var playPromise = video10.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video10.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
	var playCount10 = 0;
	var lastTime = 0;
	var $overlayText = $('#video10').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video10.addEventListener("timeupdate", function() {
		if( video10.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount10 === 200 ){
			video10.pause();
			$('#inline-video-10').addClass('ended');
			$('.video-trigger10').fadeIn('slow');
		}
						if( video10.currentTime < lastTime ){
			playCount10++;
			lastTime = 0;
		}else{
			lastTime = video10.currentTime;
		}
	}, true);
				$('.video-trigger10').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-10').removeClass('ended');
		playCount10 = 0;
	    video10.play();
	});
});


jQuery(document).ready(function($){
	var video20 = document.getElementById("video20");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video20').append('<source src="https://player.vimeo.com/external/241600896.sd.mp4?s=e3441aa0a302aabbe8d34e22d0b05de0105e46a1&profile_id=164" type="video/mp4" />');
    } else {
        $('#video20').append('<source src="https://player.vimeo.com/external/241600896.hd.mp4?s=a3a70f3b73e6fe3a990e8c74143a272919240aca&profile_id=175" type="video/mp4" />');
    }
    		    video20.oncanplay = function() {
       $('#inline-video-20 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-20")) ){
       	var playPromise = video20.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-20")) ){
			if( !$('#inline-video-20').hasClass('ended') ){
				var playPromise = video20.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video20.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
				var playCount20 = 0;
	var lastTime = 0;
	var $overlayText = $('#video20').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video20.addEventListener("timeupdate", function() {
		if( video20.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount20 === 200 ){
			video20.pause();
			$('#inline-video-20').addClass('ended');
			$('.video-trigger20').fadeIn('slow');
		}
						if( video20.currentTime < lastTime ){
			playCount20++;
			lastTime = 0;
		}else{
			lastTime = video20.currentTime;
		}
	}, true);
				$('.video-trigger20').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-20').removeClass('ended');
		playCount20 = 0;
	    video20.play();
	});
});

jQuery(document).ready(function($){
	var video30 = document.getElementById("video30");
	if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video30').append('<source src="https://player.vimeo.com/external/241601650.sd.mp4?s=a7483a1b1a9a154206b5d8317dd29570269a396c&profile_id=164" type="video/mp4" />');
    } else {
        $('#video30').append('<source src="https://player.vimeo.com/external/241601650.hd.mp4?s=86cc3b842ef6dad70a194a3d9ad3dd0667434656&profile_id=175" type="video/mp4" />');
    }
    video30.oncanplay = function() {
       $('#inline-video-30 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-30")) ){
       	var playPromise = video30.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-30")) ){
			if( !$('#inline-video-30').hasClass('ended') ){
				var playPromise = video30.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video30.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
	var playCount30 = 0;
	var lastTime = 0;
	var $overlayText = $('#video30').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video30.addEventListener("timeupdate", function() {
		if( video30.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount30 === 200 ){
			video30.pause();
			$('#inline-video-30').addClass('ended');
			$('.video-trigger30').fadeIn('slow');
		}
		if( video30.currentTime < lastTime ){
			playCount30++;
			lastTime = 0;
		}else{
			lastTime = video30.currentTime;
		}
	}, true);
	$('.video-trigger30').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-30').removeClass('ended');
		playCount30 = 0;
	    video30.play();
	});
});

jQuery(document).ready(function($){
	var video40 = document.getElementById("video40");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video40').append('<source src="https://player.vimeo.com/external/241600734.sd.mp4?s=2b3db5abcd251b3818ecb5282b4479cd23492678&profile_id=164" type="video/mp4" />');
    } else {
        $('#video40').append('<source src="https://player.vimeo.com/external/241600734.hd.mp4?s=0d992524718a6f2a701e0728512ee6083f69ba64&profile_id=175" type="video/mp4" />');
    }
    		    video40.oncanplay = function() {
       $('#inline-video-40 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-40")) ){
       	var playPromise = video40.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-40")) ){
			if( !$('#inline-video-40').hasClass('ended') ){
				var playPromise = video40.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video40.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
				var playCount40 = 0;
	var lastTime = 0;
	var $overlayText = $('#video40').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video40.addEventListener("timeupdate", function() {
		if( video40.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount40 === 200 ){
			video40.pause();
			$('#inline-video-40').addClass('ended');
			$('.video-trigger40').fadeIn('slow');
		}
						if( video40.currentTime < lastTime ){
			playCount40++;
			lastTime = 0;
		}else{
			lastTime = video40.currentTime;
		}
	}, true);
				$('.video-trigger40').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-40').removeClass('ended');
		playCount40 = 0;
	    video40.play();
	});
});

jQuery(document).ready(function($){
	var video50 = document.getElementById("video50");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video50').append('<source src="https://player.vimeo.com/external/241600377.sd.mp4?s=26f37b3bd165b852e4d3ae9f9000512ecd4e716a&profile_id=164" type="video/mp4" />');
    } else {
        $('#video50').append('<source src="https://player.vimeo.com/external/241600377.hd.mp4?s=87603763bef0e7db871f17d6a9d9a41224b62c0e&profile_id=175" type="video/mp4" />');
    }
    		    video50.oncanplay = function() {
       $('#inline-video-50 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-50")) ){
       	var playPromise = video50.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-50")) ){
			if( !$('#inline-video-50').hasClass('ended') ){
				var playPromise = video50.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video50.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
				var playCount50 = 0;
	var lastTime = 0;
	var $overlayText = $('#video50').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video50.addEventListener("timeupdate", function() {
		if( video50.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount50 === 200 ){
			video50.pause();
			$('#inline-video-50').addClass('ended');
			$('.video-trigger50').fadeIn('slow');
		}
						if( video50.currentTime < lastTime ){
			playCount50++;
			lastTime = 0;
		}else{
			lastTime = video50.currentTime;
		}
	}, true);
				$('.video-trigger50').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-50').removeClass('ended');
		playCount50 = 0;
	    video50.play();
	});
});

jQuery(document).ready(function($){
	var video60 = document.getElementById("video60");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video60').append('<source src="https://player.vimeo.com/external/241601273.sd.mp4?s=25f9e25f8fc33a0bab59086048a02a3ee3835f0d&profile_id=164" type="video/mp4" />');
    } else {
        $('#video60').append('<source src="https://player.vimeo.com/external/241601273.hd.mp4?s=108513651e3fdaea38a5bdf0f0c79dc1c1279833&profile_id=175" type="video/mp4" />');
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
		if( playCount60 === 200 ){
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

jQuery(document).ready(function($){
	var video70 = document.getElementById("video70");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video70').append('<source src="https://player.vimeo.com/external/241600547.sd.mp4?s=bb987a83fded2ab77b11f53d2aa22dcc44cbbfd0&profile_id=164" type="video/mp4" />');
    } else {
        $('#video70').append('<source src="https://player.vimeo.com/external/241600547.hd.mp4?s=f7a807372fb04bb149644986a47dd228fbce2f9a&profile_id=174" type="video/mp4" />');
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
		if( playCount70 === 200 ){
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

jQuery(document).ready(function($){
	var video80 = document.getElementById("video80");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video80').append('<source src="https://player.vimeo.com/external/241599208.sd.mp4?s=5f01299c44ff1aaa60673444c194dfd46c5a0a3f&profile_id=165" type="video/mp4" />');
    } else {
        $('#video80').append('<source src="https://player.vimeo.com/external/241599208.hd.mp4?s=cbeb340a99b864ebdf62f469a661586034ac2e88&profile_id=174" type="video/mp4" />');
    }
    		    video80.oncanplay = function() {
       $('#inline-video-80 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-80")) ){
       	var playPromise = video80.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-80")) ){
			if( !$('#inline-video-80').hasClass('ended') ){
				var playPromise = video80.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video80.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
				var playCount80 = 0;
	var lastTime = 0;
	var $overlayText = $('#video80').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video80.addEventListener("timeupdate", function() {
		if( video80.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount80 === 100 ){
			video80.pause();
			$('#inline-video-80').addClass('ended');
			$('.video-trigger80').fadeIn('slow');
		}
						if( video80.currentTime < lastTime ){
			playCount80++;
			lastTime = 0;
		}else{
			lastTime = video80.currentTime;
		}
	}, true);
				$('.video-trigger80').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-80').removeClass('ended');
		playCount80 = 0;
	    video80.play();
	});
});

jQuery(document).ready(function($){
	var video90 = document.getElementById("video90");
				if ( $(window).width() < LS.desktopBreakpoint) {
        $('#video90').append('<source src="https://player.vimeo.com/external/241599569.sd.mp4?s=934604c792895dac1ed6684e9712b7f515c874f3&profile_id=165" type="video/mp4" />');
    } else {
        $('#video90').append('<source src="https://player.vimeo.com/external/241599569.hd.mp4?s=01a1096ae07d0fc5ffd8c61fe1ac8a2bb2c1ad34&profile_id=175" type="video/mp4" />');
    }
    		    video90.oncanplay = function() {
       $('#inline-video-90 .loading').fadeOut();
       		       if( LS.isElementInViewport(document.getElementById("inline-video-90")) ){
       	var playPromise = video90.play();
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
		if( LS.isElementInViewport(document.getElementById("inline-video-90")) ){
			if( !$('#inline-video-90').hasClass('ended') ){
				var playPromise = video90.play();
				if (playPromise !== undefined) {
				  playPromise.then(function() {
				    // Automatic playback started, nothing to do
				  }).catch(function(error) {
				    console.log('Playback did not start. Reason: ' + error)
				  });
				}
			}
		}else{
			var pausePromise = video90.pause();
			if (pausePromise !== undefined) {
			  pausePromise.then(function() {
			    // Paused, nothing to do
			  }).catch(function(error) {
			    console.log('Pause error. Reason: ' + error)
			  });
			}
		}
	});
				var playCount90 = 0;
	var lastTime = 0;
	var $overlayText = $('#video90').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
	video90.addEventListener("timeupdate", function() {
		if( video90.currentTime > 5 ){
			$overlayText.fadeOut();
		}
		if( playCount90 === 100 ){
			video90.pause();
			$('#inline-video-90').addClass('ended');
			$('.video-trigger90').fadeIn('slow');
		}
						if( video90.currentTime < lastTime ){
			playCount90++;
			lastTime = 0;
		}else{
			lastTime = video90.currentTime;
		}
	}, true);
				$('.video-trigger90').on('click', function(e){
		e.preventDefault();
		$(this).fadeOut('fast');
		$('#inline-video-90').removeClass('ended');
		playCount90 = 0;
	    video90.play();
	});
});

	