$(document).ready(function(){

  const $variantInput = $('#variant-selector');
  const $variantButtons = $('.variants');
  const $swatches = $('.swatch');
  const $selectedColor = $('#selected-color');

  var dataLayer = window.dataLayer || [];

  // helper to set a new active item
  function setActive($elGroup,$el,className){
    $elGroup.removeClass(className);
    $el.addClass(className);
  }

  // helper for money formatting
  function stripCents(str){
    return str.replace('.00','');
  }
  
  // fetch current state values
  function getActiveProductId(){
    return $('.swatch.active').data('sibling');
  };
  function getActiveVariantId(){
    return Number($variantInput.val());
  };
  function getActiveVariantData(){
    var variants = getProductVariants(getActiveProductId());
    var activeVariant = getActiveVariantId();
    for (var i = 0; i < variants.length; i++) {
      if (variants[i].id === activeVariant) {
        return variants[i];
      }
    }
  }

  // fetch any value
  function getProduct(id){
    return siblingsJson[id];
  }
  function getProductVariants(id){
    var product = getProduct(id);
    return product.variants;
  }

  // update values
  var setVariantInputValue = function(id){
    $variantInput.val(id);
  }
  var updateVariants = function() {
    // clear the old options
    $variantInput.html('');
    if ($variantButtons.length) {
      $variantButtons.find('.btn').remove();
    }
    // build the new options
    var variants = getProductVariants(getActiveProductId());
    variants.forEach(variant => {
      $variantInput.append(
        `<option value="${variant.id}">${variant.title}</option>`
      );
      $variantButtons.append(
        `<button data-id="${variant.id}" class="btn btn-secondary">${variant.title}</buton>`
      )
    });

    // select the previously selected size/option
    $variantButtons.find('.btn').each(function(){
      if ($(this).text() === window.selectedVariantText) {
        $(this).addClass('selected');
        setVariantInputValue($(this).data('id'));
      }
    });
  }

  function updatePrice(){
    var $compareEl = $('#compare-price');
    var $priceEl = $('#price');
    var $discountEl = $('.discount-label');
    var $discountValue = $('.discount-amount');
    var variant = getActiveVariantData();

    var price = variant.price;
    var comparePrice = variant.compare_at_price;
    var discountAmount = Math.round(100 * (comparePrice - price) / comparePrice);

    var formattedCompare = stripCents(slate.Currency.formatMoney(comparePrice, theme.moneyFormat));
    var formattedPrice = stripCents(slate.Currency.formatMoney(price, theme.moneyFormat));
    
    if (comparePrice > 0 && price !== comparePrice){
      $priceEl.html(formattedPrice);
      $compareEl.html(formattedCompare).show();
      $discountValue.text(discountAmount);
      $discountEl.show();
    }else{
      $discountEl.hide();
      $compareEl.hide();
      $priceEl.html(formattedPrice);
    }
  };

  var updateDataLayer = function(){
    var productId = getActiveProductId();
    var product = getProduct(productId);
    var variant = getActiveVariantData();
    var update = {
      'event': 'swatchClick',
      'productData.price': variant.price * 0.01,
      'productData.comparePrice': variant.compare_at_price * 0.01,
      'productData.sku': variant.sku,
      'productData.name': product.title,
      'productData.variant': variant.title,
      'productData.variantId': variant.id,
      'productData.url': siblingsSupplimentalJson[productId].url,
      'productData.imageUrl': siblingsSupplimentalJson[productId].featuredImage,
      'productData.collections': siblingsSupplimentalJson[productId].collections,
      'productData.color': $selectedColor.text(),
      'pinterestPage': product.title
    };
    console.log(update);
    // dataLayer.push(update);
  }

  // changing colors, which also changes the entire product
  $swatches.on('click', function(e){
    e.preventDefault();
    setActive($swatches, $(this), 'active');
    if( $variantButtons.length ){
      window.selectedVariantText = $variantButtons.find('.btn.selected').text();
    }
    $selectedColor.text($(this).find('img').data('color-label'));
    updateVariants();
    updateDataLayer();
    updatePrice();
    // TODO: update cta, url, images
  });

  // changing sizes, product remains the same
  if( $variantButtons.length ){
    $('body').on('click', '.variants .btn', function(e){
      e.preventDefault();
      setActive($('.variants .btn'), $(this), 'selected');
      setVariantInputValue($(this).data('id'));
      updatePrice();
      updateDataLayer();
      // TODO: update update CTA
    });
  }

});
