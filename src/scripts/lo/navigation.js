$(document).ready(function(){
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
		var $nav = $('nav.local');
		var $bar = $nav.find('.active-bar');
		var $active = $nav.find('.active');
		var barOffset = $(window).width() > LS.desktopBreakpoint ? 20 : 11; // margins on the nav items
		$bar.css({
			'left': $active.position().left + barOffset, 
			'width': $active.outerWidth()
		});
	};
	if( $('nav.local').length ){
		setActiveBar();
		$(window).resize(function(){
			setActiveBar();
			if( $(window).width() > LS.desktopBreakpoint ){
				$('.local-nav-section').show();
			}
		});
	}
	$('body').on('click', 'nav.local a', function(e){
		e.preventDefault();

		var $btn = $(this),
		selector = $btn.attr('href'),
		pos = 0;

		// If the target isn't an on-page anchor, treat it like a normal link
		if (!selector.match(/^#/)) {
			window.location = selector;
			return;
		}

		$target = $(selector);
		if ($target.length === 0) {
			$target = $('body');
		}

		if( $(window).width() > LS.desktopBreakpoint ){
			// smooth scroll on desktop 
			pos = $target.offset().top - $('#site-header').outerHeight() - $('nav.local').outerHeight();
			$('html,body').animate({scrollTop: pos+'px'});
			// scroll spy will update current state
		}else{
			// act like tabs on mobile
			if( !$(this).hasClass('active') ){
				$('nav.local a').removeClass('active');
				$('.local-nav-section').hide().removeClass('active');
				$(this).addClass('active');
				$($(this).attr('href')).next('.local-nav-section').fadeIn();
				setActiveBar();
			}
		}
	});

	// jump to/show a section
	if( $('nav.local').length && location.hash ){
		$('nav.local a').removeClass('active')
		$('[href="'+location.hash+'"]').addClass('active');
		setActiveBar();
		if( $(window).width() <= LS.desktopBreakpoint ){
			$('.local-nav-section').hide();
			$($('nav.local .active').attr('href')).next('.local-nav-section').fadeIn();
		}
	}

	// scroll spy
	if( $('nav.local').length && $(window).width() > LS.desktopBreakpoint ){
		var $topics = $('nav.local a');
		var $targets = $('.jumptarget');
		var headerHeight = $('#site-header').outerHeight() + $('nav.local').outerHeight();
		$(window).scroll(function(){
			var scrollPosition = $(window).scrollTop();
			var activeSectionIndex = 0;
			$targets.each(function(i){
				var sectionTopPosition = $(this).offset().top - scrollPosition;
				if( sectionTopPosition <= headerHeight ){
					if( i > activeSectionIndex ){
						activeSectionIndex = i;
						$topics.removeClass('active');
						$topics.eq(activeSectionIndex).addClass('active');
						setActiveBar();
					}
				}
			});
			if( scrollPosition < headerHeight ){
				$topics.removeClass('active');
				$topics.eq(0).addClass('active');
				setActiveBar();
			}
		});
	}
});