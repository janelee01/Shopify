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
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        var isOverBreakpoint = $(window).width() > this.breakpoint

        if ( !this.isActive && !isOverBreakpoint ) {
            $toggle.addClass(this.hamburgerActive)
            $mega.addClass(this.menuOpen)
            $header.removeClass(this.transparentBgClass)
            $allLinks.closest('li').removeClass(this.megaToggles)
            $menuLinkFirst.closest('li').addClass(this.megaToggles, 350)
            this.isActive = true;
            return false; 
        } else if ( !this.isActive && isOverBreakpoint ) {
            $toggle.addClass(this.hamburgerActive)
            $mega.addClass(this.menuOpen)
            $header.removeClass(this.transparentBgClass)
            $header.addClass(this.borderClass)
            $allLinks.closest('li').removeClass(this.megaToggles)
            $menuLinkFirst.closest('li').addClass(this.megaToggles, 350)
            this.isActive = true;
            return false; 
        } else {
            $toggle.removeClass(this.hamburgerActive)
            $mega.removeClass(this.menuOpen)
            if (isScrolled) {
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
        }
    }

    Header.prototype.onMouseleave = function onMouseleave (e) {
        var $header = this.$el
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        var isOverBreakpoint = $(window).width() > this.breakpoint

        if ( isOverBreakpoint && !isScrolled ) {
            $header.addClass(this.transparentBgClass)
            $header.removeClass(this.borderClass)
        }
    }
    $(document).ready(function(){
        $('.js-header').each(function(){
            new Header(this)
        })
    })
})()
