$(document).ready(function(){

  if( $('body').attr('id') === 'digital-gift-card' ){

    $('body').on('click', '.variants .btn', function(e){
      e.preventDefault();
      $(this).siblings('.btn').removeClass('selected');
      $(this).addClass('selected');

      let selectedTitle = [];
      $('.variants .btn.selected').each(function(){
        selectedTitle.push($(this).text());
      })

      let activeVariant = productJson.variants.find(variant => {
        return variant.title === selectedTitle.join(' / ')
      });

      $('#variant-selector').val(activeVariant.id);
      $('#gift-card-image').attr('src', activeVariant.featured_image.src);

    });

  }// end if PDP
  
});
