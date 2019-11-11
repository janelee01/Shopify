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
		if (data.success) {
			$('#wl-content').hide();
			$('#wl-confirmation').fadeIn();
		} else { // it was an error
			// back in stock app
			// for (var k in data.errors) {  // collect all the error messages into a string
			// 	msg += (k + " " + data.errors[k].join());
			// }
			console.log(data);
			// klaviyo integration
			msg = data.message
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
			// klaviyo integration
			$.ajax({
				type: "POST",
				url: 'https://a.klaviyo.com/onsite/components/back-in-stock/subscribe',
				data: {
					a: 'NuVG2M',
					email: email,
					variant: variantId,
					platform: 'shopify'
				},
				dataType: 'json',
				success: function(data, extStatus, jqXHR){
					notificationCallback(data);
				}
			});
			// back in stock app
			// var productId = $('#wl-product').val();
			// BIS.create(email, variantId, productId).then(notificationCallback); // create the notification
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
});
