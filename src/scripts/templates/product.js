import select from 'dom-select'
import '../../styles/templates/product.scss'
import image from '../sections/pdp-image'
import pdpGallery from '../sections/pdp-gallery'
import pdpForm from '../sections/pdp-form'
import pdpCalloutGalleries from '../sections/pdp-callout-galleries'
import pdpStories from '../sections/pdp-stories'
import pdpCrossSell from '../sections/pdp-cross-sell'
import pdpTestimonials from '../sections/pdp-testimonials'
import pdpMaterial from '../sections/pdp-material'
import pdpSizeFitModal from '../sections/pdp-size-fit-modal'
import pdpSeeHowToPackit from '../sections/pdp-see-how-to-pack-it'
import pdpModal from '../sections/pdp-modal'
import pdpInstagram from '../sections/pdp-instagram'
import pdpSticky from '../sections/pdp-sticky-nav'
import pdpGiftCard from '../sections/pdp-gift-card'

$(document).ready(function () {
  image()
  pdpSticky(select('.js-pdp-sticky-nav'))
  pdpForm(select('.js-pdp-main'))
  pdpStories(select('.pdp-stories'))
  pdpCrossSell(select('.pdp-cross-sell'))
  pdpTestimonials(select('.pdp-testimonials'))
  pdpMaterial(select('.pdp-material'))
  pdpSeeHowToPackit(select('.js-pdp-pack-it'))
  pdpInstagram(select('.pdp-instagram'))
  pdpGiftCard(select('.js-pdp-main--gift-card'))

  select.all('.pdp-callout-galleries').forEach(el => { pdpCalloutGalleries(el) })
  select.all('.pdp-gallery').forEach(el => { pdpGallery(el) })
  select.all('.pdp-modal-link').forEach(el => { pdpModal(el) })
})
