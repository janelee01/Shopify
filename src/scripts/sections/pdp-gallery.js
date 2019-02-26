export default el => {
  // Add in module JS code here


  let x = el;
	


  el.querySelectorAll('.pdp-gallery-thumbs a').forEach(

  	$a => {


  		// Add a click event listener to each of the thumbs
  		$a.addEventListener(

		    'click', e => {

		    	let src = $a.getAttribute('data-src');

		    	// Run through click event path to search for '.pdp-gallery-featured img'
		    	e.path.forEach(

		    		path_element => {

		    			if(path_element.classList && path_element.classList.contains('pdp-gallery')){
		    				
		    				// Change the image src
		    				path_element.querySelector('.pdp-gallery-featured img').setAttribute('src', src);


		    				el.querySelectorAll('.pdp-gallery-thumbs a.active').classList.remove('active');

		    				return;
		    			}

		    		}


		    	);


		    	



		    	return false;

		    }

		  );

  	}

  );

  // var flkty = new Flickity( el, {
  //   verticalCells: true
  // });

}