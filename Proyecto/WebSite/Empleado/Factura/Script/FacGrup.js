//#region Funciones de Botones etc
//Info de las placas
var placas;
/**
 * Método que obtiene la hora y la fecha de sistema y la coloca en el documento HTML
 * aplica también que la placa se ingrese solo en mayúsculas
 */
document.addEventListener('DOMContentLoaded', () => {
  // Obtener la fecha y hora actuales
  const now = new Date();

  // Formatear la fecha como yyyy-mm-dd
  const date = now.toISOString().split('T')[0];

  // Formatear la hora como hh:mm
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;

  // Asignar la fecha y hora a los campos correspondientes
  document.getElementById('fechaFactura').value = date;
  document.getElementById('horaFactura').value = time;

  // Placa solo como mayúsculas
  document.getElementById('client-placa').addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase();
    if (busquedaPlacaHabilitada) {
      const placa = event.target.value;
      if (placa.length === 6 || placa.length === 7) { // Asumiendo que la placa tiene 7 caracteres
        console.log("Se ejecuta");
        BuscarPlaca(placa);
      }
    }
  });

  // Habilitar/deshabilitar campo de precio basado en movimiento seleccionado
  document.getElementById("mov-select").addEventListener('change', (event) => {
    const mov = event.target.value;
    const precio = document.getElementById("price");

    if (mov === "Cobro") {
      precio.readOnly = true;
      actualizarPrecio(); // Actualizar precio basado en el tipo de vehículo
    } else {
      precio.readOnly = false;
      precio.value = ''; // Limpiar el campo de precio para permitir ingreso manual
      actualizarTotal();
    }
  });

  // Actualizar total cuando cambie el precio
  document.getElementById("price").addEventListener('input', actualizarTotal);

  // Actualizar precio y total cuando cambie el tipo de vehículo
  document.getElementById("type-select").addEventListener('change', () => {
    if (document.getElementById("mov-select").value === "Cobro") {
      actualizarPrecio();
    }
    actualizarTotal();
  });
});

// Función para limpiar los campos de la factura
function limpiarFactura() {
  document.getElementById('client-id').value = '';
  document.getElementById('client-name').value = '';
  document.getElementById('client-email').value = '';
  document.getElementById('client-phone').value = '';
  document.getElementById('client-placa').value = '';
  document.getElementById('mov-select').selectedIndex = 0;
  document.getElementById('type-select').selectedIndex = 0;
  document.getElementById('price').value = '1.00';
  document.getElementById('total-value').textContent = '1.00';
  busquedaCedulaHabilitada = true; // Habilitar búsqueda por cédula
  busquedaPlacaHabilitada = true; // Habilitar búsqueda por placa
  const tipo = document.getElementById('client-placa');
  if (tipo.tagName.toLocaleLowerCase() === "select") {
    const text = document.createElement("input");
    text.type = "text";
    text.id = "client-placa";
    text.placeholder = "Ingrese la placa del cliente";
    tipo.parentNode.replaceChild(text, tipo);
  }
  //Aqui toca reemplazar por el original
}
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById("numeroFactura").innerHTML = await CargarNumFactura();

  document.getElementById('client-id').addEventListener('input', async (event) => {
    const cedula = event.target.value;
    if (cedula.length === 10) {
      await BuscarCliente(cedula);
    }
  });

  document.getElementById("mov-select").addEventListener('change', (event) => {
    const mov = event.target.value;
    const tipo = document.getElementById("type-select");
    if (mov == "Cobro") { tipo.value = "Livianos"; tipo.disabled = false; }
    else { tipo.value = ""; tipo.disabled = true; }
  })

  document.getElementById("type-select").addEventListener('change', (event) => {
    const tipo = event.target.value;
    const precio = document.getElementById("price");
    if (tipo == "Livianos") precio.value = 1;
    else if (tipo == "2 Ejes") precio.value = 2;
    else if (tipo == "3 Ejes") precio.value = 3;
    else if (tipo == "4 Ejes") precio.value = 4;
    else if (tipo == "5 Ejes") precio.value = 5;
    else if (tipo == "6 o más Ejes") precio.value = 6;
    else precio.value = 0.5;
  })
});

// Variables de estado para habilitar/deshabilitar búsquedas
let busquedaCedulaHabilitada = true;
let busquedaPlacaHabilitada = true;

function actualizarPrecio() {
  const tipo = document.getElementById("type-select").value == ''
    ? 'Livianos' : document.getElementById("type-select").value;
  const precio = document.getElementById("price");
  if (document.getElementById("mov-select").value === "Cobro") {
    if (tipo == "Livianos") precio.value = 1;
    else if (tipo == "2 Ejes") precio.value = 2;
    else if (tipo == "3 Ejes") precio.value = 3;
    else if (tipo == "4 Ejes") precio.value = 4;
    else if (tipo == "5 Ejes") precio.value = 5;
    else if (tipo == "6 o más Ejes") precio.value = 6;
    else precio.value = 0.5;
  }
}
function actualizarTotal() {
  const precio = parseFloat(document.getElementById('price').value);
  if (!isNaN(precio) && precio >= 0) {
    document.getElementById('total-value').textContent = precio.toFixed(2);
  } else {
    document.getElementById('total-value').textContent = '0.00';
  }
}

function rellenarInfoPlaca(infoPlaca) {
  console.log(infoPlaca);
  document.getElementById('client-name').value = infoPlaca.nombres || '';
  document.getElementById('client-email').value = infoPlaca.correo || '';
  document.getElementById('client-phone').value = infoPlaca.telefono || '';
  document.getElementById('client-id').value = infoPlaca.cedula || '';
}

//#region Backend
async function CargarNumFactura() {
  token = localStorage.getItem('token');
  try {
    const response = await fetch("/employee/numfacs", {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Es el método para buscar en la base de datos por el uso de la placa by:Adrián
 * @param {String} placa 
 */
async function BuscarPlaca(placa) {
  token = localStorage.getItem('token');
  try {
    const response = await fetch("/employee/search-client?placa=" + placa, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message) window.location.href = "../../Error/PagError404.html";
      rellenarInfoPlaca(data);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function BuscarCliente(cedula) {
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
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function RellenarInfoCliente(infoCliente) {
  document.getElementById("client-name").value = infoCliente.nombres;
  document.getElementById("client-email").value = infoCliente.correo;
  document.getElementById("client-phone").value = infoCliente.telefono;
  const tipo = document.getElementById('client-placa');

  const select = document.createElement("select");
  select.id = "client-placa";

  infoCliente.vehiculos.forEach(vehiculo => {
    const opcion = document.createElement("option");
    opcion.value = vehiculo[0];
    opcion.textContent = vehiculo[0];
    select.appendChild(opcion);
  });

  tipo.parentNode.replaceChild(select, tipo);

  busquedaPlacaHabilitada = false;
}

async function EnviarFactura() {
  const id = document.getElementById("numeroFactura").textContent;
  const movimiento = parseInt(document.getElementById("mov-select").value == "Cobro" ? 0 : 1);
  const placa = document.getElementById("client-placa").value;
  const tipoVehiculo = document.getElementById("type-select").value;
  const precio = parseFloat(document.getElementById("price").value);

  await RealizarTransacción({
    id: id,
    tipoMov: movimiento,
    placa: placa,
    tipoVehiculo: tipoVehiculo,
    precio: movimiento == 0 ? -1 * precio : precio
  })
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
      const resultado = await response.json();
      if (resultado.message != "Transacción Realizada Correctamente")
        alert(resultado.message);
      else window.location.reload();
      return;
    } else {
      alert(resultado.message);
      return;
    }
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}
//#endregion