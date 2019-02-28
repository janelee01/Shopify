export default el => {
  // Add in module JS code here

  el.addEventListener(
  	
  	'click',

  	e => {

      e.preventDefault();

      let $a = e.target;

      let data_modal = $a.getAttribute('data-modal');

      let modal_id = `pdp-modal-${data_modal}`;

      let $modal = document.getElementById(modal_id);

      if(!$modal) return console.warn(`modal id ${modal_id} not found!`);


      $modal.classList.add('active');


      $modal.querySelector('.pdp-modal-close').addEventListener(

        'click',

        e => {

        	document.querySelector('.pdp-modal.active').classList.remove('active');
        }


      );

      return;

  	}
  );
  

}