/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/

// 玩家姓名
let player1 = "Player 1";
let player2 = "Player 2";

/*------------------------ Cached Element References ------------------------*/

/*----------------------------- Event Listeners -----------------------------*/

//addEventListener to the button  掷骰子
shakebtn = document.getElementById('shakebtn').addEventListener('click',rollTheDice);
changeid =document .getElementById('changeid').addEventListener('click',editNames);


/*-------------------------------- Functions --------------------------------*/

// 改变玩家姓名的功能
function editNames() {
  player1 = prompt("input player 1 name");
  player2 = prompt("input player 2 name");

  document.querySelector("p.Player1").innerHTML = player1 ? player1 : 'player 1';
  document.querySelector("p.Player2").innerHTML = player2 ? player2 : 'player 2';
}
// 掷骰子的功能
function rollTheDice() {
    setTimeout(function () {
      let randomNumber1 = Math.floor(Math.random() * 6) + 1;
      let randomNumber2 = Math.floor(Math.random() * 6) + 1;

      document.querySelector(".img1").setAttribute("src", "./imgs/dice" + randomNumber1 + ".png");

      document.querySelector(".img2").setAttribute("src", "./imgs/dice" + randomNumber2 + ".png");

      if (randomNumber1 === randomNumber2) {
        document.querySelector("h1").innerHTML = "Tie!";
      } else if (randomNumber1 < randomNumber2) {
        document.querySelector("h1").innerHTML = (player2 + " Win !");
      } else {
        document.querySelector("h1").innerHTML = (player1 + " Win !");
      }
    }, 1000);
  }