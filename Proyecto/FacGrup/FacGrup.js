// Obtener referencias a los elementos del DOM
const itemRows = document.getElementById('item-rows');
const addRowButton = document.getElementById('add-row');
const showTotalButton = document.getElementById('show-total');
const deleteRowButton = document.getElementById('delete-row-btn');
const subtotalValue = document.getElementById('subtotal-value');
const discountValue = document.getElementById('discount-value');
const taxRateValue = document.getElementById('tax-rate-value');
const taxValue = document.getElementById('tax-value');
const totalValue = document.getElementById('total-value');

// Función para agregar una nueva fila a la tabla
function addRow() {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" placeholder="Ingrese la descripción del artículo/servicio"></td>
    <td><input type="number" placeholder="Ingrese la cantidad" min="1" value="1"></td>
    <td><input type="number" placeholder="Ingrese el precio unitario" min="0" step="0.01" value="1.00"></td>
    <td><input type="number" placeholder="Total" min="0" step="0.01" value="1.00" readonly></td>
  `;
  itemRows.appendChild(newRow);
  updateTotals();
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
    const quantityInput = row.querySelector('td:nth-child(2) input');
    const priceInput = row.querySelector('td:nth-child(3) input');
    const totalInput = row.querySelector('td:nth-child(4) input');

    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
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

// Agregar evento click al botón "Mostrar total"
showTotalButton.addEventListener('click', updateTotals);

// Agregar evento click al botón "Eliminar fila"
deleteRowButton.addEventListener('click', deleteRow);

// Actualizar los totales al cargar la página
updateTotals();