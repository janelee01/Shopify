;(function() {
    function Header (el) {
        this.$el = $(el);

        this.scrollThreshold = 40;
        this.breakpoint = 1024;
        this.isTransparent = LS.isTransparentHeader();
        this.isMarqueeVisible = 'shopify-section-marquee'
        this.transparentBgClass = 'showing-alternate';
        this.borderClass = 'after-scroll';
        this.hamburgerActive ='mega-menu-active';
        this.menuOpen = 'menu-open'
        this.megaToggles = 'isActive'

        // Outline any constants
        this.triggerClass = 'js-header';
        this.megaClass = 'js-mega-menu';
        this.megaToggleFirstClass = 'mega-menu__nav__item:first-child';
        this.megaToggle = 'js-mega-toggle';
        this.menuClose = 'js-menu-close';
        this.isActive = false;
        // this.isScrolled = false;
        
        // bind any event handler
        this.onClick = this.onClick.bind(this);
        this.onActiveMenu = this.onActiveMenu.bind(this);
        this.onMenuClose = this.onMenuClose.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onMouseenter = this.onMouseenter.bind(this);
        this.onMouseleave = this.onMouseleave.bind(this);
        
        // Attach any event handler

        this.$el.find('.navbar-toggle').on('click', this.onClick);
        this.$el.find('.js-mega-toggle').on('click', this.onActiveMenu);
        this.$el.find('.js-menu-close').on('click', this.onMenuClose);
        this.$el.on('mouseenter', this.onMouseenter);
        this.$el.on('mouseleave', this.onMouseleave);


        $(window).on('scroll', this.onScroll);

        this.onScroll();
    }

    Header.prototype.onScroll = function onScroll(e) {
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        this.$el[isScrolled ? 'addClass' : 'removeClass'](this.borderClass)
        
        if (!this.isTransparentHeader) {
            // return
        }
        this.$el[isScrolled ? 'removeClass' : 'addClass'](this.transparentBgClass)
    }
        
    Header.prototype.onClick = function onClick (e) {
        var $header = this.$el
        var $mega = $header.parents('.'+this.megaClass)
        var $toggle = $(e.currentTarget)
        var $allLinks = this.$el.find('.'+this.megaToggle)
        var $menuLinkFirst = this.$el.find('.'+this.megaToggleFirstClass)
        var $marquee = this.$el.find('#'+this.isMarqueeVisible)
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        var isOverBreakpoint = $(window).width() > this.breakpoint

        // console.log($marquee.outerHeight())
        // if ( '$marquee:visible' && !isOverBreakpoint ) {
        //     console.log($marquee)
        //     $('#site-nav-panel').css('top', $marquee.outerHeight());
        // }

        if ( !this.isActive ) {
            if ( '$marquee:visible' && !isOverBreakpoint ) {
                console.log($marquee)
                $('#site-nav-panel').css('top', $marquee.outerHeight())
            } if ( isScrolled ) {
                $('#site-nav-panel').css('top', 0)                
            }
            $toggle.addClass(this.hamburgerActive)
            $mega.addClass(this.menuOpen)
            $header.addClass(this.borderClass)
            $header.removeClass(this.transparentBgClass)
            $allLinks.closest('li').removeClass(this.megaToggles)
            $menuLinkFirst.closest('li').addClass(this.megaToggles, 350)
            this.isActive = true;
            return false; 
        } else {
            if ( '$marquee:visible' && !isOverBreakpoint ) {
                console.log('is visible')
                $('#site-nav-panel').css('top', '-100%')
            }
            $toggle.removeClass(this.hamburgerActive)
            $mega.removeClass(this.menuOpen)
            if (isScrolled) {
                $('#site-nav-panel').css('top', '')
                $header.removeClass(this.transparentBgClass)
                $header.addClass(this.borderClass)
            } else {
                $header.addClass(this.transparentBgClass)
                $header.removeClass(this.borderClass)
            }
            this.isActive = false;
            return false; 
        }
    }

    Header.prototype.onActiveMenu = function onActiveMenu (e) {
        var $allLinks = this.$el.find('.'+this.megaToggle)
        var $menuLink = $(e.currentTarget).closest('li')

        if ( $menuLink.hasClass('isActive') ) {
            return
        } else {
            $allLinks.closest('li').removeClass(this.megaToggles)
            $menuLink.addClass(this.megaToggles)
            console.log('does not have is active')
        }
    }

    Header.prototype.onMenuClose = function onMenuClose (e) {
        // var $closeMenu = $(e.currentTarget)
        var $header = this.$el
        var $mega = $header.parents('.'+this.megaClass)
        var $toggle = $header.find('.'+this.hamburgerActive)

        if ( this.isActive ) {
            $toggle.removeClass(this.hamburgerActive)
            $mega.removeClass(this.menuOpen)
            this.isActive = false
        }
    }

    Header.prototype.onMouseenter = function onMouseenter (e) {
        var $header = this.$el
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        var isOverBreakpoint = $(window).width() > this.breakpoint

        if ( isOverBreakpoint && !isScrolled ) {
            $header.removeClass(this.transparentBgClass)
            $header.addClass(this.borderClass)
        } else {
            return
        }
    }

    Header.prototype.onMouseleave = function onMouseleave (e) {
        var $header = this.$el
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        var isOverBreakpoint = $(window).width() > this.breakpoint

        if ( isOverBreakpoint && !isScrolled ) {
            $header.addClass(this.transparentBgClass)
            $header.removeClass(this.borderClass)
        } else {
            return
        }
    }
    $(document).ready(function(){
        $('.js-header').each(function(){
            new Header(this)
        })
    })
})()

/**
 $('body').on('click', '.menu-toggle', function(e){
		$('.menu-toggle').not(this).closest('li').removeClass('isActive');
		e.preventDefault();
		$(this).closest('li').addClass('isActive');
	});


  	var scrolledClass = 'after-scroll';
	// if ($(window).scrollTop() > trigger) {
	// 	$header.addClass(scrolledClass);
	// }
	// adjust on scroll
	$(window).scroll(function () {
		if ($(window).scrollTop() < trigger) {
			$header.removeClass(scrolledClass);
		} else {
			$header.addClass(scrolledClass);
		}
	});

// untransparentize header
  if( $('body').hasClass('has-tw-header') || $('body').hasClass('has-tb-header') ){

  	// if we're down the page already
  	if( $(window).scrollTop() > trigger ){
  		$header.removeClass('showing-alternate');
  	}
  	// adjust on scroll
  	$(window).scroll(function(){
  		if( $(window).scrollTop() < trigger ){
  			$header.addClass('showing-alternate');
  		}else{
  			$header.removeClass('showing-alternate');
  		}
	});
  }

$('body').on('click', '.navbar-toggle', function(e){
		if ($header.hasClass('showing-alternate')) {
			$header.removeClass('showing-alternate');
		}
		e.preventDefault();
		$('body').toggleClass('menu-open');
		$('.mega-menu').scrollTop(0);
		LS.overlay.open();
	});

	$('body').on('click', '.menu-close', function(e){
		e.preventDefault();
		$('body').toggleClass('menu-open');
		$('.navbar-toggle').toggleClass('mega-menu-active');
		$('.mega-menu').scrollTop(0);
	});

	$('body').on('click', '.navbar-toggle', function(e){
		$('.mega-menu__nav__item').removeClass('isActive');
		$(this).toggleClass('mega-menu-active');
		$('.mega-menu__nav__item:first-child').addClass('isActive');
	});

	// these should only apply at breakpoint
	$('body').on('mouseenter', '#site-header-items', function(e){
		$header.removeClass('showing-alternate');
		$header.addClass('after-scroll');
	});
	
	// $('body').on('mouseleave', '#site-header-items', function(e){
	// 	$header.addClass('showing-alternate');
	// 	$header.removeClass('after-scroll');
	// });

	// $('body').on('click', '#nav-panel-close', function(e){
	// 	e.preventDefault();
	// 	$('body').removeClass('menu-open');
	// 	LS.overlay.close();
	// });
	// $('.site-content').on('click', function(e){
	// 	if( $('body').hasClass('menu-open') ){
	// 		e.stopPropagation();
	// 		$('body').removeClass('menu-open');
	// 		LS.overlay.close();
	// 	}
	// });
	$('body').on('click', '.menu-toggle', function(e){
		$('.menu-toggle').not(this).closest('li').removeClass('isActive');
		e.preventDefault();
		$(this).closest('li').addClass('isActive');
	});


*/