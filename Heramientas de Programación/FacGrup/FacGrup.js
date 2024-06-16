// Obtener referencias a los elementos del DOM
const itemRows = document.getElementById('item-rows');
const addRowButton = document.getElementById('add-row');
const enviarFacturaButton = document.getElementById('enviar-factura');
const reducirFacturaButton = document.getElementById('reducir-factura');
const eliminarFacturaButton = document.getElementById('eliminar-factura');
const numeroFactura = document.getElementById('numeroFactura');
const subtotalValue = document.getElementById('subtotal-value');
const discountValue = document.getElementById('discount-value');
const taxRateValue = document.getElementById('tax-rate-value');
const taxValue = document.getElementById('tax-value');
const totalValue = document.getElementById('total-value');
const addProductButton = document.getElementById('add-product');
const modifyProductButton = document.getElementById('modify-product');
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const saveProductButton = document.getElementById('save-product');

// Inicializar número de factura
let facturaNumero = localStorage.getItem('facturaNumero') ? parseInt(localStorage.getItem('facturaNumero')) : 0;
numeroFactura.textContent = facturaNumero.toString().padStart(5, '0');

// Validar fecha y hora automáticamente
document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  document.getElementById('fechaFactura').value = formattedDate;
  document.getElementById('horaFactura').value = formattedTime.slice(0, 5);
});

// Definir productos y precios
let products = {
  "Producto1": { name: "Manzanas", price: 2.00 },
  "Producto2": { name: "Platanos", price: 1.50 },
  "Producto3": { name: "Peras", price: 3.50 },
  "Producto4": { name: "Limas", price: 2.50 },
  "Producto5": { name: "Uvas", price: 4.10 },
  "Producto6": { name: "Kiwis", price: 4.50 },
  "Producto7": { name: "Sandias", price: 1.10 }
};

// Función para mostrar el formulario de productos
function showProductForm() {
  productForm.style.display = 'block';
}

// Función para ocultar el formulario de productos
function hideProductForm() {
  productForm.style.display = 'none';
  productNameInput.value = '';
  productPriceInput.value = '';
}

// Función para agregar un nuevo producto
function addProduct() {
  const productName = productNameInput.value.trim();
  const productPrice = parseFloat(productPriceInput.value.trim());
  if (productName && !isNaN(productPrice)) {
    const productId = `Producto${Object.keys(products).length + 1}`;
    products[productId] = { name: productName, price: productPrice };
    alert('Producto agregado exitosamente');
    hideProductForm();
  } else {
    alert('Por favor, ingrese un nombre y un precio válido para el producto');
  }
}

// Función para modificar un producto existente
function modifyProduct() {
  const productName = productNameInput.value.trim();
  const productPrice = parseFloat(productPriceInput.value.trim());
  const productKey = Object.keys(products).find(key => products[key].name.toLowerCase() === productName.toLowerCase());
  if (productKey && !isNaN(productPrice)) {
    products[productKey].price = productPrice;
    alert('Producto modificado exitosamente');
    hideProductForm();
  } else {
    alert('Producto no encontrado o precio inválido');
  }
}

// Función para agregar una nueva fila a la tabla
function addRow() {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
      <td>
        <select class="product-select">
          <option value="">Productos</option>
          ${Object.entries(products).map(([key, product]) => `<option value="${key}">${product.name}</option>`).join('')}
        </select>
      </td>
      <td><input type="text" placeholder="Nuevo Producto" class="new-product-input"></td>
      <td><input type="number" placeholder="Ingrese la cantidad" min="1" value="1" class="quantity"></td>
      <td><input type="number" placeholder="Precio unitario" min="0" step="0.01" value="0.00" class="price"></td>
      <td><input type="number" placeholder="Total" min="0" step="0.01" value="0.00" readonly class="row-total"></td>
      <td><button class="delete-row-btn">Eliminar fila</button></td>
    `;
  itemRows.appendChild(newRow);
  attachInputListeners(newRow);
  attachDeleteListener(newRow);
  updateTotals();
}

// Función para adjuntar los event listeners a los campos de entrada
function attachInputListeners(row) {
  const quantityInput = row.querySelector('.quantity');
  const priceInput = row.querySelector('.price');
  const productSelect = row.querySelector('.product-select');
  const newProductInput = row.querySelector('.new-product-input');

  quantityInput.addEventListener('input', updateTotals);
  quantityInput.addEventListener('change', updateTotals);
  productSelect.addEventListener('change', function () {
    const selectedProduct = this.value;
    const price = products[selectedProduct] ? products[selectedProduct].price : 0;
    priceInput.value = price.toFixed(2);
    priceInput.readOnly = newProductInput.value.trim() === '';
    updateTotals();
  });

  newProductInput.addEventListener('input', function () {
    priceInput.readOnly = this.value.trim() === '';
    if (this.value.trim() === '') {
      priceInput.value = products[productSelect.value].price.toFixed(2);
    }
  });
}

// Función para adjuntar el evento de clic al botón de eliminar
function attachDeleteListener(row) {
  const deleteButton = row.querySelector('.delete-row-btn');
  if (deleteButton) {
    deleteButton.addEventListener('click', deleteRow);
  }
}

// Función para eliminar una fila de la tabla
function deleteRow(event) {
  const button = event.target;
  const row = button.closest('tr');
  if (row) {
    row.remove();
    updateTotals();
  }
}

// Función para incrementar el número de factura y guardarlo en localStorage
function incrementarNumeroFactura() {
  facturaNumero += 1;
  numeroFactura.textContent = facturaNumero.toString().padStart(5, '0');
  localStorage.setItem('facturaNumero', facturaNumero);
}

// Función para reducir el número de factura y guardarlo en localStorage
function reducirNumeroFactura() {
  if (facturaNumero > 0) {
    facturaNumero -= 1;
    numeroFactura.textContent = facturaNumero.toString().padStart(5, '0');
    localStorage.setItem('facturaNumero', facturaNumero);
  }
}

// Función para limpiar los campos de la factura actual
function limpiarFactura() {
  document.getElementById('client-id').value = '';
  document.getElementById('client-name').value = '';
  document.getElementById('client-city').value = '';
  document.getElementById('client-street').value = '';
  document.getElementById('client-email').value = '';
  document.getElementById('client-phone').value = '';
  itemRows.innerHTML = ''; 
  addRow();
  updateTotals();
}

// Asignar la función a todos los botones de eliminar existentes al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  itemRows.querySelectorAll('tr').forEach(row => {
    attachInputListeners(row);
    attachDeleteListener(row);
  });
  updateTotals();
});

// Asignar evento click al botón "Agregar fila"
addRowButton.addEventListener('click', addRow);

// Asignar evento click al botón "Enviar factura"
enviarFacturaButton.addEventListener('click', incrementarNumeroFactura);

// Asignar evento click al botón "Reducir factura"
reducirFacturaButton.addEventListener('click', reducirNumeroFactura);

// Asignar evento click al botón "Eliminar factura"
eliminarFacturaButton.addEventListener('click', limpiarFactura);

// Asignar eventos click a los botones "Agregar Producto" y "Modificar Producto"
addProductButton.addEventListener('click', showProductForm);
modifyProductButton.addEventListener('click', showProductForm);

// Asignar evento click al botón "Guardar Producto"
saveProductButton.addEventListener('click', function() {
  if (addProductButton.style.display !== 'none') {
    addProduct();
  } else if (modifyProductButton.style.display !== 'none') {
    modifyProduct();
  }
});

// Función para calcular y actualizar los totales
function updateTotals() {
  let subtotal = 0;
  let discount = 0;
  let taxRate = 15;
  let tax = 0;
  let total = 0;

  const rowInputs = itemRows.querySelectorAll('tr');
  rowInputs.forEach(row => {
    const quantityInput = row.querySelector('.quantity');
    const priceInput = row.querySelector('.price');
    const newProductInput = row.querySelector('.new-product-input');
    const totalInput = row.querySelector('.row-total');

    const quantity = parseFloat(quantityInput.value) || 0;
    const price = newProductInput.value.trim() !== '' ? parseFloat(priceInput.value) || 0 : parseFloat(priceInput.value) || 0;
    const rowTotal = quantity * price;

    totalInput.value = rowTotal.toFixed(2);
    subtotal += rowTotal;
  });

  subtotalValue.textContent = subtotal.toFixed(2);
  discountValue.textContent = discount.toFixed(2);
  taxRateValue.textContent = taxRate;
  tax = subtotal * (taxRate / 100);
  taxValue.textContent = tax.toFixed(2);
  total = subtotal - discount + tax;
  totalValue.textContent = total.toFixed(2);
}
