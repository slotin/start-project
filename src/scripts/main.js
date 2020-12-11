$(document).ready(function() {

  $('.description-slider__1').slick({
    arrows: true,
    fade: true,
    asNavFor: '.images-slider__1',
    prevArrow: '<button class="slick-prev slick-arrow" aria-label="Prev" type="button"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0L4.9425 1.0575L9.1275 5.25H0V6.75H9.1275L4.9425 10.9425L6 12L12 6L6 0Z" fill="white"/></svg></button>',
    nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0L4.9425 1.0575L9.1275 5.25H0V6.75H9.1275L4.9425 10.9425L6 12L12 6L6 0Z" fill="white"/></svg></button>'
  })
  $('.images-slider__1').slick({
    arrows: false,
    asNavFor: '.description-slider__1'
  })

  $('.description-slider__2').slick({
    arrows: true,
    fade: true,
    asNavFor: '.images-slider__2',
    prevArrow: '<button class="slick-prev slick-arrow" aria-label="Prev" type="button"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0L4.9425 1.0575L9.1275 5.25H0V6.75H9.1275L4.9425 10.9425L6 12L12 6L6 0Z" fill="white"/></svg></button>',
    nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0L4.9425 1.0575L9.1275 5.25H0V6.75H9.1275L4.9425 10.9425L6 12L12 6L6 0Z" fill="white"/></svg></button>'
  })
  $('.images-slider__2').slick({
    arrows: false,
    asNavFor: '.description-slider__2'
  })

  $('body').on('click', '.js-mute', function (  ){
    var video = $("video");
    if (video.prop('muted')) {
      video.prop('muted', false);
    } else {
      video.prop('muted', true);
    }

  })
});
