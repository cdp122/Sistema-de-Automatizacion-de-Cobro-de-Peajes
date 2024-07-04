//#region Funciones de Botones etc
/**
 * Método que obtiene la hora y la fecha de sistema y la coloca en el documento HTML
 * aplica tambien que la placa se ingrese solo en mayusculas
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
  // placa solo como mayusculas
  document.getElementById('client-placa').addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase();
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
    console.log(mov);
    if (mov == "Cobro") { tipo.value = "Livianos"; tipo.disabled = false; }
    else { tipo.value = ""; tipo.disabled = true; }
    console.log(tipo.disabled);
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

function rellenarInfoCliente(infoCliente) {
  document.getElementById('client-name').value = infoCliente.nombre || '';
  document.getElementById('client-email').value = infoCliente.email || '';
  document.getElementById('client-phone').value = infoCliente.telefono || '';
  document.getElementById('client-placa').value = infoCliente.placa || '';
}
function rellenarInfoPlaca(infoPlaca) {
  document.getElementById('client-name').value = infoPlaca.nombre || '';
  document.getElementById('client-email').value = infoPlaca.email || '';
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
 * @param {*} placa 
 */
async function BuscarPlaca(placa) {
  token = localStorage.getItem('token');
  try {
    const response = await fetch("/employee/search-client-by-placa?placa=" + placa, {
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