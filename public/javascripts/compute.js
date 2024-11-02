
// 计算总共投注的总类和金额
let money_type_sum = {
  odd:   0,
  even:  0,
  small: 0,
  big:   0,
  sum:   0
};

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
