$(document).ready(function(){
	var addressHeight = 0;
	var $addresses = $('#address-list .address');
	if( $(window).width() >= LS.desktopBreakpoint ){
		$addresses.each(function(){
			if( $(this).outerHeight() > addressHeight ){
				addressHeight = $(this).outerHeight();
			}
		});
		$addresses.css('min-height', addressHeight);
	}

	// add address
	$('#address-new-open').on('click', function(e){
	    $('#address-list').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#AddressNewForm').fadeIn();
	});
	$('#address-new-close').on('click', function(e){
	    $('#AddressNewForm').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#address-list').fadeIn();
	});
	// edit address
	$('.address-edit-open').on('click', function(e){
	    $('#address-list').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#EditAddress_'+$(this).data('form-id')).fadeIn();
	});
	$('.address-edit-close').on('click', function(e){
	    $('#EditAddress_'+$(this).data('form-id')).hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#address-list').fadeIn();
	});
});