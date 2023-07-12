const apiUrl = "https://ecommercebackend.fundamentos-29.repl.co/"

async function getApi (apiUrl) {
    try {
        const data = await fetch(apiUrl)
        const response = await data.json()
        localStorage.setItem("products", JSON.stringify(response))
    } catch (error) {
        console.log(error);
    }
}

// -------------------------------------------- functions 

function printProduct (arr = store.product) {

    let html = ``

    for (const iterator of arr) {
        const {name, image, id, price, quantity} = iterator

        html += `
            <div class="product">
                <div class="img_product">
                    <img src="${image}">
                </div>
                <div class="produc_info">
                    <h4>${name}</h4>
                    <p>$${price} | cantidad: ${quantity}</p>
                    ${quantity
                        ?`<i class='bx bxs-plus-circle bx-md bx-flashing-hover' id="${id}"></i>`
                        :"<span>Agotado</span>"}
                </div>                
            </div>
        `
        console.log(iterator);
    }
    document.querySelector(".products").innerHTML = html
}

function cartMove(){
    const cartHtml = document.querySelector(".cart")
    const iconCart = document.querySelector(".bx-cart")

    iconCart.addEventListener("click", function(){
        cartHtml.classList.toggle("cart_show")
    })
}

function findProductToCart() {
    const productHtml = document.querySelector(".products")

    productHtml.addEventListener(`click`, function(e) {

        if (e.target.classList.contains("bxs-plus-circle")){
            const idItem = Number(e.target.id)

            const productFind = store.product.find(function(product){
                return product.id === idItem
            })

            if (store.cart[productFind.id]) {
                if(productFind.quantity === store.cart[productFind.id].amount)
                    return alert(`no quedan mas unidades`)
                store.cart[productFind.id].amount++
            } else {
                store.cart[productFind.id] = {
                    ...productFind,
                    amount: 1
                }
            }

            localStorage.setItem(`cart`, JSON.stringify(store.cart))

            printToCart()
            totalCart()
        }
    })
}

function printToCart() {
    
    let html = ``

    for (const key in store.cart) {
        const {amount, name, image, price, quantity, id} = store.cart[key]

        html += `
            <div class="cart_pdt">
                <div class="cart_img">
                    <img src="${image}" alt="image_product">
                </div>
                <div class="cart_body">
                    <h5>${name} - $${price}</h5>

                    <div class="cart_op" id="${id}">
                    <i class='bx bx-minus'></i>
                    <span> ${amount} unit</span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bxs-trash'></i>
                    </div>

                    <div class="cart_tt">
                    <p>total: ${amount * price}</p>
                    </div>
                </div>
            </div>
        `
    }

    document.querySelector(".cart_product").innerHTML = html
}

function cartLogic () {
    const cart_product = document.querySelector(".cart_product")

    cart_product.addEventListener("click", function(e) {
        
        if (e.target.classList.contains("bx-plus")){
            const id = Number(e.target.parentElement.id)
            const product = store.cart[id]
            if (product.amount < product.quantity){
                product.amount++
            } else {
                alert(`No quedan mas Unidades`)
            }               
        }

        if (e.target.classList.contains("bx-minus")){
            const id = Number(e.target.parentElement.id)
            const product = store.cart[id]
            if (product.amount <= 1){
                null
            } else {
                product.amount--
            }
        }

        if (e.target.classList.contains("bxs-trash")){
            const id = Number(e.target.parentElement.id)
            const response = confirm(`estas seguro de eliminar el producto`)
            if (response) {
                delete store.cart[id]
            }
        }

        localStorage.setItem("cart", JSON.stringify(store.cart))
        printToCart()
        totalCart()
    })

}

function totalCart () {
    const infoPrice = document.querySelector(".info_price")
    const infoAmount = document.querySelector(".info_amount")

    let amountTotal = 0
    let priceTotal = 0

    for (product in store.cart) {
        const {amount, price} = store.cart[product]
        amountTotal += amount
        priceTotal += price * amount
    }

    infoAmount.textContent = amountTotal + `unidad`
    infoPrice.textContent = `$`+ priceTotal + `.00`
}

function buyLogic () {
    const btnBuy = document.querySelector(".btn_total")

    btnBuy.addEventListener("click", function() {
        if (!Object.values(store.cart).length)
            return alert("agrege un producto")
        const response = confirm("seguro quieres realizar la compra")
        if (!response) return

        const currentProduct = []
        for (const product of store.product) {
            const productCart = store.cart[product.id]
            if (product.id === productCart?.id){
                currentProduct.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                })
            } else {
                currentProduct.push(product)
            }
        }

        store.product = currentProduct
        store.cart = {}

        localStorage.setItem("products", JSON.stringify(store.product))
        localStorage.setItem("cart", JSON.stringify(store.cart))

        totalCart()
        printToCart()
        printProduct()
    })
}

function buttonFilter() {

    const buttonHtml = document.querySelectorAll(".buttons .btn")
    const product = store.product

    for (const button of buttonHtml) {
        
        button.addEventListener("click", function(e) {

            const filterBtn = e.target.id

            if (filterBtn === "all") {
                printProduct(product)
            } else {
                const newArr = product.filter(function (product){
                    return product.category === filterBtn
                })
                printProduct(newArr)
            }
        })
    }
}

// -------------------------------------------- main

async function main () {
    store = {
        product: JSON.parse(window.localStorage.getItem("products"))
        || await getApi(apiUrl),
        cart: JSON.parse(localStorage.getItem(`cart`)) || {}
    }

    printProduct(store.product)
    cartMove()
    findProductToCart()
    printToCart()
    cartLogic()
    totalCart()
    buyLogic()
    buttonFilter()
}

main()

