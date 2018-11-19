$(document).ready(function(){

	var $pageNav = LS.getPageNav();
	var $header = LS.getHeader();
	var $topics = $pageNav.find('.items a');
	var $targets = $('.jumptarget');
	var spacer = 30;
	var trigger = $pageNav.outerHeight();

	// move a page nav into the header for less fixed position conflicts
	$pageNav.detach().appendTo($header);

	// reload nav state
	var savedState = sessionStorage.getItem('lo-main-menu');
	if( savedState ){
		$('#site-menu-items').html(savedState);
	}
	$('#site-menu a').on('click', function(){
		sessionStorage.setItem('lo-main-menu', $('#site-menu-items').html());
	});

	// off canvas nav
	$('body').on('click', '.navbar-toggle', function(e){
		e.preventDefault();
		$('body').toggleClass('menu-open');
		LS.overlay.open();
	});
	$('body').on('click', '#nav-panel-close', function(e){
		e.preventDefault();
		$('body').removeClass('menu-open');
		LS.overlay.close();
	});
	$('.site-content').on('click', function(e){
		if( $('body').hasClass('menu-open') ){
			e.stopPropagation();
			$('body').removeClass('menu-open');
			LS.overlay.close();
		}
	});
	$('body').on('click', '.menu-toggle', function(e){
		e.preventDefault();
		$(this).closest('li').toggleClass('open');
	});

 	// local nav for updated shopify designs,
 	// other local navs exist for transferred WP pages
	var setActiveBar = function(){
		var $nav = $('.page-nav .items');
		var $bar = $nav.find('.active-bar');
		var $active = $nav.find('.active');
		var barOffset = $(window).width() >= LS.largeBreakpoint ? 20 : 11; // margins on the nav items
		$bar.css({
			'left': $active.position().left + barOffset, 
			'width': $active.outerWidth()
		});
	};

	var setActiveText = function(){
		$('#items-toggle').text($('nav.items a.active').text());
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
			$topics.removeClass('active');
			$('[href="'+location.hash+'"]').addClass('active');
			setActiveBar();
			$('html,body').animate({
				scrollTop: LS.getScrollTo( $(location.hash), trigger )
			});
			setActiveText();
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
			setActiveText();
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

		$target = $(selector);
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
			setActiveText();
		}

		$('#items-toggle').removeClass('active');
	});

	// open the items on mobile
	$('#items-toggle').on('click', function(e){
	    e.preventDefault();
	    $(this).toggleClass('active');
	    $('nav.items').toggleClass('active');
	});
});