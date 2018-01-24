$(document).ready(function(){
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

		var reviewsHtml = '<dl class="page" id="reviews-page-1">';
		for (var i = 0; i < keys.length; i++) {

			if( i > 0 && i % perPage == 0 ){
				currentPage++;
				reviewsHtml += '</dl><dl class="page" style="display: none" id="reviews-page-'+currentPage+'">';
			}

			reviewsHtml += '<dt>'+finalReviewsData[keys[i]].date;
			reviewsHtml += '<span class="stars">';
			for (var c = 1; c <= 5; c++) {
				reviewsHtml += '<i class="star';
				if( c <= finalReviewsData[keys[i]].score ) reviewsHtml += ' filled';
				reviewsHtml += '"></i>';
			};
			reviewsHtml += '<span class="sr-only">rated '+finalReviewsData[keys[i]].score+' out of 5</span></span></dt>';
			reviewsHtml += '<dd><h3>'+finalReviewsData[keys[i]].author+'</h3>';
			reviewsHtml += '<p>'+finalReviewsData[keys[i]].content+'</p></dd>';
		};
		reviewsHtml += '</dl>';
		$('#reviews').html(reviewsHtml);

		if( currentPage > 1 ){
			var pagination = '<ul class="pages" id="reviews-navigation">';
			for (var i = 1; i <= currentPage; i++) {
				pagination += '<li><a href="#reviews-page-'+i+'">'+i+'</a></li>';
			};
			pagination += '</ul>';
			$('#reviews').append(pagination);
			$('#reviews-navigation li').first().find('a').addClass('current');
		}

	});

	$('body').on('click', '#reviews-navigation a', function(e){
	    e.preventDefault();
	    $('#reviews .page').hide();
	    $($(this).attr('href')).fadeIn();
	    $('#reviews-navigation a').removeClass('current');
	    $(this).addClass('current');
	});

	$('body').on('click', '.write-review-button', function(e){
		$('.write-form .yotpo-header-title').text('Write your review');
		$('.write-form .yotpo-submit').val('Submit review');
	    $(this).addClass('is-hidden');
	});
});