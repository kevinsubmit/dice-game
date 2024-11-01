let drage_start_money = null; //筹码拖拽开始的筹码金额 1代表$1，2代表$5，3代表$10，4代表$20，5代表$100
let drage_drop_type = null; //拖拽结束下注的类型
let throw_state = false; //按钮默认是不能点击的，而且下注之前无法点击
let result_comeout = false; //下注结果没有出来

//  鼠标在头像部分移出移入效果 Effect of moving the mouse in and out of the avatar part
$(".big-pic").on("mouseenter", function () {
  $(".dashboard").animate({ right: "10px" }, 200);
});
$(".dashboard").on("mouseleave", function () {
  $(this).animate({ right: "-120px" }, 200);
});

// 筹码拖拽效果  Chip drag effect
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.cursor = "grabbing";

  drage_start_money = event.target.className.slice(-1);
}
function dragOver(event) {
  event.preventDefault();
}
function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(data);

  drage_drop_type = event.target.innerHTML;
  chipIsShow(drage_drop_type, drage_start_money);
  // console.log(drage_drop_type);

  // // event.target.appendChild(draggableElement);
  // draggableElement.style.cursor = 'grabbing';
}

// 判断哪个筹码图标显示
function chipIsShow(drage_drop_type, drage_start_money) {
  isDisabled(false);
  if (drage_drop_type && drage_start_money) {
    $("." + drage_drop_type + "-area")
      .children()
      .eq(drage_start_money - 1)
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
  removeEffect();

}


// score出来后去掉一切效果
function removeEffect(){

  const myPromise = new Promise((resolve,reject) =>{
    setTimeout(() =>{
      resolve();  //如果括号里面有值那就作为参数传递给下面then里面的value
      console.log(333);
    },2000)
  });

  const wrappedPromise = Promise.resolve(myPromise);

  wrappedPromise.then(() =>{
    
  
    console.log(77777);
  })
}


