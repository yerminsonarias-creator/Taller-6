// Dirección base de la API para consultar un producto por su id
const URL_DETALLE_PRODUCTO = "https://dummyjson.com/products";

const mensajeEstado = document.getElementById("mensaje-estado");
const panelDetalle = document.getElementById("panel-detalle");

function mostrarEstado(texto, esError = false) {
  mensajeEstado.textContent = texto;
  mensajeEstado.classList.toggle("estado--error", esError);
}

function obtenerIdProducto() {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");

  if (id === null || !/^\d+$/.test(id) || Number(id) < 1) {
    return null;
  }
  return id;
}

function mostrarProducto(producto) {
  const imagen = document.getElementById("producto-imagen");
  imagen.src = producto.images && producto.images.length > 0 ? producto.images[0] : producto.thumbnail;
  imagen.alt = producto.title;

  document.getElementById("producto-categoria").textContent = producto.category;
  document.getElementById("producto-nombre").textContent = producto.title;
  document.getElementById("producto-precio").textContent = `$${producto.price.toFixed(2)}`;
  document.getElementById("producto-descripcion").textContent = producto.description;
  document.getElementById("producto-calificacion").textContent = `★ ${producto.rating}`;
  document.getElementById("producto-stock").textContent = producto.stock;
  // Algunos productos de la API no tienen marca
  document.getElementById("producto-marca").textContent = producto.brand || "Sin marca";
  document.getElementById("producto-descuento").textContent = `${producto.discountPercentage}%`;

  document.title = `${producto.title} | Detalle del producto`;

  mostrarEstado("");
  panelDetalle.hidden = false;
}

async function cargarProducto() {
  const id = obtenerIdProducto();

  if (id === null) {
    mostrarEstado("El identificador del producto no es válido. Vuelve al catálogo y selecciona uno.", true);
    return;
  }

  mostrarEstado("Cargando producto...");

  try {
    const respuesta = await fetch(`${URL_DETALLE_PRODUCTO}/${id}`);

    if (respuesta.status === 404) {
      mostrarEstado("No encontramos el producto solicitado. Vuelve al catálogo y selecciona otro.", true);
      return;
    }
    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const producto = await respuesta.json();
    mostrarProducto(producto);
  } catch (error) {
    console.error("No se pudo cargar el producto:", error);
    mostrarEstado("No se pudo cargar el producto. Revisa tu conexión e inténtalo de nuevo.", true);
  }
}

cargarProducto();
