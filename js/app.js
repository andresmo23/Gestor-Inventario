// importaciones necesarias

import { inventarioInicial } from "./inventario-data.js";
import {
  agregarNuevoProducto,
  eliminarProducto,
  actualizarProducto,
  buscarProducto,
  obtenerCategoriasUnicas,
  filtrarPorCategoria,
  calcularResumenInventario,
} from "./inventario-services.js";

// variable de estado global para el inventario ya que sus datos van a ir cambiando
let inventario = inventarioInicial;

// referencias al DOM
const tBody = document.getElementById("body-tabla-productos");

const inputNombre = document.getElementById("nombre-producto");
const inputPrecio = document.getElementById("precio-producto");
const inputStock = document.getElementById("stock-producto");
const inputDescripcion = document.getElementById("descripcion-producto");
const inputCategoria = document.getElementById("categoria-producto");
const btnAgregar = document.getElementById("btn-agregar");
const btnActualizar = document.getElementById("btn-actualizar");

const inputBusqueda = document.getElementById("input-busqueda");
const selectCategoria = document.getElementById("filtro-categoria");

const valorTotalInventario = document.getElementById("valor-total-inventario");
const cantidadTotalProductos = document.getElementById("cantidad-total-productos");
const listaCategoria = document.getElementById("lista-categorias");

// funcion para renderizar los datos del arreglo para crear filas y celdas y se visualice
function renderizarInventario(listaDeProductos) {
  tBody.innerHTML = "";

  listaDeProductos.forEach((element) => {
    const trProductoActual = document.createElement("tr");

    //creacion de elementos y asignacion de contenido
    const tdId = document.createElement("td");
    tdId.textContent = element.id;

    const tdNombre = document.createElement("td");
    tdNombre.textContent = element.nombre;

    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = element.precio;

    const tdStock = document.createElement("td");
    tdStock.textContent = element.stock;

    const tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = element.descripcion;

    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = element.categoria;

    const tdAcciones = document.createElement("td");
    const divbotones = document.createElement("div");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn-editar");
    btnEditar.dataset.id = element.id;
    btnEditar.dataset.action = "editar";
    const iconEditar = document.createElement("i");
    iconEditar.classList.add("bx", "bx-edit-alt");

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.dataset.id = element.id;
    btnEliminar.dataset.action = "eliminar";
    const iconEliminar = document.createElement("i");
    iconEliminar.classList.add("bx", "bx-trash");

    btnEditar.appendChild(iconEditar);
    btnEliminar.appendChild(iconEliminar);
    divbotones.appendChild(btnEditar);
    divbotones.appendChild(btnEliminar);

    tdAcciones.appendChild(divbotones);

    //agregar elementos al tr
    trProductoActual.appendChild(tdId);
    trProductoActual.appendChild(tdNombre);
    trProductoActual.appendChild(tdPrecio);
    trProductoActual.appendChild(tdStock);
    trProductoActual.appendChild(tdDescripcion);
    trProductoActual.appendChild(tdCategoria);
    trProductoActual.appendChild(tdAcciones);

    //agregar tr al tbody
    tBody.appendChild(trProductoActual);
  });
}

// llamar a la funcion para poder renderizar
renderizarInventario(inventario);
popularSelectCategorias(); // llamar a la funcion para llenar las categorias
renderizarResumenInventario();

// evento para agregar nuevo producto
btnAgregar.addEventListener("click", (eve) => {
  eve.preventDefault(); //prevenir comportamiento por defecto del formulario

  //capturar el valor de los elementos inputs
  const nombreValor = inputNombre.value;
  const precioValor = parseInt(inputPrecio.value, 10);
  const stockValor = parseInt(inputStock.value, 10);
  const descripcionValor = inputDescripcion.value;
  const categoriaValor = inputCategoria.value;

  // crear el objeto nuevo producto sin el id
  const nuevoProdcuto = {
    nombre: nombreValor,
    precio: precioValor,
    stock: stockValor,
    descripcion: descripcionValor,
    categoria: categoriaValor,
  };

  // llamar a la funcion agregarNuevoProducto pasandole el arreglo y el objeto y guardando el return en una varibale
  const inventarioConProductoAgregado = agregarNuevoProducto(inventario, nuevoProdcuto);

  // actualizar la variable global
  inventario = inventarioConProductoAgregado;

  // volver a renderizar el arreglo
  renderizarInventario(inventario);
  popularSelectCategorias();
  renderizarResumenInventario();

  // despues de agregar el producto limpiar los inputs
  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";
  inputDescripcion.value = "";
  inputCategoria.value = "";
});

//variable global para guardar el ID del producto que se va a editar
let idProductoAEditar;

// delegacion de eventos en el tbody para obtener el boton editar y eliminar
tBody.addEventListener("click", (event) => {
  const targetBtnCliceado = event.target.closest(".btn-editar, .btn-eliminar");

  if (targetBtnCliceado) {
    //obtener el id del producto y el action de los atributos
    const idProducto = parseInt(targetBtnCliceado.dataset.id, 10); //el 10 es una buena practica para garantizar que la conversion sea en sistema decimal.
    const tipoAccion = targetBtnCliceado.dataset.action;

    switch (tipoAccion) {
      case "eliminar":
        // 1. Llama a la función de servicio:
        const inventarioActualizado = eliminarProducto(inventario, idProducto);
        // 2. Actualiza la variable global 'inventario':
        inventario = inventarioActualizado;
        // 3. Vuelve a renderizar la tabla:
        renderizarInventario(inventario);
        popularSelectCategorias();
        renderizarResumenInventario();
        break;
      case "editar":
        // encontrar el producto
        const productoAEditar = inventario.find((prod) => prod.id === idProducto);
        // pre-llenar el formulario
        if (productoAEditar) {
          inputNombre.value = productoAEditar.nombre;
          inputPrecio.value = productoAEditar.precio;
          inputStock.value = productoAEditar.stock;
          inputDescripcion.value = productoAEditar.descripcion;
          inputCategoria.value = productoAEditar.categoria;

          // inhabilitar btn-agregar y habilitar btn-actualizar
          btnAgregar.disabled = true;
          btnActualizar.disabled = false;

          // asignacion de la variable global que guarda el idproductoeditar
          idProductoAEditar = idProducto;
          window.location.hash = "#agregar-producto-form";
        }
        break;
    }
  } else {
    console.log("Hola sapaperra");
  }
});

// evento para actualizar el inventario
btnActualizar.addEventListener("click", (e) => {
  e.preventDefault();

  // capturar los nuevos valores de los inputs
  const nombreValor = inputNombre.value;
  const precioValor = parseInt(inputPrecio.value, 10);
  const stockValor = parseInt(inputStock.value, 10);
  const descripcionValor = inputDescripcion.value;
  const categoriaValor = inputCategoria.value;

  // crear el objeto con los nuevos datos
  const datosActualizados = {
    nombre: nombreValor,
    precio: precioValor,
    stock: stockValor,
    descripcion: descripcionValor,
    categoria: categoriaValor,
  };

  // id guardado en la variable global
  const idAActualizar = idProductoAEditar;

  // llamar a la funcion de servicio para actualizar
  const inventarioConCambios = actualizarProducto(inventario, idAActualizar, datosActualizados);

  // actualizo la variable global
  inventario = inventarioConCambios;

  // renderizo inventario
  renderizarInventario(inventario);
  popularSelectCategorias();
  renderizarResumenInventario();

  //resetear el formulario
  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";
  inputDescripcion.value = "";
  inputCategoria.value = "";

  // inhabilitar btn-actualizar y habilitar btn-agregar
  btnAgregar.disabled = false;
  btnActualizar.disabled = true;
});

// evento para el buscador
inputBusqueda.addEventListener("input", () => aplicarFiltrosYRenderizarInventario());

// evento para el select
selectCategoria.addEventListener("change", () => aplicarFiltrosYRenderizarInventario());

// llenar el select dinamicamente
function popularSelectCategorias() {
  selectCategoria.innerHTML = "";

  const opcionTodas = document.createElement("option");
  opcionTodas.value = "todas";
  opcionTodas.textContent = "Todas las Categorias";
  selectCategoria.appendChild(opcionTodas);

  const categoriasUnicas = obtenerCategoriasUnicas(inventario);
  categoriasUnicas.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    selectCategoria.appendChild(opcion);
  });
}

// funcion para buscar por el input y por el select
function aplicarFiltrosYRenderizarInventario() {
  // obtener el termino de busqueda actual
  const terminoBusqueda = inputBusqueda.value.toLowerCase();

  // obtener la categoria seleecionada actual
  const categoriaSeleccionada = selectCategoria.value;

  let inventarioFiltrado = inventario;

  // aplicar el filtro de busqueda si hay un termino
  if (terminoBusqueda) {
    inventarioFiltrado = buscarProducto(inventario, terminoBusqueda);
  }

  // aplicar el filtro de categoria si no es todas
  if (categoriaSeleccionada && categoriaSeleccionada !== "todas") {
    inventarioFiltrado = filtrarPorCategoria(inventarioFiltrado, categoriaSeleccionada);
  }

  //renderizar inventario
  renderizarInventario(inventarioFiltrado);
}

// funcion para renderizar el resumen del inventario
function renderizarResumenInventario() {
  // llamar a la funcion para calcular el resumen y pasarle el inventario como argumento
  const resumenInventario = calcularResumenInventario(inventario);

  const formateadorCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const valorFormateado = formateadorCOP.format(resumenInventario.valorTotal);

  // mostrar los valores de la funcion
  valorTotalInventario.textContent = valorFormateado;
  cantidadTotalProductos.textContent = resumenInventario.productosTotales;

  listaCategoria.innerHTML = "";

  const entradasDeCategoria = Object.entries(resumenInventario.cantidadPorCategoria);

  entradasDeCategoria.forEach(([nombreCategoria, cantidad]) => {
    const liCategoria = document.createElement("li");
    const nombreCategoriaFormateado = nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1);
    liCategoria.textContent = `${nombreCategoriaFormateado}: ${cantidad}`;
    listaCategoria.appendChild(liCategoria);
  });
}
