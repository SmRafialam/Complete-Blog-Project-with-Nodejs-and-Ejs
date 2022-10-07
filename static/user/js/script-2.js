$(".sk-category__products").slick({
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: false,
  responsive: [
    {
      breakpoint: 768,

      settings: {
        slidesToShow: 2,
      },
    },
  ],
});

$(".blog-topic-container").slick({
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  dots: true,
  centerPadding: "0px",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        centerPadding: "0px",
      },
    },
    {
      breakpoint: 600,
      settings: "unslick",
    },
  ],
});


//form show/hide
const shortForm = document.querySelector(".short-form");
const fullForm = document.querySelector(".full-form");

shortForm.addEventListener("click", (e) => {
  const clicked = e.target.closest(".sk-form-control");
  if (!clicked) return;
  if (clicked) {
    shortForm.style.display = "none";
    fullForm.classList.add("show");
  }
});
