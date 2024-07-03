document.addEventListener('DOMContentLoaded', () => {
  const clientIdInput = document.getElementById('client-id');

  clientIdInput.addEventListener('input', async (event) => {
    const cedula = event.target.value;
    if (cedula.length === 10) {
      await BuscarCliente(cedula);
    }
  });
});

function rellenarInfoCliente(infoCliente) {
  document.getElementById('client-name').value = infoCliente.nombre || '';
  document.getElementById('client-email').value = infoCliente.email || '';
  document.getElementById('client-phone').value = infoCliente.telefono || '';
  document.getElementById('client-placa').value = infoCliente.placa || '';
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
      console.log(data);
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
      console.log(data)
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