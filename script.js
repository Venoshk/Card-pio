//fechar/abrir/adicionar
const cartClose    = document.querySelector("#cart");
const closeCartBtn = document.querySelector('#close-cart');
const cartOpen     = document.querySelector("#open-cart");
const CartItem     = document.querySelector(".add-cart-item");
//Lista
const menu       = document.querySelector("#menu");
const list       = document.querySelector("#cart-item");
const totalPrice = document.querySelector('#total-value')
const items      = document.querySelector('#count');
//Form
const form          = document.querySelector(".form");
const nameClient    = document.querySelector("#name");
const nameWarn      = document.querySelector("#alert-name-span");
const homeClient    = document.querySelector("#home");
const homeWarn      = document.querySelector("#alert-home-span");
const cep           = document.querySelector('#cep');
const cepWarn       = document.querySelector('#alert-cep-span');
const address       = document.querySelector("#address");
const addressWarn   = document.querySelector("#alert-address-span");
const message       = document.querySelector("#message");
const btnEnv        = document.querySelector("#env-btn");
const alertCart     = document.querySelector("#alert-card");
const phoneNumber   = document.querySelector("#phone-number");


//Open/Close restaurente 
const dateOpen = document.querySelector("#data");
let cart = [];

const checkRestOpen = () => {
    const date = new Date;
    const hours = date.getHours();
    return hours >= 18 && hours <= 22
}
const isOpen = checkRestOpen();

if (isOpen) {
    dateOpen.classList.remove('bg-red-500');
    dateOpen.classList.add('bg-green-700');
} else {
    dateOpen.classList.add('bg-red-500');
    dateOpen.classList.remove('bg-green-700');
}




//funções 
const confirmRequestUser = (code, total) =>{
    const cartItems = cart.map((item) => {
        let price = parseFloat(item.price);
        return (
            `${item.name} Quantidade: *(${item.quantify})*, - *R$${price.toFixed(2)}*,  | `
        )
    }).join("")
    
    
    const menssage = encodeURIComponent(cartItems);

    const phone = "61982410552";

    const url = `https://wa.me/${phone}?text=${menssage}, valor a ser pago:*R$${total.toFixed(2)}*  Para confirmar seu pedido envie seu codigo: ${code} `;

    // Abrir link automaticamente
    window.location.href = url;
}

//Adicionar ao carrinho
const cartAdd = (name, price) => {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantify += 1;
        Toastify({
            text: "Adicionado no carrinho",
            duration: 3000,
            close: false,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#2da52d",
            },
        }).showToast();
    } else {
        cart.push({
            name,
            price,
            quantify: 1
        })
        Toastify({
            text: "Adicionado no carrinho",
            duration: 3000,
            close: false,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#2da52d",
            },
        }).showToast();
    }

    upDateCart()
}

//atualizar carrinho
const upDateCart = () => {
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
};

//remover items
const removeItemCart = (name) => {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantify > 1) {
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
};

//limpar inputs
const inputsRemoveValues = () => {
    nameClient.value = "";
    cep.value        = "";
    message.value    = "";
    homeClient.value = "";
    address.value    = "";
};
///Criar codigo
const generateConfirmationCode = () => {
    return Math.floor(Math.random() * 1000000)
};

//validar number-phone
const formatPhoneNumber = (e) =>{
    const input = e.target;
            let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
            const maxLength = 11;

            // Limita o valor ao comprimento máximo de 12 dígitos
            if (value.length > maxLength) {
                value = value.slice(0, maxLength);
            }

            // Adiciona a formatação (61) e o hífen após os primeiros 5 números
            if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            if (value.length > 8) {
                value = `${value.slice(0, 10)}-${value.slice(10)}`;
            }

            input.value = value;
};

//validar Cep
const formatCep = (e) =>{
    const input = e.target;
            let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
            const maxLength = 8;

            // Limita o valor ao comprimento máximo de 12 dígitos
            if (value.length > maxLength) {
                value = value.slice(0, maxLength);
            }

            if (value.length > 8) {
                value = `${value.slice(0, 10)}-${value.slice(10)}`;
            }

            input.value = value;
};

//Eventos

//Abrir Carrinho
cartOpen.addEventListener("click", () => {
    upDateCart()
    cartClose.style.display = 'flex'
});

//Fechar carrinho
cartClose.addEventListener("click", (e) => {
    if (e.target === cartClose) {
        cartClose.style.display = 'none'
    }
});

closeCartBtn.addEventListener('click', () => {
    cartClose.style.display = 'none'
});

//Remoção de item da lista
list.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const name = e.target.getAttribute("data-name");
        removeItemCart(name)
    }
});

//formatação de number
phoneNumber.addEventListener("input", formatPhoneNumber);

menu.addEventListener('click', (e) => {
    let parentButton = e.target.closest(".add-cart-item");
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    cartAdd(name, price)

});

//Buscar CEP
cep.addEventListener("input", async () => {
    const cepValue = cep.value.replace(/\D/g, '');

    await fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
        .then(res => res.json()
            .then(data => {
                if (data.erro) {
                    alertCep.innerHTML = "CEP INVALIDO"
                } else {
                    address.value = `${data.cep}, ${data.logradouro}, ${data.bairro}, ${data.uf}`
                }
            })
        )
});

//validação de cep
cep.addEventListener("input", formatCep);

//Verificação de cep
cep.addEventListener("input", (e) => {
    const inputValue = e.target.value;

    if (inputValue !== "") {
        cep.classList.remove('border-red-600')
        cepWarn.classList.add('hidden')
    }
});

//Verificação de nome
nameClient.addEventListener("input", (e) => {
    const inputValue = e.target.value;

    if (inputValue !== "") {
        nameClient.classList.remove('border-red-600')
        nameWarn.classList.add('hidden')
    }
});



//Verificação de endereço
address.addEventListener("input", (e) =>{
    const inputValue = e.target.value;

    if(inputValue !== ""){
        address.classList.remove("border-red-600");
        addressWarn.classList.add("hidden")
    }
});

//Verificação de numero da casa ou apt
homeClient.addEventListener("input", (e) =>{
    const inputValue = e.target.value;

    if(inputValue !== ""){
        homeClient.classList.remove("border-red-600")
        alertCart.classList.add("hidden")
    }
});

//Finalizar pedido
btnEnv.addEventListener('click', async (e) => {
    console.log(e.target)
    e.preventDefault();
    const isOpen = checkRestOpen();
    const code   = generateConfirmationCode();

    if (!isOpen) {
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
    };

    if (cart.length === 0) {
        alertCart.classList.remove('hidden')
        return;
    };

    if (nameClient.value === "" || cep.value === "" || address.value === "" || homeClient.value === "") {
        nameClient.classList.add('border-red-600');
        nameClient.classList.remove('hidden');
        nameWarn.classList.remove('hidden');
        cep.classList.add('border-red-600');
        cepWarn.classList.remove('hidden');
        address.classList.add('border-red-600');
        addressWarn.classList.remove('hidden');
        homeClient.classList.add("border-red-600");
        homeWarn.classList.remove("hidden");
        return;
    };
    
    const totalPagar = cart.reduce((total, item) => total + (item.price * item.quantify), 0);

    //envio para o admin
    await fetch('http://localhost:3000/enviar-pedido-whatsapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameClient.value,
            address: address.value,
            number: phoneNumber.value,
            cart: cart,
            message: message.value,
            home: homeClient.value,
            total: totalPagar,
            code: code
        })
    })
    .then(response => {
        if (response.ok) {
            let total = parseFloat(totalPagar);
            confirmRequestUser(code, total)
          
            Toastify({
                text: "Pedido enviado com sucesso!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#2da52d",
                },
            }).showToast();
    
            cart = [];
            inputsRemoveValues();
            upDateCart();
            
        } else {
            // Se houver algum erro na resposta do servidor
            Toastify({
                text: "Pedido não enviado, tente novamente!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "red",
                },
            }).showToast();
        }
    })
    .catch(_error => {
        // Se houver um erro na requisição
        console.error('Erro ao enviar pedido:', _error);
    });
});

