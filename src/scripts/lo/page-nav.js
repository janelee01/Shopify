$(document).ready(function(){

	var $siteHeader = LS.getHeader();
	var $pageNav = LS.getPageNav();
	var $topics = $pageNav.find('.items a');
	var $targets = $('.jumptarget');
	var spacer = 30;
	var trigger = $pageNav.outerHeight();

	if( $pageNav.length ){
		$('body').addClass('has-page-nav');
		$pageNav.detach().appendTo($siteHeader);
  }

	// move a page nav into the header for less fixed position conflicts
	// $pageNav.detach().appendTo($header);

	// local nav for updated shopify designs,
 	// other local navs exist for transferred WP pages
	var setActiveBar = function(){
		var $nav = $('.page-nav .items');
		var $bar = $nav.find('.active-bar');
		var $active = $nav.find('.active');
		var barOffset = $(window).width() >= LS.largeBreakpoint ? 20 : 11; // margins on the nav items
		if( $active.length ){
			$bar.css({
				'left': $active.position().left + barOffset,
				'width': $active.outerWidth()
			});
		}
	};

	if( $('.page-nav .items').length ){

		setActiveBar();
		$(window).resize(function(){
			setActiveBar();
			if( $(window).width() >= LS.desktopBreakpoint ){
				$('.local-nav-section').show();
			}
		});

		// jump to/show a section
		if( location.hash ){
			var $btn = $('[href="' + location.hash + '"]');
			if( !$btn.hasClass('more-window-trigger') ){ 
				$topics.removeClass('active');
				$btn.addClass('active');
				setActiveBar();
				$('html,body').animate({
					scrollTop: LS.getScrollTo( $(location.hash), trigger )
				});
				
			}
		}

		// scroll spy
		$(window).scroll(function(){
			var activeSectionIndex = -1; // reset the active section when we scroll, start at -1 so we can be less than an index of 0
			var scrollPosition = $(window).scrollTop();
			$targets.each(function(i){
				var sectionTopPosition = Math.floor($(this).offset().top) - scrollPosition;
				// section has scrolled past header
				if( sectionTopPosition <= trigger + spacer ){
					// we're only updating the next section down the page since this is true for other sections further up too
					if( i > activeSectionIndex ){
						activeSectionIndex = i;
						$topics.removeClass('active');
						$topics.eq(activeSectionIndex).addClass('active');
						setActiveBar();
					}
				}
			});
			// reset for top of page
			if( scrollPosition < trigger ){
				$topics.removeClass('active');
				$topics.eq(0).addClass('active');
				setActiveBar();
			}
			// update toggle text for current section
			
		});

	}

	// jump to section
	$topics.on('click', function(e){
		
		e.preventDefault();

		var $btn = $(this);
		var selector = $btn.attr('href');

		// If the target isn't an on-page anchor, treat it like a normal link
		if (!selector.match(/^#/)) {
			window.location = selector;
			return;
		}

		// Don't scroll for items that open a more window
		if( $btn.hasClass('more-window-trigger') ){
			return;
		}

		var $target = $(selector);
		if ($target.length === 0) {
			$target = $('body');
		}

		if( $(window).width() >= LS.desktopBreakpoint ){
			// smooth scroll on desktop
			$('html,body').animate({
				scrollTop: LS.getScrollTo( $target, trigger )});
			// scroll spy will update current state
		}else{
			// quick jump on mobile
			$(window).scrollTop( LS.getScrollTo( $target, trigger ) );
			$('nav.items').removeClass('active');
			$topics.removeClass('active');
			$btn.addClass('active');
			
		}

		
	});

});
