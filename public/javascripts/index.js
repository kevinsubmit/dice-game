let drag_start_money = null; //筹码拖拽开始的筹码金额 1代表$1，2代表$5，3代表$10，4代表$20，5代表$100
let drag_real_money = null; //筹码拖拽开始的筹码金额 
let drag_drop_type = null; //拖拽结束下注的类型
let throw_state = false; //按钮默认是不能点击的，而且下注之前无法点击
let result_comeout = false; //下注结果没有出来
const scoreSum = document.querySelector('#score-sum'); //开奖后的数字结果
const balance = document.querySelector('#balance'); //用户余额
let money_type_sum = {
  odd:   0,
  even:  0,
  small: 0,
  big:   0,
  sum:   0
};// 计算总共投注的总类和金额

//  鼠标在头像部分移出移入效果 Effect of moving the mouse in and out of the avatar part
$(".big-pic").on("mouseenter", function () {
  $(".dashboard").animate({ right: "10px" }, 200);
});
$(".dashboard").on("mouseleave", function () {
  $(this).animate({ right: "-120px" }, 200);
});

// 筹码拖拽效果  Chip drag effect
function dragStart(event) {
  // event.target.style.cursor = "grabbing";
  drag_start_money = event.target.className.slice(-1);
  drag_real_money  = parseInt(event.target.innerHTML.slice(1));
  event.dataTransfer.setData("drag_real_money", drag_real_money); //通过dragStart传递参数drag_real_money

}
function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const data = parseInt(event.dataTransfer.getData("drag_real_money"));
  // const draggableElement = document.getElementById(data);

  drag_drop_type = event.target.innerHTML;

  moneySum(drag_drop_type,data);
  // moneySum(drag_drop_type,data);
  // console.log(money_type_sum);
  
  chipIsShow(drag_drop_type, drag_start_money);

  // // event.target.appendChild(draggableElement);
  // draggableElement.style.cursor = 'grabbing';
}

// 判断哪个筹码图标显示
function chipIsShow(drag_drop_type=null, drag_start_money=null) {
  isDisabled(false);
  if (drag_drop_type && drag_start_money) {
    $("." + drag_drop_type + "-area")
      .children()
      .eq(drag_start_money - 1)
      .addClass("active");
  } else {
    $(".chip-novisible p").removeClass("active");
  }
}
//  判断仍骰子按钮能否点击,throw_state为false代表能点击
function isDisabled(throw_state) {
  if (!throw_state) {
    // 能点击
    $("#roll-btn").addClass("can-click");
    $("#roll-btn").prop("disabled", throw_state);
  } else {
    // 不能点击
    $("#roll-btn").removeClass("can-click");
    $("#roll-btn").prop("disabled", true);
  }
}

//骰子score已经产生
function resultComeOut(scoreSum = null) {
  isDisabled(true);
  removeEffect(scoreSum);
  distributeWinnings();
  money_type_sum = {
    odd:   0,
    even:  0,
    small: 0,
    big:   0,
    sum:   0
  };

}

// score出来后去掉一切效果
function removeEffect(scoreSum) {
  
  const $cases = $(".cases");
  const isEven = scoreSum % 2 === 0;
  const isSmall = scoreSum <= 7;

  // 处理奇偶
  $cases.children().eq(0).toggleClass("border-flow", !isEven);
  $cases.children().eq(1).toggleClass("border-flow", isEven);

  // 处理大小
  $cases.children().eq(2).toggleClass("border-flow", isSmall); 
  $cases.children().eq(3).toggleClass("border-flow", !isSmall);

  // 使用 async/await 简化 Promise 链
  setTimeout(async () => {
    $(".cases p").removeClass("border-flow");
    await Promise.resolve();
    $(".chip-novisible p").removeClass("active");
  }, 2500);
}

// 获取当前时间
$('.time').html((new Date().Format("MM-dd-yyyy" ))+' (EST)');

// 从localStorage中获取用户信息
const user = JSON.parse(localStorage.getItem('userInfo'));
// 检查是否存在
const usernameEl = document.getElementById('username');
const balanceEl = document.getElementById('balance');

if (user) {
  usernameEl.innerHTML = user.username;
  balanceEl.innerHTML = user.balance;
} else {
  usernameEl.innerHTML = 'Austin';
  balanceEl.innerHTML = '1000';
}










