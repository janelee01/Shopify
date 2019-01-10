$(document).ready(function(){
	$('.more-window-trigger').on('click', function(e){
	    e.preventDefault();
	    window.previousLocation = $(window).scrollTop();
	    $($(this).attr('href')).scrollTop(0);
	    $('body').addClass('more-window-open');
	});
	$('.more-window .panel-close').on('click', function(e){
	    e.preventDefault();
	    $('body').removeClass('more-window-open');
	    $('window').scrollTop(window.previousLocation);
	});
	$('body').on('keyup', function(e){
	    // keyCode is getting deprecated use key instead when supported, which makes this messy
	    evt = e || window.event;
	    var isEscape = false;
	    if ("key" in evt) {
	        isEscape = (evt.key == "Escape" || evt.key == "Esc");
	    } else {
	        isEscape = (evt.keyCode == 27);
	    }
	    if (isEscape) {
	        $('body').removeClass('more-window-open');
	        $('window').scrollTop(window.previousLocation);
	    }
	});
});