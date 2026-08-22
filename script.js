// ============================================
// MAPEO HEXADECIMAL
// ============================================

const simbolos = "0123456789ABCDEF";


// ============================================
// VALIDACIÓN DE CARACTERES
// ============================================

function valorCaracter(caracter) {

    caracter = caracter.toUpperCase();

    for (let i = 0; i < simbolos.length; i++) {

        if (simbolos[i] === caracter) {
            return i;
        }
    }

    return -1;
}


function validarNumero(numero, base) {

    if (numero.length === 0) {
        return false;
    }

    for (let i = 0; i < numero.length; i++) {

        const valor = valorCaracter(numero[i]);

        if (valor < 0 || valor >= base) {
            return false;
        }
    }

    return true;
}


// ============================================
// CUALQUIER BASE → BASE 10
// MULTIPLICACIÓN POSICIONAL
// ============================================

function convertirADecimal(numero, base) {

    let resultado = 0;

    for (let i = 0; i < numero.length; i++) {

        const digito = valorCaracter(numero[i]);

        resultado = resultado * base + digito;
    }

    return resultado;
}


// ============================================
// BASE 10 → CUALQUIER BASE
// DIVISIONES SUCESIVAS
// ============================================

function convertirDesdeDecimal(numero, base) {

    if (numero === 0) {
        return "0";
    }

    let residuos = [];
    let valor = numero;

    while (valor > 0) {

        const residuo = valor % base;

        residuos.push(simbolos[residuo]);

        valor = Math.floor(valor / base);
    }

    let resultado = "";

    for (let i = residuos.length - 1; i >= 0; i--) {
        resultado += residuos[i];
    }

    return resultado;
}


// ============================================
// PADDING BINARIO
// ============================================

function aplicarPaddingBinario(binario, bits) {

    while (binario.length < bits) {
        binario = "0" + binario;
    }

    return binario;
}


// ============================================
// VALIDACIÓN DE ARQUITECTURA
// ============================================

function validarArquitectura(valor, bits) {

    const maximo = Math.pow(2, bits) - 1;

    return valor <= maximo;
}


// ============================================
// CONVERSIÓN PRINCIPAL
// ============================================

function convertir() {

    const entrada = document.getElementById("numero").value
        .trim()
        .toUpperCase();

    const base = Number(document.getElementById("base").value);

    const bits = Number(document.getElementById("bits").value);

    const mensaje = document.getElementById("mensaje");


    // Limpiar resultados

    document.getElementById("resultadoBinario").value = "";
    document.getElementById("resultadoOctal").value = "";
    document.getElementById("resultadoDecimal").value = "";
    document.getElementById("resultadoHexadecimal").value = "";

    mensaje.textContent = "";
    mensaje.style.background = "";


    // Validar entrada

    if (!validarNumero(entrada, base)) {

        mensaje.textContent =
            "Error: el número no es válido para la base seleccionada.";

        mensaje.style.background = "#fee2e2";
        mensaje.style.color = "#991b1b";

        return;
    }


    // Convertir a decimal

    const decimal = convertirADecimal(entrada, base);


    // Validar arquitectura

    if (!validarArquitectura(decimal, bits)) {

        const maximo = Math.pow(2, bits) - 1;

        mensaje.textContent =
            `Overflow / Desbordamiento de Registro. ` +
            `El valor máximo para ${bits} bits es ${maximo}.`;

        mensaje.style.background = "#fee2e2";
        mensaje.style.color = "#991b1b";

        return;
    }


    // Conversión a las demás bases

    const binario = convertirDesdeDecimal(decimal, 2);

    const octal = convertirDesdeDecimal(decimal, 8);

    const hexadecimal = convertirDesdeDecimal(decimal, 16);


    // Aplicar padding al binario

    const binarioConPadding =
        aplicarPaddingBinario(binario, bits);


    // Mostrar resultados

    document.getElementById("resultadoBinario").value =
        binarioConPadding;

    document.getElementById("resultadoOctal").value =
        octal;

    document.getElementById("resultadoDecimal").value =
        decimal;

    document.getElementById("resultadoHexadecimal").value =
        hexadecimal;


    mensaje.textContent =
        `Conversión realizada correctamente para arquitectura de ${bits} bits.`;

    mensaje.style.background = "#dcfce7";
    mensaje.style.color = "#166534";
}


// ============================================
// EVENTO DEL BOTÓN
// ============================================

document
    .getElementById("convertir")
    .addEventListener("click", convertir);


// ============================================
// ALU - OPERACIONES BIT A BIT
// ============================================

function validarBinario(numero) {

    if (numero.length === 0) {
        return false;
    }

    for (let i = 0; i < numero.length; i++) {

        if (numero[i] !== "0" && numero[i] !== "1") {
            return false;
        }
    }

    return true;
}


function ajustarLongitudes(a, b) {

    const longitud = Math.max(a.length, b.length);

    while (a.length < longitud) {
        a = "0" + a;
    }

    while (b.length < longitud) {
        b = "0" + b;
    }

    return [a, b];
}


function operacionALU(tipo) {

    let a = document
        .getElementById("binarioA")
        .value
        .trim();

    let b = document
        .getElementById("binarioB")
        .value
        .trim();


    if (!validarBinario(a) || !validarBinario(b)) {

        document.getElementById("resultadoALU").value =
            "Error: solo se permiten valores binarios.";

        return;
    }


    [a, b] = ajustarLongitudes(a, b);


    let resultado = "";


    for (let i = 0; i < a.length; i++) {

        const bitA = a[i];
        const bitB = b[i];


        if (tipo === "AND") {

            if (bitA === "1" && bitB === "1") {
                resultado += "1";
            } else {
                resultado += "0";
            }

        }


        else if (tipo === "OR") {

            if (bitA === "1" || bitB === "1") {
                resultado += "1";
            } else {
                resultado += "0";
            }

        }


        else if (tipo === "XOR") {

            if (bitA !== bitB) {
                resultado += "1";
            } else {
                resultado += "0";
            }
        }
    }


    document.getElementById("resultadoALU").value = resultado;
}