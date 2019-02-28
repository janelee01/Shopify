export default (el, viewers) => {
  // Add in module JS code here


  let x = el;

  var viewer;


  let $img = el.querySelector('.pdp-gallery-featured img');
  let src = $img.getAttribute('src');


  $img.setAttribute('data-high-res-src', src);
  var viewer = ImageViewer($img);


  let variantId = el.getAttribute('data-sibling');

  viewers[variantId] = viewer;


  el.querySelectorAll('.pdp-gallery-thumbs a').forEach(

  	$a => {

  		// Add a click event listener to each of the thumbs
  		$a.addEventListener(

		    'click', e => {

		    	let src = $a.getAttribute('data-src');


		    	$a.classList.add('active');

		    	// Run through click event path to search for '.pdp-gallery-featured img'
		    	e.path.forEach(

		    		path_element => {

		    			if(path_element.classList && path_element.classList.contains('pdp-gallery')){


		    		// 		if(!viewer){
		    		// 			var $img = path_element.querySelector('.pdp-gallery-featured img');	


		    		// 			// Change the image src
		    		// 			$img.setAttribute('src', src);
								// $img.setAttribute('data-high-res-src', src);

		    		// 			viewer = ImageViewer($img);
		    		// 		}else{
		    					

		    					

		    		// 		}

		    				// viewer.resetZoom();
		    				viewer.load(src, src);
		    				viewer.refresh();

		    				// console.log('viewer');
		    				// console.log(viewer);


		    				// data-high-res-src="assets/images/image_viewer/1_big.jpg"


		    				el.querySelector('.pdp-gallery-thumbs a.active').classList.remove('active');

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