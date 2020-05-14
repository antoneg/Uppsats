


function yoyo(){
  var totBal = 10000000;
  var karmizar = [10,5,2,35,7,1,43,12,2,4,3,3,43,66,2,34,81,23,6,34,11,5,12,55,32,1,6];
  var del = karmizar.length;
  for(i = 0; i<del; i++){
    var totK = 0;
    for(j=0; j< karmizar.length; j++){
      totK += karmizar[j];
    }

    var rest = totBal % totK;
    var pricePer = (totBal-rest)/totK;

    console.log(pricePer);

    var k = karmizar[0];
    var cash = pricePer*k;
    var totBal = totBal - cash;
    karmizar.splice(0,1);

  }
}

yoyo();
