// Inicializar EmailJS
(function () {
    emailjs.init("-YbO7MjhVJ0lwF7TC"); // Reemplaza "-YbO7MjhVJ0lwF7TC" con tu Public Key
})();

document.addEventListener('DOMContentLoaded', () => {
    // Asignar fecha y hora actual a los campos correspondientes
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    document.getElementById('fechaFactura').value = date;
    document.getElementById('horaFactura').value = time;
    
});

function enviarFactura() {
    // Recopilar datos del formulario
    const numeroFactura = document.getElementById('numeroFactura').textContent;
    const fechaFactura = document.getElementById('fechaFactura').value;
    const horaFactura = document.getElementById('horaFactura').value;
    const clientId = document.getElementById('client-id').value;
    const clientName = document.getElementById('client-name').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientPhone = document.getElementById('client-phone').value;
    const clientPlaca = document.getElementById('client-placa').value;
    const movSelect = document.getElementById('mov-select').value;
    const typeSelect = document.getElementById('type-select').value;
    const price = document.getElementById('price').value;
    const total = document.getElementById('total-value').textContent;

    // Enviar la factura por correo electrónico usando EmailJS
    emailjs.send('service_9q1a4u4', 'template_rv8pgw3', { // Reemplaza 'template_id' con tu Template ID de EmailJS
        numero_factura: numeroFactura,
        fecha_factura: fechaFactura,
        hora_factura: horaFactura,
        client_id: clientId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_placa: clientPlaca,
        mov_select: movSelect,
        type_select: typeSelect,
        price: price,
        total: total
    })
        .then((response) => {
            alert('Factura enviada exitosamente');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al enviar la factura');
        });
}

// Enlace de función al botón de envío
document.getElementById('enviar-factura').addEventListener('click', enviarFactura);