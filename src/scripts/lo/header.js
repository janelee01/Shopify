$(document).ready(function(){

  var $marquee = LS.getMarquee();
    
  var closeHeaderPanels = function(){
    $('body').removeClass('site-menu-open help-menu-shown');
  };

  // keyboard close things
  $('body').on('keyup', function(e){
    // keyCode is getting deprecated use key instead when supported, which makes this messy
    let evt = e || window.event;
    let isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) {
      closeHeaderPanels();
    }
  });
  
  // click anywhere to close things
  $('.site-content').on('click', function(e){
    closeHeaderPanels();
  });

  $('#site-menu-open').on('click', function(e){
    e.stopPropagation();
    e.preventDefault();
    $('body').toggleClass('site-menu-open');
  });
  $('#site-menu-close').on('click', function(e){
    e.stopPropagation();
    e.preventDefault();
    $('body').removeClass('site-menu-open');
	});

	$('body').on('click', '.navigate-down', function(e){
    e.preventDefault();
		$(this).closest('li').addClass('active');
		$(this).closest('ul').addClass('locked').scrollTop(0);
	});
	$('body').on('click', '.navigate-up', function(e){
    e.preventDefault();
    $(this).closest('li.active').removeClass('active');
    $(this).parents('ul').removeClass('locked');
  });

  $('#help-menu-toggle').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    $('body').toggleClass('help-menu-shown');
  });

  // prevent menu panel actions from closing the panel
  $('#site-menu-panel').on('click', function(e){
    e.stopPropagation();
  });

  // save the menu state
  $('body').on('click', '.navigate-down, .navigate-up', function(e){
    e.preventDefault();
    sessionStorage.setItem("lo-menu-state", $('#site-menu').html());
  });
  // load menu state
  if ( 'lo-menu-state' in sessionStorage) {
    $('#site-menu').html(sessionStorage.getItem('lo-menu-state'));
  }
  
  /*
  Marquee
    */
  $('body').on('click', '.marquee .panel-close', function(e){
    e.preventDefault();
    $marquee.fadeOut('fast');
    sessionStorage.setItem("lo-marquee-dismissed", "1");
  });

  // marquees are hidden by default, so show if they haven't been closed
  if ( 'lo-marquee-dismissed' in sessionStorage) {
    // no nothing
  }else{
    $marquee.find('.marquee').removeClass('hidden');
  }

  // Autocomplete search
  $.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    },
    _renderMenu: function( ul, items ) {
      var that = this,
        currentCategory = "";
      $.each( items, function( index, item ) {
        var li;
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
          currentCategory = item.category;
        }
        li = that._renderItemData( ul, item );
        if ( item.category ) {
          li.attr( "aria-label", item.category + " : " + item.label );
        }
      });
    }
  });

  $(".js-autocomplete").catcomplete({
  delay: 0,
	source: window.autocompletedata,
	open: function ( event, ui ) {
		if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
			$('.ui-autocomplete').off('menufocus hover mouseover');
		}
	},
	focus: function( event, ui ){
		event.preventDefault(); // default is to show the value of the item, which will be the page path
	},
    select: function( event, ui ) {
    	event.preventDefault();
    	window.location = window.location.protocol + '//' + window.location.hostname + ui.item.value;
    }
  });
  
});