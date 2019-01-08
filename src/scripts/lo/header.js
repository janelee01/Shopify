;(function() {
    function Header (el) {
        this.$el = $(el);

        this.scrollThreshold = 40;
        this.breakpoint = 1024;
        this.isTransparent = LS.isTransparentHeader();
        this.isMarqueeVisible = 'shopify-section-marquee'
        this.transparentBgClass = 'showing-alternate';
        this.borderClass = 'after-scroll';
        this.hoverActiveClass = 'mega-menu-active';
        this.hamburgerActive ='mega-menu-active';
        this.menuOpen = 'menu-open'
        this.megaToggles = 'is-active'

        // Outline any constants
        this.triggerClass = 'js-header';
        this.megaClass = 'js-mega-menu';
        this.megaElementClass = 'js-mega-menu-container'
        this.megaToggleFirstClass = 'mega-menu__nav__item:first-child';
        this.megaToggle = 'js-mega-toggle';
        this.menuClose = 'js-menu-close';
        this.isActive = false;
        
        // bind any event handler
        this.onClick = this.onClick.bind(this);
        this.onActiveMenu = this.onActiveMenu.bind(this);
        this.onMenuClose = this.onMenuClose.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onMouseenter = this.onMouseenter.bind(this);
        this.onMouseleave = this.onMouseleave.bind(this);
        
        // Attach any event handler

        this.$el.find('.navbar-toggle').on('click', this.onClick);
        this.$el.find('.js-mega-toggle').on('mousedown touch', this.onActiveMenu);
        this.$el.find('.js-menu-close').on('click', this.onMenuClose);
        this.$el.on('mouseenter touch', this.onMouseenter);
        this.$el.on('mouseleave', this.onMouseleave);

        $(window).on('scroll', this.onScroll);

        this.onScroll();
    }

    Header.prototype.onScroll = function onScroll(e) {
        if (this.isActive) {
            return
        }
        
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
            
            this.toggleActiveState(true)
            return false; 
        } else if ( !this.isActive && isOverBreakpoint ) {
            $toggle.addClass(this.hamburgerActive)
            $mega.addClass(this.menuOpen)
            $header.removeClass(this.transparentBgClass)
            $header.addClass(this.borderClass)
            $allLinks.closest('li').removeClass(this.megaToggles)
            $menuLinkFirst.closest('li').addClass(this.megaToggles, 350)
            
            this.toggleActiveState(true)
            return false; 
        } else {
            $header.find('.mega-menu').scrollTop(0);
            $header.find('.mega-menu__featured__carousel--slick-carousel').slick('slickGoTo', 0);
            $toggle.removeClass(this.hamburgerActive)
            $mega.removeClass(this.menuOpen)
            if (isScrolled) {
                $header.removeClass(this.transparentBgClass)
                $header.addClass(this.borderClass)
            } else {
                $header.addClass(this.transparentBgClass)
                $header.removeClass(this.borderClass)
            }

            this.toggleActiveState(false)
            return false; 
        }
    }

    Header.prototype.isOverBreakpoint = function isOverBreakpoint () {
        return $(window).width() > this.breakpoint
    }

    Header.prototype.onActiveMenu = function onActiveMenu (e) {
        var $allLinks = this.$el.find('.'+this.megaToggle)
        var $menuLink = $(e.currentTarget).closest('li')
        var isOverBreakpoint = this.isOverBreakpoint()

        e.preventDefault();
        if ( !$menuLink.hasClass('is-active') && !isOverBreakpoint ) {
            $allLinks.closest('li').removeClass(this.megaToggles)
            $menuLink.addClass(this.megaToggles)
        }
    }

    Header.prototype.onMenuClose = function onMenuClose (e) {
        var $header = this.$el
        var $mega = $header.parents('.'+this.megaClass)
        var $toggle = $header.find('.'+this.hamburgerActive)
        var isScrolled = $(window).scrollTop() > this.scrollThreshold

        if ( this.isActive && !isScrolled ) {
            $header.find('.mega-menu').scrollTop(0);
            $header.find('.mega-menu__featured__carousel--slick-carousel').slick('slickGoTo', 0);
            $header.addClass(this.transparentBgClass)
            $header.removeClass(this.borderClass)
            $toggle.removeClass(this.hamburgerActive)
            $mega.removeClass(this.menuOpen)
            this.toggleActiveState(false)
        } else {
            $header.find('.mega-menu').scrollTop(0);
            $header.find('.mega-menu__featured__carousel--slick-carousel').slick('slickGoTo', 0);
            $toggle.removeClass(this.hamburgerActive)
            $mega.removeClass(this.menuOpen)
            this.toggleActiveState(false)
        }
    }

    Header.prototype.onMouseenter = function onMouseenter (e) {
        var isOverBreakpoint = this.isOverBreakpoint()
        
        if (!isOverBreakpoint) {
            return
        }
        
        var $header = this.$el
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        
        if ( !isScrolled ) {
            $header.removeClass(this.transparentBgClass)
            $header.addClass(this.borderClass)
        }

        this.toggleActiveState(true)
    }

    Header.prototype.onMouseleave = function onMouseleave (e) {
        var isOverBreakpoint = this.isOverBreakpoint()
        
        if (!isOverBreakpoint) {
            return
        }

        var $header = this.$el
        var isScrolled = $(window).scrollTop() > this.scrollThreshold
        
        if ( !isScrolled ) {
            $header.addClass(this.transparentBgClass)
            $header.removeClass(this.borderClass)
        }

        this.toggleActiveState(false)
    }

    Header.prototype.toggleActiveState = function toggleActiveState (isActive) {
        var $header = this.$el
        var carousel = $header.find('.mega-menu__subnav__item__child')

        var megaMenu = $('.'+this.megaElementClass)[0]

        var isOverBreakpoint = this.isOverBreakpoint()
        
        if (isActive) {
            console.log(carousel)
            if (!isOverBreakpoint) {
                bodyScrollLock.disableBodyScroll(megaMenu, {
                    allowTouchMove: el => {
                      while (el && el !== document.body) {
                        if (el.getAttribute('body-scroll-lock-ignore') !== null) {
                          return true
                        }
                        el = el.parentNode
                      }
                    },
                })
                bodyScrollLock.disableBodyScroll(carousel)
            } else {
                $('body').addClass(this.hoverActiveClass)
            }
            this.isActive = true
        } else {
            if (!isOverBreakpoint) {
                bodyScrollLock.enableBodyScroll(megaMenu)
            } else {
                $('body').removeClass(this.hoverActiveClass)
            }
            this.isActive = false
        }
    }

    $(document).ready(function(){
        $('.js-header').each(function(){
            new Header(this)
        })
    })
})()
