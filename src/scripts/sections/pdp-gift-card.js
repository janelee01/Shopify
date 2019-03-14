import select from 'dom-select'
import on from 'dom-event'

export default el => {
  if (!el) {
    return false
  }

  const $options = select.all('.js-variant-option')
  const $variantInput = select('.js-variant-input')

  /**
   * Change the visual active state for the user. We use
   * the class applied to the active buttons in the
   * following function "updateActiveVariant".
   *
   * @param {Object} e Vanilla DOM Event
   */
  const updateSelectedItem = e => {
    const $container = slate.utils.getClosest(e.target, '.js-variant-buttons-wrap')
    const $others = select.all('.js-variant-option', $container)

    $others.forEach(el => el.classList.remove('selected'))

    e.target.classList.add('selected')
  }

  /**
   * Find the active options, get their innerHTML and
   * use this to find the correct variant to eventually
   * add to the cart.
   *
   * @param {Object} e Vanilla DOM Event
   */
  const updateActiveVariant = e => {
    const activeOptions = $options
      .filter(el => el.classList.contains('selected'))
      .map(el => el.innerHTML.trim())

    const activeVariant = productJson.variants.find(variant => {
      return variant.title === activeOptions.join(' / ')
    })

    $variantInput.value = activeVariant.id
  }

  $options.forEach(el => on(el, 'click', e => {
    updateSelectedItem(e)
    updateActiveVariant(e)
  }))
}
