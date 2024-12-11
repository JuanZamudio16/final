//DOM
document.addEventListener('DOMContentLoaded', () => { 
    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Camisa Mujer',
            precio: 50000,
            imagen: 'images/camisa_mujer.png',
            categoria: 'camisas'
        },
        {
            id: 2,
            nombre: 'Patalon Mujer',
            precio: 90000,
            imagen: 'images/pantalones_mujer.png',
            categoria: 'pantalones'
        },
        {
            id: 3,
            nombre: 'Zapatos Mujer',
            precio: 150000,
            imagen: 'images/zapatos_mujer.png',
            categoria: 'zapatos'
        },
        {
            id: 4,
            nombre: 'Camisa Hombre',
            precio: 70000,
            imagen: 'images/camisa_hombre.png',
            categoria: 'camisas'
        },
        {
            id: 5,
            nombre: 'Patalon Hombre',
            precio: 60000,
            imagen: 'images/pantalones_hombre.png',
            categoria: 'pantalones'
        },
        {
            id: 6,
            nombre: 'Zapatos Hombre',
            precio: 90000,
            imagen: 'images/zapatos_hombre.png',
            categoria: 'zapatos'
        },
        {
            id: 7,
            nombre: 'Camisa Niño',
            precio: 35000,
            imagen: 'images/camisa_niño.png',
            categoria: 'camisas'
        },
        {
            id: 8,
            nombre: 'Patalon Niño',
            precio: 60000,
            imagen: 'images/pantalones_niño.jpg',
            categoria: 'pantalones'
        },
        {
            id: 9,
            nombre: 'Zapatos Niño',
            precio: 130000,
            imagen: 'images/zapatos_niños.png',
            categoria: 'zapatos'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    const filtroSelect = document.getElementById("filtro");

    // Funciones

    function renderizarProductos() {
        DOMitems.innerHTML = "";
//trae todos los elementos del filtro
        const filtro = filtroSelect.value;
        const productosFiltrados = baseDeDatos.filter(producto => 
            filtro === "todos" || producto.categoria === filtro
        );

        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            
            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio}`;
            
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

// Obtén el contador del almacenamiento local
let visitas = localStorage.getItem('contadorVisitas');

// Si no hay visitas almacenadas, inicializa a 0
if (!visitas) {
    visitas = 0;
}

// Incrementa el contador
visitas++;

// Guarda el nuevo contador en el almacenamiento local
localStorage.setItem('contadorVisitas', visitas);

// Muestra el contador en la página
document.getElementById('contador').textContent = visitas;

    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }

    function handleCarritoValue(value) {
        const carritoContainer = document.getElementById("carrito-value");
        carritoContainer.textContent = `${value}`;
    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];

        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
            
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }

    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }

    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            handleCarritoValue(carrito.length);
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});