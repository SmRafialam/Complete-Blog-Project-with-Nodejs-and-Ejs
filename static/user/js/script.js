$(document).ready(function() {


  // ----------------------------------
// main banner header slider
$('.sk-main__banner-slider').slick({
  centerMode: true,
  dots: true,
  centerPadding: '0px',
  infinite: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '20px',
        slidesToShow: 1
      }
    },
    {
    breakpoint: 768,
    settings: {
      arrows: true,
      centerMode: true,
      centerPadding: '0px',
      slidesToShow: 1
    }
    }
  ]
});

  // jquery for content navigation
  $(".sk-product__info-btn").click(function() {
    $(".sk-product__info-btn").removeClass("active");
    $(this).addClass("active");
  });

  $("#sk-product__info-list li button").on("click", function(e) {
    e.preventDefault();
    var page = $(this).data("page");

    $("#sk-product__info-details .sk-product__item-info:not('.display-none')")
      .stop()
      .fadeOut("fast", function() {
        $(this).addClass("display-none");

        $('#sk-product__info-details .sk-product__item-info[data-page="' + page + '"]')
          .fadeIn("slow")
          .removeClass("display-none");
      });
  });


  // --------------------------------------- 
  // slick slider for porduce details 
  $('.sk-product-slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: false,
    adaptiveHeight: true,
    infinite: false,
    useTransform: true,
    speed: 300
  });
 
  $('.sk-product-slider-nav')
    .on('init', function(event, slick) {
      $('.sk-product-slider-nav .slick-slide.slick-current').addClass('active');
    })
    .slick({
      slidesToShow: 2,
      slidesToScroll: 2,
      dots: false,
      focusOnSelect: false,
      infinite: false
    });
 
  $('.sk-product-slider-for').on('afterChange', function(event, slick, currentSlide) {
    $('.sk-product-slider-nav').slick('slickGoTo', currentSlide);
    var currrentNavSlideElem = '.sk-product-slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
    $('.sk-product-slider-nav .slick-slide.active').removeClass('active');
    $(currrentNavSlideElem).addClass('active');
  });
 
  $('.sk-product-slider-nav').on('click', '.slick-slide', function(event) {
    event.preventDefault();
    var goToSingleSlide = $(this).data('slick-index');
 
    $('.sk-product-slider-for').slick('slickGoTo', goToSingleSlide);
  });

});



document.getElementById('commentForm').addEventListener('submit',submitForm);
function submitForm(e){
  e.preventDefault();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const comment = document.querySelector('#comment').value;
  const captcha = document.querySelector('#g-recaptcha-response').value;

  fetch('/subscribe', {
    method: 'POST',
    headers: {
      'Accept' : 'application/json, text/plain, */*',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({name:name , email:email, comment:comment, captcha:captcha})
  })
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data);
    alert(data.msg);
  });

}
