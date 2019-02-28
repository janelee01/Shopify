import Flickity from 'flickity'

export default el => {
  // Add in module JS code here



  // el.classList.add('wilcho');


  	// element argument can be a selector string
	//   for an individual element
	var flkty = new Flickity( el, {
  		draggable: '>1',
  		groupCells: true
	});

}
