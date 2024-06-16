// Obtener referencias a los elementos del DOM
const itemRows = document.getElementById('item-rows');
const addRowButton = document.getElementById('add-row');
const deleteRowButton = document.getElementById('delete-row-btn');
const subtotalValue = document.getElementById('subtotal-value');
const discountValue = document.getElementById('discount-value');
const taxRateValue = document.getElementById('tax-rate-value');
const taxValue = document.getElementById('tax-value');
const totalValue = document.getElementById('total-value');

// Validar fecha y hora automaticamente
document.addEventListener("DOMContentLoaded", function () {
  // Obtener la fecha y hora actual
  const now = new Date();

  // Formatear la fecha en el formato YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Formatear la hora en el formato HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // Configurar la fecha y la hora en los campos correspondientes
  document.getElementById('fechaFactura').value = formattedDate;
  document.getElementById('horaFactura').value = formattedTime.slice(0, 5); // solo HH:MM

  // Opcional: Mostrar los segundos en un campo separado
  // document.getElementById('segundosFactura').value = seconds;
});


// Definir productos y precios
const products = {
  "Producto1": { name: "Manzanas", price: 2.00 },
  "Producto2": { name: "Platanos", price: 1.50 },
  "Producto3": { name: "Peras", price: 3.50 },
  "Producto4": { name: "Limas", price: 2.50 },
  "Producto5": { name: "Uvas", price: 4.10 },
  "Producto6": { name: "Kiwis", price: 4.50 },
  "Producto7": { name: "Sandias", price: 1.10 }
};

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
    `;
  itemRows.appendChild(newRow);
  attachInputListeners(newRow);
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

// Función para eliminar una fila de la tabla
function deleteRow(event) {
  const button = event.target;
  const row = itemRows.firstElementChild;
  if (row) {
    row.remove();
    updateTotals();
  }
}

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

// Agregar evento click al botón "Agregar fila"
addRowButton.addEventListener('click', addRow);

// Agregar evento click al botón "Eliminar fila"
deleteRowButton.addEventListener('click', deleteRow);

// Adjuntar los event listeners a las filas existentes
itemRows.querySelectorAll('tr').forEach(attachInputListeners);

// Actualizar los totales al cargar la página
updateTotals();