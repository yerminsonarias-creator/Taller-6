// Dirección de la API con la lista de productos del catálogo
const URL_LISTA_PRODUCTOS = "https://dummyjson.com/products?limit=20";

const contenedorCatalogo = document.getElementById("catalogo");
const mensajeEstado = document.getElementById("mensaje-estado");
const campoBusqueda = document.getElementById("campo-busqueda");
const plantillaTarjeta = document.getElementById("plantilla-tarjeta");

let listaProductos = [];

function mostrarEstado(texto, esError = false) {
  mensajeEstado.textContent = texto;
  mensajeEstado.classList.toggle("estado--error", esError);
}

function irAlDetalle(id) {
  window.location.href = `producto.html?id=${id}`;
}

function crearTarjeta(producto) {
  const fragmento = plantillaTarjeta.content.cloneNode(true);
  const tarjeta = fragmento.querySelector(".tarjeta");

  const imagen = fragmento.querySelector(".tarjeta__imagen img");
  imagen.src = producto.thumbnail;
  imagen.alt = producto.title;

  fragmento.querySelector(".tarjeta__categoria").textContent = producto.category;
  fragmento.querySelector(".tarjeta__nombre").textContent = producto.title;
  fragmento.querySelector(".tarjeta__precio").textContent = `$${producto.price.toFixed(2)}`;
  fragmento.querySelector(".tarjeta__calificacion").textContent = `★ ${producto.rating}`;
  fragmento.querySelector(".tarjeta__stock").textContent = `Stock: ${producto.stock}`;

  const boton = fragmento.querySelector(".boton");
  boton.href = `producto.html?id=${producto.id}`;

  tarjeta.addEventListener("click", () => irAlDetalle(producto.id));

  return fragmento;
}

function mostrarProductos(productos) {
  contenedorCatalogo.replaceChildren();

  if (productos.length === 0) {
    mostrarEstado("No se encontraron productos con ese nombre.");
    return;
  }

  mostrarEstado("");
  const fragmentoTarjetas = document.createDocumentFragment();
  productos.forEach((producto) => fragmentoTarjetas.appendChild(crearTarjeta(producto)));
  contenedorCatalogo.appendChild(fragmentoTarjetas);
}

function filtrarProductos() {
  const texto = campoBusqueda.value.trim().toLowerCase();
  const filtrados = listaProductos.filter((producto) =>
    producto.title.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
}

async function cargarProductos() {
  mostrarEstado("Cargando productos...");

  try {
    const respuesta = await fetch(URL_LISTA_PRODUCTOS);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    listaProductos = datos.products;
    mostrarProductos(listaProductos);
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    mostrarEstado(
      "No se pudieron cargar los productos. Revisa tu conexión e inténtalo de nuevo.",
      true
    );
  }
}

campoBusqueda.addEventListener("input", filtrarProductos);

cargarProductos();
