class Usuario {
    constructor() {
    }

    Crear(data) {
        this.id = data[0].id;
        this.nombres = data[0].nombre;
        this.apellidos = data[0].apellido;
        this.cedula = data[0].cedula;
        this.telefono = data[0].telefono;
        this.fechaNac = JSON.stringify(data[0].fecha_nacimiento).slice(1, 11);
    }
}

class Tarjeta {
    constructor(id, saldo, estado) {
        this.id = id;
        this.saldo = parseFloat(saldo);
        this.estado = estado;
    }
}

class Vehiculo {
    constructor(tarjeta, placa, modelo, color, tipo) {
        this.tarjeta = tarjeta;
        this.placa = placa;
        this.modelo = modelo;
        this.color = color;
        this.tipo = tipo;
    }
}

class Cliente extends Usuario {
    Crear(usuario, cliente, tarjetas) {
        super.Crear(usuario);
        this.correo = cliente[0].correo;
        this.contraseña = cliente[0].contraseña;
        this.tarjetas = [];
        this.vehiculos = [];

        this.AgregarTarjeta(tarjetas);
        this.saldoTotal = 0.0;
        tarjetas.forEach(tarjeta => {
            this.saldoTotal += tarjeta.saldo;
        });
    }

    AgregarTarjeta(tarjetas) {
        try {
            tarjetas.forEach(tarjeta => {
                this.tarjetas.push(new Tarjeta(tarjeta.tarjeta, tarjeta.saldo, tarjeta.estado));
            });
        }
        catch { console.error("Posiblemente no se entregaron datos de tarjetas para", this.nombres) };
    }

    AgregarVehiculo(vehiculo) {
        this.vehiculos.push(new Vehiculo(vehiculo.tarjetaVeh, vehiculo.placa, vehiculo.modelo, vehiculo.color, vehiculo.tipo));
    }
}

class Empleado extends Usuario {

}

module.exports = { Usuario, Cliente };