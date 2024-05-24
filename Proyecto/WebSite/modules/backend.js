//Este es un módulo para servir a todo el frontend

//#region Variables
var url;
var urlEncodedQueries;
//#endregion

/**
 * Función que solicita datos al Backend. 
 * @param {String} id_url String de la dirección a la que se solicitan los datos.
 * @param {String[] | String} params Debe de cumplir con la estructura ["primerParametro", "SegundoParametro",...]
 * @param {string[][] | string[]} queries Debe de cumplir con la estructura [["nombreParametro", "parametro"],...]
 * @returns un objeto tipo Json con los datos. 
 */
export async function GetJson(id_url, params, queries) {
    url = "";
    url = await CrearUrl(id_url, params, queries);

    try {
        const response = await fetch(url, { method: 'GET', });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            alert('No se encontró ' + url);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Función que solicita ir a una página al Backend. 
 * @param {String} id_url String de la dirección a la que se solicitan los datos.
 * @param {String[] | String} params Debe de cumplir con la estructura ["primerParametro", "SegundoParametro",...]
 * @param {string[][] | string[]} queries Debe de cumplir con la estructura [["nombreParametro", "parametro"],...]
 * @param {string} pag Dirección relativa hacia donde se encuentrá la página
 */
export async function GetPage(id_url, params, queries, pag) {
    url = "";
    url = await CrearUrl(id_url, params, queries);

    try {
        const response = await fetch(url, { method: 'GET', });
        if (response.ok) {
            window.location.href = pag;
        } else {
            alert('No se encontró ' + url);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function CrearUrl(id_url, params, queries) {
    url = "";
    urlEncodedQueries = new URLSearchParams();

    //Se comprueba que la id estén correctamente enviados
    if (!(typeof id_url == "string")) {
        console.error("El parámetro id_url de Backend.Get no es de tipo String");
        return null;
    }
    else {
        url += "/" + id_url.toLowerCase();
    }

    if (Array.isArray(params)) {
        url += "/";
        var param = "";
        for (let i = 0; i < params.length; i++)
            param += encodeURIComponent(params[i].toLowerCase()) + "/";
        url += param.substring(0, param.length - 1);
    }
    else if (typeof params == "string" && params != "") url += "/" + params.toLowerCase();
    else if (typeof params == "string" && params == "");
    else {
        console.error("No sé que me pasaste, el tipo fue: ", typeof params, "se esperaba string o string[]")
        return null;
    }

    //Se comprueba que queries estén correctamente enviados
    if (Array.isArray(queries)) {
        url += "?";
        if (queries.every(q => Array.isArray(q) && q.length === 2 && typeof q[0] === "string" && typeof q[1] === "string")) {
            queries.forEach(([key, value]) => urlEncodedQueries.append(key.toLowerCase(), value.toLowerCase()));
        } else if (queries.length === 2 && typeof queries[0] === "string" && typeof queries[1] === "string") {
            urlEncodedQueries.append(queries[0].toLowerCase(), queries[1].toLowerCase());
        } else {
            console.error("El formato de queries debe ser string[][] o string[]");
            return null;
        }
        url += urlEncodedQueries.toString();
    } else {
        console.error("El tipo de queries debe ser string[][] o string[]");
        return null;
    }

    console.log("redirigiendo a:", url);
    return url;
}