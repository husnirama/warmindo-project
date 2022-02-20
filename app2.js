// let idCardName = ''

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function replaceCommas(x) {
    return x.replace(/,/g,'')
}

const StorageCtrl = (function(){

    return{
        allOrder : function(item){
            let items;
            if (localStorage.getItem('items') === null){
                items = [];

                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
            else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
        },

        getItemsFromStorage : function(){
            let item;
            if(localStorage.getItem('items')===null){
                item = [];
            }else{
                item = JSON.parse(localStorage.getItem('items'));

            }
            return item;
        },

        updateItemFromStorage : function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage : function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(id === item.id){
                    items.splice(index,1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemFromStorage : function(){
            localStorage.removeItem('items');
        }
    }
})();


const itemCtrl = (function(){
    const Item = function(idCard,toppings,price,imgsrc){
        this.idCard = idCard;
        this.toppings = toppings;
        this.price = price;
        this.imgsrc = imgsrc;
    }

    const data = {
        items : StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalHargaCart : 0
    }

    return {

        getItems : function(){
            return data.items;
        },

        deleteItem : function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });
            const index = ids.indexOf(id);
            data.items.splice(index,1);
        },

        getTotalHarga : function(){
            let total = 0;
            data.items.forEach(function(item){
                total += Number(replaceCommas(item.price));
            });
            data.totalHargaCart = total;
            return data.totalHargaCart;
        },

        logData : function(){
            return data;
        }

    }
})();

const UICtrlCart = (function(){
    const UISelectorCart = {
        orderList       : `#table-cart tbody`,
        proceedBtn      : `#proceed-payment`,
    }

    return {

        getAllCartData : function(idCard){
            return {
                idCard : `${idCard}`,
                toppings : UICtrlTopping.getToppingData(idCard),
                price : UICtrlTopping.calculateToppingTotal(idCard),
                imgsrc : document.querySelector(`#${idCard} img`).src,
            }
        },

        populateToppingList : function(item){
            let listTopping = '';
            let asu = item.toppings

            asu.forEach(function(top){
                if (top.qty > 0){
                    listTopping += `<li> ${top.name} : ${top.qty} </li>`
                }
            });
            return listTopping
        },

        populateItemList : function(items){
            let html = '';

            items.forEach(function(item){
                let tops = UICtrlCart.populateToppingList(item)
                let qtyOrderInput = document.getElementById(`input-${item.idCard}`)
                
                html += `<tr class="productCart">
                <td class="w-25">
                  <img src=${item.imgsrc}>
                </td>
                <td><ul>${tops}</ul></td>
                <td>${item.price}</td>
                <td><input type="number" class="form-control product-qty" id="input-${item.idCard}" value="1"></td>
                <td>${Number(qtyOrderInput)*Number(replaceCommas(item.price))}</td>
                <td><input type="text" class="form-control notes" placeholder="Catatan"></td>
                <td>
                  <a href="#" class="btn btn-danger btn-sm">
                    <i class="fa fa-times"></i>
                  </a>
                </td>
              </tr>`
            });
            document.querySelector(UISelectorCart.orderList).innerHTML = html;
        },
    }
})();



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

const App = (function(UICtrlTopping,UICtrlCart,itemCtrl){
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
            el.addEventListener('input',function(){
                UICtrlTopping.calculateEachToppingTotal(el.parentElement.parentElement.id)
                UICtrlTopping.calculateToppingTotal(idCardName)
            })
        });

        const itemMoveToCart = function(){
            const orderData = UICtrlCart.getAllCartData(idCardName);
            StorageCtrl.allOrder(orderData);
        }

        

    document.querySelector(UISelector.proceedBtn).addEventListener('click',itemMoveToCart);
    document.addEventListener('keypress',function(e){
        if(e.key === 'Enter' || e.code === 'Enter'){
            e.preventDefault;
            return false;
        }
    });

    }

    

    return {
        init : function(){

            const items = itemCtrl.getItems();
            UICtrlCart.populateItemList(items);
            loadEventListeners();
        }
    }
})(UICtrlTopping,UICtrlCart,itemCtrl);


App.init();


// notes :
// 1. Each topping total calculation
    // 1.a change when topping qty inputed --> done
// 2. Total price topping calculation
    // 2. change when topping qty inputed --> done
// 3. Check out button function
    // 3.a when checkout btn clicked -> store all data to local
    // 3.b also store data to chart

