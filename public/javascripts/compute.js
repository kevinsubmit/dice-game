

// 计算总共投注的总类和金额
function moneySum(type,money){
  let odd_money  = null;
  let even_money = null;
  let small_money= null;
  let big_money  =  null;

  let money_type_sum = {
    'odd'  :odd_money,
    'even' :even_money,
    'small':small_money,
    'big'  :big_money
  };

  if(type === 'odd'){
    odd_money += money;
  }else if(type === 'even'){
    even_money += money;
  }else if(type === 'small'){
    small_money += money;
  }else{
    big_money += money;
  }
  return money_type_sum
}



