function ToggleMenu (el) {
  this.el = el;
  this.triggerClass = 'js-toggle-menu';
  this.isActive = false;
  this.breakpoint = 1024;
  this.onClick = this.onClick.bind(this);
  this.onKeyUp = this.onKeyUp.bind(this);
  this.onMouseover = this.onMouseover.bind(this);

  $('.js-toggle-menu-overlay').on('click', this.stopPropagation);
  
  $('body').on('click', this.onClick);
  $('body').on('keyup', this.onKeyUp);
  $('header .mega-menu__nav__item').on('mouseover', this.onMouseover);
  $('header .help-link').on('mouseover', this.onMouseover);
}

ToggleMenu.prototype.onClick = function onClick (e) {
  const $target = $(e.target)

  if (
    !this.isActive && (
      $target.is(this.el) || 
      $target.parents().is(this.el)
    )) {
      this.addActiveClass();
      return
  }

  if ( this.isActive ) {
      this.removeActiveClass();
      return
  }
}

ToggleMenu.prototype.onKeyUp = function onKeyUp (e) {
  if (e.which !== 27) {
    return
  }

  this.removeActiveClass()
}

ToggleMenu.prototype.onMouseover = function onMouseover () {
  var isOverBreakpoint = $(window).width() > this.breakpoint

  if ( isOverBreakpoint ) {
    this.isActive = false
    $(this.el).removeClass('is-active')
  }
}

ToggleMenu.prototype.removeActiveClass = function removeActiveClass () {
  this.isActive = false;
  $(this.el).removeClass('is-active')
}

ToggleMenu.prototype.addActiveClass = function addActiveClass () {
  const el = this.el;
  this.isActive = true;
  $(el).addClass('is-active')
  
  setTimeout(function() {
    $(el).find('input').focus()
  }, 300)
}

ToggleMenu.prototype.stopPropagation = function stopPropagation (e) {
  const $target = $(e.target);

  if (
    $target.is('button') || 
    $target.parents('button').length
  ) {
    return true;
  }

  e.stopPropagation();
}


$(document).ready(function(){
  $('.js-toggle-menu').each(function(){
    new ToggleMenu(this)
  })
})