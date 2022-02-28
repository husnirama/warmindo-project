let idCardName = ''

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function replaceCommas(x) {
    return x.replace(/,/g,'')
}

if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded',ready)
}
else{
    ready()
}

function ready(){

    var addToCartButtons = document.getElementsByClassName('checkout-topping')
    for(var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click',addToCartClicked)
    }
}




// flow ux
// 1. open website
// 2. click tambah toping button
//      a. when tambah toping clicked, record all topping data inputed by client
//      b. 



