$(document).ready(function(){
	var animation_speed = 800;
	if( $(window).width() < LS.desktopBreakpoint ){
		animation_speed = 500;
	}

	$('.product-gallery').each(function(){

		var galleryKey = $(this).find('.filmroll').attr('id');
		var galleryId = '#' + galleryKey;

		var fr = new FilmRoll({
			container: galleryId,
			scroll: false,
			hover: false, // must be false to allow clickable slides on
			animation: animation_speed,
			easing: 'easeInOutCubic',
			prev: '#gallery-' + $(this).data('sibling') + '-prev',
			next: '#gallery-' + $(this).data('sibling') + '-next',
			vertical_center: false,
			no_css: true
		});

		LS.galleries[galleryKey] = fr;

		// fix the image heights on resize
		var $gallery = $(galleryId);
		var $masterImage = $gallery.find('.master img');

		if($masterImage){
			$gallery.on('film_roll:resizing', function(){
				$gallery.find('.resize img').height($masterImage.height()); 
			});
		}

		// :moved happens on page load so we don't want to watch that one for GA events
		$gallery.data('is-first-move', true);

		$gallery
			.on('film_roll:moved', function(event) {
				// gallery (maybe) shifts to index 0 on load, so hide our loading state when it's done
				$('.gallery-container').removeClass('is-loading');
				$('.gallery-container .loading').fadeOut();
				if( $gallery.closest('.product-gallery').hasClass('active') ){ // protect against watching hidden galleries
				    var $active_slide = $gallery.find('.film_roll_pager a.active');
				    var active_slide_position = $gallery.find('.film_roll_pager a').index( $active_slide ) + 1; // using the pager here because film role adjusts the index of slides with each animation
				    var dataLayer = window.dataLayer || [];
				    // gallery has moved again, trigger GA
				    if( !$gallery.data('is-first-move') ){
				    	dataLayer.push({
				    		'event' : 'galleryNavigation',
				    		'productImage' : active_slide_position
				    	});
				    }
				}
				// update state to catch next event that moves the gallery 
				$gallery.data('is-first-move', false);
			})
			.on('film_roll:activate', function(event){ // done loading
				LS.toggleGalleryControls($gallery);
				// if the gallery doesn't need to move because it's narrower than the window, show it when ready
				// shuttle will be twice the width of the child elements
				if( $gallery.find('.film_roll_shuttle').width()/2 < $(window).width() ){
					$('.gallery-container').removeClass('is-loading');
					$('.gallery-container .loading').fadeOut();
				}
			})
			.on('film_roll:resized', function(event){ // window size changes
				LS.toggleGalleryControls($gallery);
			});
	});
});