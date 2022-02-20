let idCardName = ''

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getToppingData(){
    return Array.from(document.querySelectorAll('.topping tbody tr')).map(el => (
        {
            id : el.id,
            name : el.querySelector('.name').textContent,
            price : el.querySelector('.price').textContent,
            qty : el.querySelector('.qty').value,
            total : parseInt(el.querySelector('.price').textContent) * parseInt(el.querySelector('.qty').value)
        }
    ))
}

function storeToppingToLocal(){
    const data = getToppingData()
    localStorage.setItem('data',JSON.stringify(data));
}

function getTotalToppingPrice(id){
    var qty = parseInt(document.querySelector(`.topping tbody tr#${id} .qty`).value)
    var price = parseInt(document.querySelector(`.topping tbody tr#${id} .price`).textContent)
    document.querySelector(`.topping tbody tr#${id} .total`).textContent = `${numberWithCommas(qty*price)}`
}

function getTotalTopping(id){
    let total = 0
    let coba = document.querySelector(`#${id} .btn span`)    
    
    const toppingList = document.querySelectorAll('.topping tbody tr')
    toppingList.forEach(function(item){
        
        x = item.querySelector('.total').textContent.replace(/,/g,'')
        total += parseInt(x);
    });
    document.getElementById('total-topping').textContent = `${numberWithCommas(total)}`

    document.querySelector(`#${id} .btn span`).textContent = `${numberWithCommas((Number(coba.getAttribute('data-default'))+total) || coba.getAttribute('data-default'))}` 
}

function getNumTotalTopping(id){
    let total = 0    

    const toppingList = document.querySelectorAll('.topping tbody tr')
    toppingList.forEach(function(item){
        
        x = item.querySelector('.total').textContent.replace(/,/g,'')
        total += parseInt(x);
    });
    return total
}


function dumpToCartModal(id){
    data = getToppingData()
    total = getNumTotalTopping()
    itemToCart = {
        orderName : data.name,
        orderPrice : data.price,
        orderQty : 0,
        orderTotal : 0,
        orderDescription : '',
    }
    return itemToCart
    
}


window.addEventListener('load', function(e) {
    let btnsAddTopping = document.querySelectorAll('.submitTopping')
    btnsAddTopping.forEach((el,i) => {
        el.addEventListener('click', storeToppingToLocal)
    })

    let btnCheckout = document.querySelector('.checkout-topping')
    btnCheckout.addEventListener('click', storeToppingToLocal)

    let ids = document.querySelectorAll('[data-target="#topping-modal"]')
    ids.forEach((el,i) => {
        el.addEventListener('click', function(e){
            temp = e.target.parentElement.parentElement.parentElement.parentElement.id
            idCardName=temp
        })
    })

    let inputQtys = document.querySelectorAll('.qty')
    inputQtys.forEach((el,i) => {
        el.addEventListener('input', function() {
            getTotalToppingPrice(el.parentElement.parentElement.id)
            getTotalTopping(idCardName)
        })
    })
})




