function ToggleMenu (el) {
  this.el = el;
  this.triggerClass = 'js-toggle-menu';
  this.isActive = false;
  this.onClick = this.onClick.bind(this);
  this.onKeyUp = this.onKeyUp.bind(this);

  $('.js-toggle-menu-overlay').on('click', this.stopPropagation);
  
  $(this.el).on('click', this.onClick);
  $('body').on('keyup', this.onKeyUp);
}

ToggleMenu.prototype.onClick = function onClick (e) {
  const $target = $(e.target)

  if (
    !this.isActive && (
      $target.hasClass(this.triggerClass) || 
      $target.parents('.'+this.triggerClass).length
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