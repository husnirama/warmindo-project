function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function replaceCommas(x) {
    return x.replace(/,/g,'')
}


// flow
// 1. prevent default while topping inputted

const UICtrlTopping = (function(){
    const UISelectorTopping = {
        toppingTotal        : `total-topping`,
        toppingCheckoutBtn  : `.checkout-topping`,
        toppingList         : `.topping tbody tr`,
        totalCont           : `.total`,
        qtyAll              : `.qty`,
        tempIdCard          : `[data-target="#topping-modal"]`,
        proceedBtn          : `.checkout-topping`
    }

    return {
        calculateEachToppingTotal : function(idTopping){
            var qty = parseInt(document.querySelector(`.topping tbody tr#${idTopping} .qty`).value)
            var price = parseInt(document.querySelector(`.topping tbody tr#${idTopping} .price`).textContent)
            document.querySelector(`.topping tbody tr#${idTopping} .total`).textContent = `${numberWithCommas(qty*price)}`
        },

        calculateToppingTotal : function(idCard){
            let total = 0
            let cardPriceDisplay = document.querySelector(`#${idCard} .btn span`)
            let toppingList = document.querySelectorAll(UISelectorTopping.toppingList)

            toppingList.forEach(function(item){
                x = item.querySelector(UISelectorTopping.totalCont).textContent.replace(/,/g,'')
                total += parseInt(x);
            });
            document.getElementById(UISelectorTopping.toppingTotal).textContent = `${numberWithCommas(total)}`

            cardPriceDisplay.textContent = `${numberWithCommas((Number(cardPriceDisplay.getAttribute('data-default'))+total) || cardPriceDisplay.getAttribute('data-default'))}`

            return cardPriceDisplay.textContent
        },

        getToppingData : function(idCard){
            return Array.from(document.querySelectorAll('.topping tbody tr')).map(el => (
                {
                    idCard : `${idCard}`,
                    id : el.id,
                    name : el.querySelector('.name').textContent,
                    price : el.querySelector('.price').textContent,
                    qty : el.querySelector('.qty').value,
                    total : parseInt(el.querySelector('.price').textContent) * parseInt(el.querySelector('.qty').value)
                }
            ))
        },

        getSelectorsTopping : function(){
            return UISelectorTopping;
        }
    }
})();

const App = (function(UICtrlTopping){
    let idCardName = ''
    const loadEventListeners = function(){
        const UISelector = UICtrlTopping.getSelectorsTopping();

        const ids = document.querySelectorAll(UISelector.tempIdCard)
        ids.forEach((el) => {
            el.addEventListener('click', function(e){
                temp = e.target.parentElement.parentElement.parentElement.parentElement.id
                idCardName=temp
            })
        });

        const inputQtys = document.querySelectorAll(UISelector.qtyAll);
        inputQtys.forEach((el) =>{
            el.addEventListener('input',function(e){
                UICtrlTopping.calculateEachToppingTotal(el.parentElement.parentElement.id)
                UICtrlTopping.calculateToppingTotal(idCardName)
                e.preventDefault()
            })
        });
    }

    return {
        init : function(){
            loadEventListeners();
        }
    }  
})(UICtrlTopping);


App.init();