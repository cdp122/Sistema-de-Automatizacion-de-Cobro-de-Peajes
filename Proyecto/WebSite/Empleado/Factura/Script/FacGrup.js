/**
 * Función principal que se ejecuta una vez que el DOM se ha cargado completamente.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar fecha y hora actual
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

  // Referencias a elementos de la interfaz
  const addProductButton = document.getElementById('add-product');
  const modifyProductButton = document.getElementById('modify-product');
  const deleteProductButton = document.getElementById('delete-product');
  const saveProductButton = document.getElementById('save-product');
  const cancelProductButton = document.getElementById('cancel-product');
  const enviarFacturaButton = document.getElementById('enviar-factura');
  const cedulaClienteInput = document.getElementById('client-id');
  const productForm = document.getElementById('product-form');
  const productSelect = document.getElementById('product-select');
  let currentAction = 'add';
  let invoiceCounter = 1; // Inicializa el contador de facturas

  // Asignar eventos a botones
  addProductButton.addEventListener('click', () => showProductForm('add'));
  modifyProductButton.addEventListener('click', () => showProductForm('modify'));
  deleteProductButton.addEventListener('click', () => showProductForm('delete'));
  saveProductButton.addEventListener('click', saveProduct);
  cancelProductButton.addEventListener('click', () => {
    productForm.style.display = 'none';
  });
  enviarFacturaButton.addEventListener('click', validateAndSendInvoice);

  let db;
  const request = indexedDB.open("FacturacionDB", 2); // Incrementa el número de versión para forzar la actualización

  // Manejar errores de apertura de la base de datos
  request.onerror = function (event) {
    alert("Error al abrir la base de datos: " + event.target.errorCode);
  };

  // Inicializar la base de datos exitosamente
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database initialized successfully");
    loadProductOptions(); // Cargar las opciones de productos al iniciar
    getInvoiceCounter(); // Obtener el contador de facturas
  };

  // Crear almacenes de objetos en la base de datos
  request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("Productos")) {
      const productoStore = db.createObjectStore("Productos", { keyPath: "idProd", autoIncrement: true });
      productoStore.createIndex("NombreProd", "NombreProd", { unique: false });
      productoStore.createIndex("PrecioProd", "PrecioProd", { unique: false });
      productoStore.createIndex("StockProd", "StockProd", { unique: false });
    }

    if (!db.objectStoreNames.contains("Clientes")) {
      const clienteStore = db.createObjectStore("Clientes", { keyPath: "cedula" });
      clienteStore.createIndex("NombreCliente", "NombreCliente", { unique: false });
      clienteStore.createIndex("Ciudad", "Ciudad", { unique: false });
      clienteStore.createIndex("Direccion", "Direccion", { unique: false });
      clienteStore.createIndex("Correo", "Correo", { unique: false });
      clienteStore.createIndex("Telefono", "Telefono", { unique: false });
    }

    if (!db.objectStoreNames.contains("Ventas")) {
      const ventasStore = db.createObjectStore("Ventas", { keyPath: "numFactura", autoIncrement: true });
      ventasStore.createIndex("fechaVent", "fechaVent", { unique: false });
      ventasStore.createIndex("subtotalVent", "subtotalVent", { unique: false });
      ventasStore.createIndex("IvaVent", "IvaVent", { unique: false });
      ventasStore.createIndex("totalVent", "totalVent", { unique: false });
      ventasStore.createIndex("cedulaCliente", "cedulaCliente", { unique: false });
    }

    if (!db.objectStoreNames.contains("Settings")) {
      const settingsStore = db.createObjectStore("Settings", { keyPath: "id" });
      settingsStore.add({ id: "invoiceCounter", value: 1 }); // Inicializa el contador de facturas
    }
  };

  /**
   * Obtiene el contador de facturas desde la base de datos.
   */
  function getInvoiceCounter() {
    const transaction = db.transaction(["Settings"], "readonly");
    const store = transaction.objectStore("Settings");
    const request = store.get("invoiceCounter");

    request.onsuccess = function (event) {
      if (event.target.result) {
        invoiceCounter = event.target.result.value;
      }
    };

    request.onerror = function (event) {
      console.error("Error al obtener el contador de facturas: ", event.target.errorCode);
    };
  }

  /**
   * Incrementa el contador de facturas en la base de datos.
   */
  function incrementInvoiceCounter() {
    invoiceCounter++;
    const transaction = db.transaction(["Settings"], "readwrite");
    const store = transaction.objectStore("Settings");
    store.put({ id: "invoiceCounter", value: invoiceCounter });
  }

  /**
   * Muestra el formulario de productos según la acción seleccionada (agregar, modificar, eliminar).
   * @param {string} action - La acción actual (add, modify, delete).
   */
  function showProductForm(action) {
    currentAction = action;
    productForm.style.display = 'block';

    if (action === 'add') {
      productSelect.style.display = 'none';
      document.getElementById('product-name').style.display = 'block';
      document.getElementById('product-price').style.display = 'block';
      document.getElementById('product-stock').style.display = 'block';
    } else if (action === 'modify') {
      productSelect.style.display = 'block';
      document.getElementById('product-name').style.display = 'none';
      document.getElementById('product-price').style.display = 'block';
      document.getElementById('product-stock').style.display = 'block';
      productSelect.addEventListener('change', loadProductDetails);
    } else if (action === 'delete') {
      productSelect.style.display = 'block';
      document.getElementById('product-name').style.display = 'none';
      document.getElementById('product-price').style.display = 'none';
      document.getElementById('product-stock').style.display = 'none';
    }
  }

  /**
   * Guarda el producto según la acción actual (agregar, modificar, eliminar).
   */
  function saveProduct() {
    if (currentAction === 'add') {
      addProduct();
    } else if (currentAction === 'modify') {
      modifyProduct();
    } else if (currentAction === 'delete') {
      deleteProduct();
    }
  }

  /**
   * Agrega un nuevo producto a la base de datos.
   */
  function addProduct() {
    const nombreProd = document.getElementById('product-name').value;
    const precioProd = parseFloat(document.getElementById('product-price').value);
    const stockProd = parseInt(document.getElementById('product-stock').value);

    const transaction = db.transaction(["Productos"], "readwrite");
    const store = transaction.objectStore("Productos");
    const product = { NombreProd: nombreProd, PrecioProd: precioProd, StockProd: stockProd };
    const requestAdd = store.add(product);

    requestAdd.onsuccess = function () {
      console.log("Producto agregado exitosamente");
      productForm.style.display = 'none';
      clearProductForm();
      loadProductOptions(); // Cargar las opciones de productos después de agregar uno nuevo
    };

    requestAdd.onerror = function (event) {
      console.error("Error al agregar producto: ", event.target.errorCode);
    };
  }

  /**
   * Modifica un producto existente en la base de datos.
   */
  function modifyProduct() {
    const idProd = parseInt(productSelect.value);
    const precioProd = parseFloat(document.getElementById('product-price').value);
    const stockProd = parseInt(document.getElementById('product-stock').value);

    const transaction = db.transaction(["Productos"], "readwrite");
    const store = transaction.objectStore("Productos");
    const request = store.get(idProd);

    request.onsuccess = function (event) {
      const product = event.target.result;
      product.PrecioProd = precioProd;
      product.StockProd = stockProd;

      const requestUpdate = store.put(product);

      requestUpdate.onsuccess = function () {
        console.log("Producto modificado exitosamente");
        productForm.style.display = 'none';
        clearProductForm();
        loadProductOptions(); // Cargar las opciones de productos después de modificar
      };

      requestUpdate.onerror = function (event) {
        console.error("Error al modificar producto: ", event.target.errorCode);
      };
    };

    request.onerror = function (event) {
      console.error("Error al obtener producto: ", event.target.errorCode);
    };
  }

  /**
   * Elimina un producto de la base de datos.
   */
  function deleteProduct() {
    const idProd = parseInt(productSelect.value);

    const transaction = db.transaction(["Productos"], "readwrite");
    const store = transaction.objectStore("Productos");
    const requestDelete = store.delete(idProd);

    requestDelete.onsuccess = function () {
      console.log("Producto eliminado exitosamente");
      productForm.style.display = 'none';
      clearProductForm();
      loadProductOptions(); // Cargar las opciones de productos después de eliminar
    };

    requestDelete.onerror = function (event) {
      console.error("Error al eliminar producto: ", event.target.errorCode);
    };
  }

  /**
   * Limpia el formulario de productos.
   */
  function clearProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    productSelect.removeEventListener('change', loadProductDetails);
  }

  /**
   * Carga los detalles del producto seleccionado en el formulario.
   */
  function loadProductDetails() {
    const idProd = parseInt(productSelect.value);

    if (!isNaN(idProd)) {
      const transaction = db.transaction(["Productos"], "readonly");
      const store = transaction.objectStore("Productos");
      const request = store.get(idProd);

      request.onsuccess = function (event) {
        const product = event.target.result;
        if (product) {
          document.getElementById('product-price').value = product.PrecioProd;
          document.getElementById('product-stock').value = product.StockProd;
        }
      };

      request.onerror = function (event) {
        console.error("Error al obtener detalles del producto: ", event.target.errorCode);
      };
    }
  }

  /**
   * Carga las opciones de productos en los campos select.
   */
  function loadProductOptions() {
    const transaction = db.transaction(["Productos"], "readonly");
    const store = transaction.objectStore("Productos");
    const request = store.getAll();

    request.onsuccess = function (event) {
      const products = event.target.result;
      const options = products.map(product => `<option value="${product.idProd}">${product.NombreProd}</option>`).join('');
      document.querySelectorAll('.product-select').forEach(select => {
        select.innerHTML = '<option value="">Productos</option>' + options;
      });
      productSelect.innerHTML = '<option value="">Seleccione un producto</option>' + options;
    };

    request.onerror = function (event) {
      console.error("Error al cargar opciones de productos: ", event.target.errorCode);
    };
  }

  /**
   * Valida que todos los campos necesarios estén llenos antes de enviar la factura.
   */
  function validateAndSendInvoice() {
    const clientFields = [
      'client-id', 'client-name', 'client-city', 'client-street', 'client-email', 'client-phone'
    ];
    const productFields = document.querySelectorAll('.product-select');
    const quantityFields = document.querySelectorAll('.quantity');

    let allFieldsFilled = true;

    clientFields.forEach(id => {
      if (!document.getElementById(id).value) {
        allFieldsFilled = false;
      }
    });

    productFields.forEach(select => {
      if (!select.value) {
        allFieldsFilled = false;
      }
    });

    quantityFields.forEach(input => {
      if (!input.value || input.value <= 0) {
        allFieldsFilled = false;
      }
    });

    if (allFieldsFilled) {
      enviarFactura();
    } else {
      alert('Por favor, complete todos los campos antes de enviar la factura.');
    }
  }

  /**
   * Guarda los datos del cliente y la venta en la base de datos y actualiza el contador de facturas.
   */
  function enviarFactura() {
    const cliente = {
      cedula: document.getElementById('client-id').value,
      NombreCliente: document.getElementById('client-name').value,
      Ciudad: document.getElementById('client-city').value,
      Direccion: document.getElementById('client-street').value,
      Correo: document.getElementById('client-email').value,
      Telefono: document.getElementById('client-phone').value
    };

    const transaction = db.transaction(["Clientes", "Ventas"], "readwrite");
    const clienteStore = transaction.objectStore("Clientes");
    const ventasStore = transaction.objectStore("Ventas");

    // Verificar si el cliente ya existe en la base de datos
    const requestCheckCliente = clienteStore.get(cliente.cedula);

    requestCheckCliente.onsuccess = function (event) {
      const existingClient = event.target.result;

      if (!existingClient) {
        // Si el cliente no existe, agregarlo a la base de datos
        const requestAddCliente = clienteStore.add(cliente);

        requestAddCliente.onsuccess = function () {
          console.log("Cliente agregado exitosamente");
          addVenta(cliente.cedula);
        };

        requestAddCliente.onerror = function (event) {
          console.error("Error al agregar cliente: ", event.target.errorCode);
        };
      } else {
        // Si el cliente ya existe, solo agregar la venta
        addVenta(cliente.cedula);
      }
    };

    requestCheckCliente.onerror = function (event) {
      console.error("Error al verificar existencia del cliente: ", event.target.errorCode);
    };
  }

  /**
   * Agrega una nueva venta a la base de datos.
   * @param {string} cedula - La cédula del cliente asociado a la venta.
   */
  function addVenta(cedula) {
    const venta = {
      numFactura: invoiceCounter,
      fechaVent: document.getElementById('fechaFactura').value,
      subtotalVent: parseFloat(document.getElementById('subtotal-value').innerText),
      IvaVent: parseFloat(document.getElementById('tax-value').innerText),
      totalVent: parseFloat(document.getElementById('total-value').innerText),
      cedulaCliente: cedula
    };

    const transaction = db.transaction(["Ventas"], "readwrite");
    const ventasStore = transaction.objectStore("Ventas");
    const requestAddVenta = ventasStore.add(venta);

    requestAddVenta.onsuccess = function () {
      console.log("Venta agregada exitosamente");
      incrementInvoiceCounter(); // Incrementar el contador de facturas después de agregar una venta
      document.getElementById('numeroFactura').innerText = String(invoiceCounter).padStart(5, '0'); // Actualizar el número de factura en la UI
    };

    requestAddVenta.onerror = function (event) {
      console.error("Error al agregar venta: ", event.target.errorCode);
    };
  }

  // Agregar eventos para los botones de agregar fila y eliminar factura
  document.getElementById('add-row').addEventListener('click', addRow);
  document.getElementById('eliminar-factura').addEventListener('click', limpiarFactura);

  const itemRows = document.getElementById('item-rows');

  /**
   * Agrega una nueva fila de productos a la factura.
   */
  function addRow() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
          <td>
              <select class="product-select">
                  <option value="">Productos</option>
              </select>
          </td>
          <td><input type="text" placeholder="Nuevo Producto" class="new-product-input" readonly></td>
          <td><input type="number" placeholder="Ingrese la cantidad" min="1" value="1" class="quantity"></td>
          <td><input type="number" placeholder="Precio unitario" min="0" step="0.01" value="0.00" class="price" readonly></td>
          <td><input type="number" placeholder="Total" min="0" step="0.01" value="0.00" readonly class="row-total"></td>
          <td><button class="delete-row-btn">Eliminar fila</button></td>
      `;
    itemRows.appendChild(newRow);
    attachInputListeners(newRow);
    attachDeleteListener(newRow);
    loadProductOptions(); // Cargar las opciones de productos para la nueva fila
    updateTotals();
  }

  /**
   * Limpia los campos de la factura y reinicia la tabla de productos.
   */
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

  /**
   * Asigna listeners de entrada a una fila para actualizar el precio y total automáticamente.
   * @param {HTMLElement} row - La fila a la que se le asignarán los listeners.
   */
  function attachInputListeners(row) {
    const selectInput = row.querySelector('.product-select');
    const quantityInput = row.querySelector('.quantity');
    selectInput.addEventListener('change', function () {
      const productId = selectInput.value;
      if (productId) {
        const transaction = db.transaction(["Productos"], "readonly");
        const store = transaction.objectStore("Productos");
        const request = store.get(parseInt(productId));

        request.onsuccess = function (event) {
          const product = event.target.result;
          const priceInput = row.querySelector('.price');
          const detailInput = row.querySelector('.new-product-input');
          priceInput.value = product.PrecioProd;
          detailInput.value = product.NombreProd;
          updateRowTotal(row);
          updateTotals();
        };

        request.onerror = function (event) {
          console.error("Error al obtener producto: ", event.target.errorCode);
        };
      } else {
        row.querySelector('.price').value = "0.00";
        row.querySelector('.new-product-input').value = "";
        updateRowTotal(row);
        updateTotals();
      }
    });
    quantityInput.addEventListener('input', function () {
      updateRowTotal(row);
      updateTotals();
    });
  }

  /**
   * Asigna un listener para eliminar una fila de la factura.
   * @param {HTMLElement} row - La fila a la que se le asignará el listener de eliminación.
   */
  function attachDeleteListener(row) {
    const deleteButton = row.querySelector('.delete-row-btn');
    deleteButton.addEventListener('click', function () {
      row.remove();
      updateTotals();
    });
  }

  /**
   * Actualiza el total de una fila según la cantidad y el precio unitario.
   * @param {HTMLElement} row - La fila a actualizar.
   */
  function updateRowTotal(row) {
    const quantity = row.querySelector('.quantity').value;
    const price = row.querySelector('.price').value;
    const total = quantity * price;
    row.querySelector('.row-total').value = total.toFixed(2);
  }

  /**
   * Actualiza los totales de la factura (subtotal, IVA y total).
   */
  function updateTotals() {
    let subtotal = 0;
    itemRows.querySelectorAll('tr').forEach(row => {
      const total = parseFloat(row.querySelector('.row-total').value);
      subtotal += total;
    });
    const taxRate = parseFloat(document.getElementById('tax-rate-value').innerText) / 100;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    document.getElementById('subtotal-value').innerText = subtotal.toFixed(2);
    document.getElementById('tax-value').innerText = tax.toFixed(2);
    document.getElementById('total-value').innerText = total.toFixed(2);
  }

  // Escuchar cambios en el campo de cédula del cliente
  cedulaClienteInput.addEventListener('input', function () {
    if (cedulaClienteInput.value.length === 10) {
      loadClientDetails(cedulaClienteInput.value);
    }
  });

  /**
   * Carga los detalles del cliente desde la base de datos según su cédula.
   * @param {string} cedula - La cédula del cliente.
   */
  function loadClientDetails(cedula) {
    const transaction = db.transaction(["Clientes"], "readonly");
    const store = transaction.objectStore("Clientes");
    const request = store.get(cedula);

    request.onsuccess = function (event) {
      const client = event.target.result;
      if (client) {
        document.getElementById('client-name').value = client.NombreCliente;
        document.getElementById('client-city').value = client.Ciudad;
        document.getElementById('client-street').value = client.Direccion;
        document.getElementById('client-email').value = client.Correo;
        document.getElementById('client-phone').value = client.Telefono;
      }
    };

    request.onerror = function (event) {
      console.error("Error al obtener detalles del cliente: ", event.target.errorCode);
    };
  }

  // Adjuntar listeners para la fila inicial
  attachInputListeners(document.querySelector('#item-rows tr'));
});

//#region Backend
async function BuscarCliente() {
  const cedula = ""; //Aqui va la cédula. 
  token = localStorage.getItem('token');
  try {
    const response = await fetch("/employee/search-client?cedula=" + cedula, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message) window.location.href = "../../Error/PagError404.html";
      RellenarInfoCliente(data);
      console.log(data);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function RellenarInfoCliente(infoCliente) {
  //infoCliente es un arreglo de toda la información recibida en json. 

}

async function RealizarTransacción(infoTransacción) {
  token = localStorage.getItem('token');
  try {
    const response = await fetch("/employee/payment", {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(infoTransacción)
    });
    if (response.ok) {
      alert("Datos actualizados se cerrará la sesión para que los cambios se apliquen correctamente");
      window.location.href = "../../LogIn/html/Login.html";
    } else {
      alert(result.message);
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
  return false;
}
//#endregion