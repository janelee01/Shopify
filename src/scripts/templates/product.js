import '../../styles/templates/product.scss'

import pdp_gallery from '../sections/pdp-gallery'
import '../sections/pdp-form'
import '../sections/pdp-callout-galleries'
import '../sections/pdp-material'
import pdp_stories from '../sections/pdp-stories'
import '../sections/pdp-cross-sell'
import '../sections/pdp-size-fit-modal'

import pdp_modal from '../sections/pdp-modal'

import '../sections/pdp-swatches'

import '../vendor/imageviewer.min'


$(document).ready(


	function(){

		pdp_stories(document.querySelector('.pdp-stories'));
		document.querySelectorAll('.pdp-gallery-thumbs').forEach(el => { pdp_gallery(el); });
		document.querySelectorAll('.pdp-modal-link').forEach(el => { pdp_modal(el); });


	}

);

