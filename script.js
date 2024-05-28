const checkRestOpen = () =>{
    const date = new Date;
    const hours = date.getHours();
    return hours >= 18 && hours <= 22
    
}

const dataOpen = document.querySelector("#data");

const isOpen = checkRestOpen();

if(isOpen){
    dataOpen.classList.remove('bg-red-500');
    dataOpen.classList.add('bg-green-600');
}else{
    dataOpen.classList.add('bg-red-500');
    dataOpen.classList.remove('bg-green-600');
}
     


const cartClose = document.querySelector("#cart")
const cartOpen = document.querySelector("#open-cart");
const CartItem = document.querySelector(".add-cart-item");
const menu     = document.querySelector("#menu");
const list     = document.querySelector("#cart-item");
const totalPrice = document.querySelector('#total-value')
const items      = document.querySelector('#count')
const closeCart  = document.querySelector('#close-cart')
const form               = document.querySelector(".form");
const inputName          = document.querySelector("#alert-warn-name");
const alertSpanNome      = document.querySelector(".alert-warn-span");
const inputCep           = document.querySelector('#alert-warn-cep');
const alertSpanCep       = document.querySelector('.alert-span-cep')
const btnEnv             = document.querySelector("#env-btn");
const alertCart          = document.querySelector("#alert-card");
const alertCep           = document.querySelector("#alert-warn-cep")
const endereço           = document.querySelector("#endereço");
const cart = []
//Fechar carrinho
cartClose.addEventListener("click", (e) =>{
    if(e.target === cartClose){
        cartClose.style.display = 'none'
    }
})

closeCart.addEventListener('click', () => {
    cartClose.style.display = 'none'
})

//Abrir Carrinho
cartOpen.addEventListener("click", () =>{
    upDateCart()
    cartClose.style.display = 'flex'
});

menu.addEventListener('click', (e) =>{
    let parentButton = e.target.closest(".add-cart-item");
    const name =  parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    cartAdd(name, price)

})

//funções 

const cartAdd = (name, price) =>{
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        existingItem.quantify += 1;
    }else{
        cart.push({
            name,
            price,
            quantify: 1
        })
        Toastify({
            text: "Adicionado no carrinho",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#2da52d",
            },
           }).showToast();
    }

    upDateCart()
}

const upDateCart = () =>{
    list.innerHTML = "";
    let total = 0
    totalPrice.innerHTML = total
    cart.forEach(item => {
       const cartItemCreate = document.createElement('div');
       const totalPrice = item.price * item.quantify;
       total += totalPrice; 
       
       cartItemCreate.innerHTML = `
           <div class="border-b-2">
                <div class="flex gap-8 justify-between items-center">
                    <div class="flex flex-col gap-2">
                        <h2 class="font-bold">${item.name}</h2>
                        <span>Qtd: ${item.quantify}</span>
                        <span class="font-bold">R$${totalPrice.toFixed(2)}</span>
                    </div>

                    <div>
                        <button class="px-2 py-2 bg-slate-300 rounded remove-btn" data-name="${item.name}">Remover</button>
                    </div>
                </div>
           </div>
       `
       list.appendChild(cartItemCreate);
    })

    totalPrice.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    items.textContent = cart.length
}



//Remoção de item da lista

list.addEventListener("click", (e) => {
    if(e.target.classList.contains("remove-btn")){
        const name = e.target.getAttribute("data-name");

        removeItemCart(name)
    }
})

const removeItemCart = (name) => {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantify > 1){
            item.quantify -= 1
            upDateCart();
            return;
        }

        Toastify({
            text: "Removido com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#2da52d",
            },
           }).showToast();

        cart.splice(index, 1);
        upDateCart();
    }
}

//Buscar CEP
inputCep.addEventListener("input", () => {
    const cepValue = inputCep.value.replace(/\D/g, '');


    fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
    .then(res => res.json()
    .then(data => {
        if(data.erro){
            alertCep.innerHTML = "CEP INVALIDO"
        }else{
            endereço.textContent = `${data.cep}, ${data.logradouro}, ${data.bairro}, ${data.uf}`
        }
    })
)
})

inputName.addEventListener("input", (e) => {
    const inputValue = e.target.value;
    if(inputValue !== ""){
        inputName.classList.remove('border-red-600')
        alertSpanNome.classList.add('hidden')
    }
});

inputCep.addEventListener("input", (e) =>{
    const inputValue = e.target.value;

    if(inputValue.value !== ""){
        inputCep.classList.remove('border-red-600')
        alertSpanCep.classList.add('hidden')
    }
})

//Finalizar pedido
btnEnv.addEventListener('click', () =>{

    const isOpen = checkRestOpen();

    if(!isOpen){
       Toastify({
        text: "Ops Restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
       }).showToast();
        return;
    }

    if(cart.length === 0){
        alertCart.classList.remove('hidden')
        return;
    }

    if(inputName.value === ""){
        inputName.classList.add('border-red-600')
        inputName.classList.remove('hidden')
        alertSpanNome.classList.remove('hidden')
        inputCep.classList.add('border-red-600')
        alertSpanCep.classList.remove('hidden')
        return;
    }

    //Enviar pedido 
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantify}), R$${item.price} | `
        )

    }).join("")

    const menssage = encodeURIComponent(cartItems);

    const phone = "61982410552"

    open(`https://wa.me/${phone}?text=${menssage} Nome do cliente: R${inputName.value} Endereço: ${endereço.value}`, "_black" );

    cart = []
    upDateCart();
})

console.log(inputCep)








