const carouselLiner = document.querySelector(".carousel-liner");
const welcome = document.querySelector(".welcome");
const time = document.querySelector(".time");

function marquee() {
  let tem_length =time.offsetWidth + welcome.offsetWidth - carouselLiner.offsetWidth;

  if (carouselLiner.scrollLeft == tem_length) {
    carouselLiner.scrollLeft = 0;

  } else {
    carouselLiner.scrollLeft++;
  }
}
let timer = setInterval(marquee, 30);


