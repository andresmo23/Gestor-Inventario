export function agregarNuevoProducto(inventarioExistente, nuevoProdcuto) {
  //encontrar el Id mayor
  const idMayor = inventarioExistente.reduce((acumulador, valorActual) => {
    return Math.max(acumulador, valorActual.id);
    // -infitity asegura que se tome el primer valor del array como el mayor
  }, -Infinity);

  /* // Manejar el caso de inventario vacío
  const idMayor = inventarioExistente.length > 0 ? inventarioExistente.reduce((maxId, item) => Math.max(maxId, item.id), 0) : 0; // Si el array está vacío, el ID inicial es 0 para que el primero sea 1 */

  // crear un nuevo id sumandole 1 al mayor
  const nuevoId = idMayor + 1;

  //crear un objeto asignandole el nuevoId y copiando las propiedades que recibe el parametro
  const productoCompleto = {
    id: nuevoId,
    ...nuevoProdcuto,
  };

  // crear un nuevo arreglo que tenga tanto el array anterior y se le sume el objeto nuevo creado
  const inventarioNuevo = [...inventarioExistente, productoCompleto];

  return inventarioNuevo;
}

export function eliminarProducto(inventarioExistente, idProductoAEliminar) {
  const inventarioConProductoEliminado = inventarioExistente.filter((producto) => producto.id !== idProductoAEliminar);
  return inventarioConProductoEliminado;
}

export function actualizarProducto(inventarioActual, idProductoAActualizar, nuevosDatos) {
  const inventarioActualizado = inventarioActual.map((producto) => {
    if (producto.id === idProductoAActualizar) {
      return { ...producto, ...nuevosDatos };
      /* 
      -Copia todas las propiedades del objeto 'producto' original 
      -Copia todas las propiedades del objeto 'nuevosDatos'.
      -Si alguna propiedad de 'nuevosDatos' tiene el mismo nombre que una 
      de 'producto', la de 'nuevosDatos' la sobrescribirá.
      */
    } else {
      return producto; // si el id no coincide devuelva el producto original
    }
  });

  return inventarioActualizado;
}

export function obtenerCategoriasUnicas(inventarioExistente) {
  const todasLasCategorias = inventarioExistente.map((producto) => producto.categoria);
  const categoriasUnicas = new Set(todasLasCategorias); // me devuelve valores unicos

  return [...categoriasUnicas]; // convierto el set de nuevo a un arreglo copiando las propiedades del set
}

export function buscarProducto(inventarioExistente, terminoBusqueda) {
  return inventarioExistente.filter((producto) => {
    return producto.nombre.toLowerCase().includes(terminoBusqueda) || String(producto.id).includes(terminoBusqueda);
  });
}

export function filtrarPorCategoria(inventarioExistente, categoria) {
  // Si es "todas", devuelve el array completo sin filtrar
  if (categoria === "todas") {
    return inventarioExistente;
  }

  return inventarioExistente.filter((producto) => producto.categoria.toLowerCase() === categoria.toLowerCase());
}

export function calcularResumenInventario(inventarioExistente) {
  const calcularValorTotal = inventarioExistente.reduce((acc, producto) => {
    const precioTotalDeProducto = producto.precio * producto.stock;
    return acc + precioTotalDeProducto;
  }, 0);

  const productosTotales = inventarioExistente.length;

  const cantidadPorCategoria = inventarioExistente.reduce((acc, producto) => {
    const categoriaFormateada = producto.categoria.toLowerCase().trim();
    if (acc[categoriaFormateada]) {
      acc[categoriaFormateada]++;
    } else {
      acc[categoriaFormateada] = 1;
    }

    return acc;
  }, {});

  const objetoDeResultados = {
    valorTotal: calcularValorTotal,
    productosTotales: productosTotales,
    cantidadPorCategoria: cantidadPorCategoria,
  };

  return objetoDeResultados;
}
