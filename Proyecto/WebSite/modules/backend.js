//Este es un módulo para servir a todo el frontend

/**
 * Función que solicita datos al Backend. 
 * @param {String} id_url String de la dirección a la que se solicitan los datos.
 * @param {String[]} params Debe de cumplir con la estructura {{ "nombreParametro", "parametro"},...};
 * @param {String[]} queries Debe de cumplir con la estructura {{ "nombreParametro", "parametro"},...};
 * @param {} datos 
 * @returns un objeto tipo Json con los datos. 
 */
export async function Get(id_url, params, queries, datos) {
    console.log(id_url, typeof id_url, id_url instanceof String);
    console.log(params, typeof params);
    console.log(queries, typeof queries);

    if (!(id_url instanceof String)) {
        console.error("El parámetro id_url de Backend.Get no es de tipo String");
        return null;
    }
    if (params != "" && !(params[0, 0] instanceof String) && !(params[0, 1] instanceof String)) {
        console.error("El arreglo de parámetros no está bien contruido de Backend.Get");
        return null;
    }
    if (params != "" && !(queries[0, 0] instanceof String) && !(queries[0, 1] instanceof String)) {
        console.error("El arreglo de queries no está bien contruido de Backend.Get");
        return null;
    }

    // try {
    //     const response = await fetch('/' + urlEncodedParams, {
    //         method: 'GET',
    //     });
    //     if (response.ok) {
    //         window.location.href = "./bdd.html"
    //     } else {
    //         alert('Error al buscar el registro');
    //     }
    // } catch (error) {
    //     console.error('Error:', error);
    // }
}