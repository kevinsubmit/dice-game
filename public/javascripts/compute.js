// 计算总共投注的总类和金额
function moneySum(type, money) {
  money_type_sum.sum += money;

  if (type === "odd") {
    money_type_sum.odd += money;
  } else if (type === "even") {
    money_type_sum.even += money;
  } else if (type === "small") {
    money_type_sum.small += money;
  } else if(type === "big"){
    money_type_sum.big += money;
  }else{
    return false;
  }
}


// 投注之前判断用户余额
 function isBalanceEnough(){
  console.log(money_type_sum.sum);
  console.log(balance.innerHTML);
  if(parseInt(money_type_sum.sum) > parseInt(balance.innerHTML)){

    money_type_sum = {
      odd:   0,
      even:  0,
      small: 0,
      big:   0,
      sum:   0
    };
    alert('Your balance is not enough,please contact Austin');
    return false
  }else{
    return true
  }
 }

// 投注之后从账户减少钱
function lessBalance(){
  balance.innerHTML = parseInt(balance.innerHTML) - parseInt(money_type_sum.sum);

 }

// 计算输赢结果后分配钱 scoreSum.innerHTML为开奖数字 
//  money_type_sum为投注情况  balance.innerHTML为用户余额

function distributeWinnings() {
  const score = parseInt(scoreSum.innerHTML.slice(-1));
  let winAmount = 0;
  
  // 添加调试信息
  console.log('开奖数字:', score);
  console.log('当前投注情况:', money_type_sum);
  
  // 判断开奖数字的属性
  const isOdd = score % 2 === 1;
  const isEven = score % 2 === 0;
  const isSmall = score >= 2 && score <= 7;
  const isBig = score >= 8 && score <= 12;
  
  console.log('数字属性:', { isOdd, isSmall, isBig });
  
  // 计算奇偶投注的赢钱
  if (isOdd && money_type_sum.odd > 0) {
    winAmount += money_type_sum.odd * 2;
  }
  if (isEven && money_type_sum.even > 0) {
    winAmount += money_type_sum.even * 2;
  }
  
  // 计算大小投注的赢钱
  if (isBig && money_type_sum.big > 0) {
    winAmount += money_type_sum.big * 2;
  }
  if (isSmall && money_type_sum.small > 0) {
    winAmount += money_type_sum.small * 2;
  }
  
  console.log('赢得金额:', winAmount);
  console.log('当前余额:', balance.innerHTML);
  
  // 更新余额
  balance.innerHTML = parseInt(balance.innerHTML) + winAmount;
  
  console.log('更新后余额:', balance.innerHTML);
  
  
}




