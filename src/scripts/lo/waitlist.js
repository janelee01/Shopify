$(document).ready(function(){
	var $wlOverlay = $('#wl-overlay');
	var waitlistClose = function(){
		$wlOverlay.fadeOut();
	};
	$('#waitlist-open').on('click', function(e){
	    e.preventDefault();
	    $('#wl-content').show();
	    $('#wl-confirmation').hide();
	    $wlOverlay.fadeIn();
	});
	$('[data-wl-cancel]').on('click', function(e){
	    e.preventDefault();
	    waitlistClose();
	});
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) { // escape key maps to keycode `27`
	    	waitlistClose();
	    }
	});

	var notificationCallback = function(data) {
		var msg = '';
		if (data.status == 'OK') {
			$('#wl-content').hide();
			$('#wl-confirmation').fadeIn();
		} else { // it was an error
			for (var k in data.errors) {  // collect all the error messages into a string
				msg += (k + " " + data.errors[k].join());
			}
		}
		$('#wl-error').text(msg).show();
	};

	$('#wl-form').on('submit', function(e) {
	    e.preventDefault();
	    $('#wl-email').removeClass('has-error');
	    $('#wl-form .validation-error').hide();
	    var email = $('#wl-email').val();
	    if( !email ){
	    	$('#wl-email').addClass('has-error').next('.validation-error').text('Please enter your email address').show();
	    	return false;
	    }
	    var variantId = $('#wl-variant').val();
	    var productId = $('#wl-product').val();
	    BIS.create(email, variantId, productId).then(notificationCallback); // create the notification
	});

	var $img = $('#wl-image');
	var positionWaitlistImage = function(){
		if( $(window).width() <= LS.tabletBreakpoint ){
			if( $('#wl-content #wl-img').length < 1 ){
				$img.detach().insertAfter('#wl-product-name');
			}
		}else{
			if( $('#wl-confirmation').next('#wl-img').length < 1 ){
				$img.detach().insertAfter('#wl-confirmation');
			}
		}
	};
	positionWaitlistImage();
	$(window).resize(function(){
		positionWaitlistImage();
	});

	/*
	Coming Soon subscriptions
	*/
	var $comingSoonForm = $('#coming-soon-signup');
	var $comingSoonField = $('#coming-soon-email');
	var $comingSoonSuccess = $('#coming-soon-success');
	var $comingSoonTitle = $('#comingsoon .section-title');
	$('.more-window-trigger').on('click', function(e){
	  e.preventDefault();
		if( $(this).attr('href') === '#comingsoon' ){
			window.comingSoonListId = $(this).data('listid');
			// reset form
			$comingSoonForm
				.show()
				.removeClass("has-errors")
				.find('.validation-error').remove();
			$comingSoonSuccess.hide();
			$comingSoonTitle.find('p').remove();
			$comingSoonTitle.append($(this).next('.more-window-content').html());
		}
	});
	$comingSoonForm.on('submit', function(e) {
		e.preventDefault();
		$comingSoonForm
			.removeClass("has-errors")
			.find('.validation-error').remove();

				var email = $comingSoonField.val();
				if( !email ){
					$comingSoonForm.addClass("has-errors").find('.form-group').append('<small class="validation-error">Please enter your email.</small>');
					$comingSoonForm;
					return;
				}
				var settings = {
						"async": true,
						"crossDomain": true,
						"url": "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
						"method": "POST",
						"headers": {
								"content-type": "application/x-www-form-urlencoded",
								"cache-control": "no-cache"
						},
						"data": {
								"g": window.comingSoonListId,
								"email": email
						}
				};
				$.ajax(settings)
					.fail(function(jqXHR, textStatus, errorThrown){
						$comingSoonForm.addClass("has-errors").find('.form-group').append('<small class="validation-error">Something went wrong. Perhaps you\'ve already subscribed to our list? <a href="/pages/support#contact">Contact us</a> for further assistance.</small>');
					})
					.done(function (response) {
							if( response.success ){
								$comingSoonForm.hide();
								$comingSoonSuccess.fadeIn();
							}
					});
		});
});
