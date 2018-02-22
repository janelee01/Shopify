$(document).ready(function(){

	var setReviewMarkupOrder = function(){
		if( $(window).width() < LS.desktopBreakpoint ){
			if( $('.reviews-list dt .reviewer-name').length < 1){
				$('.reviews-list dt').each(function(){
					$(this).find('.review-date').detach().appendTo($(this).next('dd'));
				});
				$('.reviews-list dd').each(function(){
					$(this).find('.reviewer-name').detach().prependTo($(this).prev('dt'));
				});
			}
		}else{
			if( $('.reviews-list dd .reviewer-name').length < 1){
				$('.reviews-list dt').each(function(){
					$(this).find('.reviewer-name').detach().prependTo($(this).next('dd'));
				});
				$('.reviews-list dd').each(function(){
					$(this).find('.review-date').detach().prependTo($(this).prev('dt'));
				});
			}
		}
	};

	$(window).resize(function(){
		setReviewMarkupOrder();
	});

	// reviews-received is fired once all reviews have been returned from yatpo's API
	$('body').on('reviews-received', function(){
		//  the relevant info we need is sort of buried, and we're going to need to sort these, so start a new object
		var finalReviewsData = [];
		
		// rawReviewsData is a global variable set in product.liquid 
		for (var i = rawReviewsData.length - 1; i >= 0; i--) {
			var siblingReviews = rawReviewsData[i].response.reviews;
			if( siblingReviews.length ){
				for (var r = siblingReviews.length - 1; r >= 0; r--) {
					var m = moment(siblingReviews[r].created_at);
					finalReviewsData[m.format('x')] = {
						"content" : siblingReviews[r].content,
						"author" : 	siblingReviews[r].user.display_name,
						"date" : m.format('M/D/YYYY'),
						"score" : siblingReviews[r].score
					}
				};
			}
		};

		// sort on the unix timestamp
		var keys = Object.keys(finalReviewsData);
		keys.sort();
		keys.reverse();

		var reviewsCount = keys.length;
		var currentPage = 1;
		var perPage = 5;
		if( keys.length > 0 ){
			var reviewsHtml = '<dl class="reviews-list page" id="reviews-page-1">';
			for (var i = 0; i < keys.length; i++) {

				if( i > 0 && i % perPage == 0 ){
					currentPage++;
					reviewsHtml += '</dl><dl class="reviews-list page" style="display: none" id="reviews-page-'+currentPage+'">';
				}

				reviewsHtml += '<dt><span class="review-date">'+finalReviewsData[keys[i]].date+'</span>';
				reviewsHtml += '<span class="stars">';
				for (var c = 1; c <= 5; c++) {
					reviewsHtml += '<i class="star';
					if( c <= finalReviewsData[keys[i]].score ) reviewsHtml += ' filled';
					reviewsHtml += '"></i>';
				};
				reviewsHtml += '<span class="sr-only">rated '+finalReviewsData[keys[i]].score+' out of 5</span></span></dt>';
				reviewsHtml += '<dd><h3 class="reviewer-name">'+finalReviewsData[keys[i]].author+'</h3>';
				reviewsHtml += '<p>'+finalReviewsData[keys[i]].content+'</p></dd>';
			};
			reviewsHtml += '</dl>';
			$('#reviews').html(reviewsHtml);

			// now maybe rearrange things, because designers
			setReviewMarkupOrder();

			if( currentPage > 1 ){
				var pagination = '<div class="pagination" id="reviews-navigation">';
				for (var i = 1; i <= currentPage; i++) {
					pagination += '<span class="page"><a href="#reviews-page-'+i+'">'+i+'</a></span>';
				};
				pagination += '</div>';
				$('#reviews').append(pagination);
				$('#reviews-navigation span').first().addClass('current');
			}
		}else{
			$('#reviews').html('<div class="alert alert-muted">No reviews yet. Be the first to add a review.</div>');
		}
	});

	$('body').on('click', '#reviews-navigation a', function(e){
	    e.preventDefault();
	    $('#reviews dl.page').hide();
	    $($(this).attr('href')).fadeIn();
	    $('#reviews-navigation .page').removeClass('current');
	    $(this).closest('.page').addClass('current');
	});

	$('body').on('click', '.write-review-button', function(e){
		$('.write-form .yotpo-header-title').text('Write your review');
		$('.write-form .yotpo-submit').val('Submit review');
	    $(this).addClass('is-hidden');
	    if( $(window).width() < LS.desktopBreakpoint ){
	    	$(this).closest('.yotpo-regular-box').slideUp();
	    }
	});
});