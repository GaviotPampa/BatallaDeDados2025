import Jugador from "./classes/jugador.js";
import Partida from "./classes/partida.js";
import Dado from "./classes/dado.js";

let partida = null;
//let sesionActiva = localStorage.getItem("sesionActiva") === "true";

// =========================
// BLOQUE DE control GLOBAL
// =========================
const estoyEnIndex = window.location.pathname.includes("index.html");

// Si estoy en INDEX y no hay jugadores → deshabilitar enlace
if (estoyEnIndex) {
    const existeNombre1 = localStorage.getItem("nombreJ1");
    const existeNombre2 = localStorage.getItem("nombreJ2");

    const enlaceBatalla = document.getElementById("enlace-volverBatalla");
    if (enlaceBatalla) {
        if (!existeNombre1 || !existeNombre2) {
            enlaceBatalla.classList.add("disabled");
            enlaceBatalla.style.pointerEvents = "none";
            enlaceBatalla.style.opacity = "0.5";
            enlaceBatalla.setAttribute("aria-disabled", "true");
            console.log(" Enlace Volver a jugar deshabilitado: no hay jugadores cargados");
        } else {
            console.log("✔ Enlace habilitado: jugadores encontrados");
        }
    }

}

// =====================
// LOCALSTORAGE
// =====================
const CLAVE = "batalla-dados-estado";

export function guardarEstado(partida) {
    //console.log("Intentando guardar estado...", partida, sesionActiva);

   /* if (!sesionActiva){
     console.log(" No se guarda porque la sesión está cerrada");
     return;  */// si se cerró sesión, no guardes
  // }
     console.log(" Guardando estado correctamente");

  if (!partida || partida.terminada) return; // si no hay partida o ya terminó, no guardar
  const datos = {
    jugador1: partida.jugador1,
    jugador2: partida.jugador2,
    turno: partida.turno,
    objetivo: partida.objetivo,
    terminada: partida.terminada,
  };
  localStorage.setItem(CLAVE, JSON.stringify(datos));
}
//recuperar de localStoragela partida guardada
function cargarEstado() {
  const json = localStorage.getItem(CLAVE);
  if (!json) return null;

  const datos = JSON.parse(json);

  const j1 = new Jugador(datos.jugador1.nombre);
  j1.puntos = datos.jugador1.puntos;
  j1.tiradas = Array.isArray(datos.jugador1.tiradas)
    ? datos.jugador1.tiradas
    : [];

  j1.rondasGanadas = datos.jugador1.rondasGanadas;

  const j2 = new Jugador(datos.jugador2.nombre);
  j2.puntos = datos.jugador2.puntos;
  j2.tiradas = Array.isArray(datos.jugador2.tiradas)
    ? datos.jugador2.tiradas
    : [];
  j2.rondasGanadas = datos.jugador2.rondasGanadas;

  const partida = new Partida(j1, j2);
  partida.turno = datos.turno;
  partida.objetivo = datos.objetivo;
  partida.terminada = datos.terminada || false;

  return partida;
}


// =====================
//     BATALLA html
// =====================

function actualizarPantalla(partida) {
 
  //  --CARD jugador 1---
  const nj1 = document.getElementById("nombre-j1"); // nombre
  const pj1 = document.getElementById("puntos-j1");  // VALOR DEL DADO
  const rj1 = document.getElementById("rondas-j1"); // RONDA
 // Mostrar las tiradas de cada jugador
  const tJ1 = document.getElementById("tiradas-j1");

  if (nj1) nj1.textContent = partida.jugador1.nombre;
  if (pj1) pj1.textContent = partida.jugador1.puntos;
  if (rj1) rj1.textContent = partida.jugador1.rondasGanadas;
  //if (tJ1) tJ1.textContent = partida.jugador1.tiradas;
  //if (tJ1) tJ1.textContent = `🎲 : ${partida.jugador1.tiradas.join(", ") || "–"}`;

  const puntosTotalesJ1 = document.getElementById("totalJugador1");
  if (puntosTotalesJ1)
    puntosTotalesJ1.textContent = `Puntos totales de partida: ${partida.jugador1.totalPuntos}`;
  
  // ⭐ mostrar estrellas (uno por ronda)
  const sj1 = document.getElementById("stars-j1");
  if (sj1) sj1.textContent = "⭐".repeat(partida.jugador1.rondasGanadas);

  // ----CARD jugador 2-----
  const nj2 = document.getElementById("nombre-j2");
  const pj2 = document.getElementById("puntos-j2");
  const rj2 = document.getElementById("rondas-j2");
  const tj2 = document.getElementById("tiradas-j2");

  if (nj2) nj2.textContent = partida.jugador2.nombre;
  if (pj2) pj2.textContent = partida.jugador2.puntos;
  if (rj2) rj2.textContent = partida.jugador2.rondasGanadas;
  //if (tj2) tj2.textContent = partida.jugador2.tiradas;

  const puntosTotalesJ2 = document.getElementById("totalJugador2");
  if (puntosTotalesJ2)
    puntosTotalesJ2.textContent = `Puntos totales de partida: ${partida.jugador2.totalPuntos}`;

  const sj2 = document.getElementById("stars-j2");
  if (sj2) sj2.textContent = "⭐".repeat(partida.jugador2.rondasGanadas);
   
  if (tJ1 && pj1) {
  if (partida.jugador1.tiradas.length > 0) {
    const numTiradaJ1 = partida.jugador1.tiradas.length;
    const ultimaJ1 = partida.jugador1.tiradas[numTiradaJ1 - 1];
    tJ1.textContent = `🪁  ${numTiradaJ1} `;
    pj1.textContent = `🎲 : ${ultimaJ1}`;
  } else {
    tJ1.textContent = "🎲 Aún no tiró.";
  }
}

if (tj2 && pj2) {
  if (partida.jugador2.tiradas.length > 0) {
    const numTiradaJ2 = partida.jugador2.tiradas.length;
    const ultimaJ2 = partida.jugador2.tiradas[numTiradaJ2 - 1];
    tj2.textContent = `🪁   ${numTiradaJ2}`;
    pj2.textContent = `🎲  : ${ultimaJ2}`;
  } else {
    tj2.textContent = "🎲 Aún no tiró.";
  }
}
  //  actualizar historial en pantalla
  actualizarHistorial(partida);

}

  // ------HISTORIAL DE RONDAS-------
function actualizarHistorial(partida) {
  const lista = document.getElementById("lista-historial");
  if (!lista) return;

  lista.innerHTML = ""; // limpio para no duplicar

  // Si no hay historial, muestro mensaje
  if (!Array.isArray(partida.historial) || partida.historial.length === 1) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = "Aún no hay rondas jugadas.";
    lista.appendChild(li);
    return;
  }
  partida.historial.forEach((ronda, index) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    li.innerHTML = `
      <strong>Ronda ${ronda.ronda}</strong>
      <br>
       ${partida.jugador1.nombre}: 
       <span class="text-primary"> Numero de Dado ${ronda.jugador1} / </span> 
       <br>
       ${partida.jugador2.nombre}: <span class="text-danger">Numero de Dado ${ronda.jugador2} </span>
    `;

    lista.appendChild(li);
  });
}

// --MOSTRAR MSJS EN BATALLA
export function mostrarMensaje(texto) {
  const el = document.getElementById("mensaje-ronda");
  if (el) {
    el.textContent = texto;
  /*   setTimeout(() => {
  el.style.display = "none";
},3000); */
  } else {
    console.log(texto);
  }
}

// =====================
//      MAIN
// =====================

document.addEventListener("DOMContentLoaded", function () {


///=======INICIO LOGICA FORMULARIO===========/
   // 1) si estoy en la página de inicio (index.html) y hay form
  const form = document.getElementById("form-jugadores");
  if (form) {
    //codigo submit de formulario
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const n1 = document.getElementById("nombre1").value.trim();
      const n2 = document.getElementById("nombre2").value.trim();

      if (n1 === "" || n2 === "") {
        alert("Los dos nombres son obligatorios");
        return;
      }

      const j1 = new Jugador(n1);
      const j2 = new Jugador(n2);
      const partida = new Partida(j1, j2);

      guardarEstado(partida);

      localStorage.setItem("nombreJ1", n1);
      localStorage.setItem("nombreJ2", n2);

      window.location.href = "batalla.html";
    });

    // no sigo, porque en index no hay dado
    return;
  }
  ///=======FIN  LOGICA  FORMULARIO================/


///=======INICIO  LOGICA  BOTON TIRAR==========/
//botón “Lanzar”  ejecuta este recorrido: 
// FLUJO: app.js → partida.tirar() → dado.lanzar()

// Obtenemos  elementos del DOM-deben ir adentro de lDOMContentLoaded , ya que estos elementos todavía no existen en el HTML cuando se carga el script.

//instanciar dado para usarlo en la partida
const dado = new Dado("dado-imagen");
// si estoy en batalla.html (hay dado)
const imagenDado = document.getElementById("dado-imagen");
const btnLanzar = document.getElementById("boton-tirar");
const resultado = document.getElementById("resultado-ronda");
const contador = document.getElementById("contador-tiradas");
const mensajeTurno = document.getElementById("mensajeTurno");

 let contadorTiradas = 0;

 //buscamos recuperar la partida guardada
  partida = cargarEstado();
  
  if (!partida) {
    const nombre1 = localStorage.getItem("nombreJ1") || "Jugador 1";
    const nombre2 = localStorage.getItem("nombreJ2") || "Jugador 2";

    const j1 = new Jugador(nombre1);
    const j2 = new Jugador(nombre2);

    partida = new Partida(j1, j2);
    guardarEstado(partida);
  }

  //inicializar pantalla
  actualizarPantalla(partida);
  actualizarHistorial(partida);
/*   if (mensajeTurno)mensajeTurno.textContent = `Turno de ${partida.jugador1.nombre}`;
 */
if(btnLanzar){
btnLanzar.addEventListener("click", () => {

   // si ya terminó, no dejo seguir
      if (partida.terminada) {
        mostrarMensaje("La partida ya terminó 🔚");
        return;
      }

  const valor = partida.tirar(dado);
  
  //Obtener y Actualizar la imagen correspondiente al resultado del dado
   if (!imagenDado) imagenDado.src = dado.obtenerImagen(valor);
  //console.log("resultado real del dado al lanzar", valor);

;
 // Saber quién tiró
   const jugadorActual =
   partida.turno === 1 ? partida.jugador2 : partida.jugador1;
   jugadorActual.tiradas.push(valor);
   // Actualizar indicador de turno en pantalla
    mensajeTurno.textContent = `Turno de 💛 ${jugadorActual.nombre}`;
    
   if (valor !== undefined) {
    //resultado.textContent = `🎲 Salió ${valor}`;
    resultado.textContent = (`🎲 ${partida.turno === 1 ? partida.jugador2.nombre : partida.jugador1.nombre} sacó un ${valor}`);
    actualizarPantalla(partida);
    actualizarHistorial(partida);
  }

  contadorTiradas++;
   if (contador) contador.textContent = `🎰 Tiradas: ${contadorTiradas}`;


  const ganador = partida.ganadorFinal();
      if (ganador) {
        partida.terminada = true;
        mostrarMensaje("🎉 " + ganador.nombre + " ganó la partida");
        guardarEstado(partida);

        //deshabilitar boton Lanzar
        btnLanzar.disabled = true;
        btnLanzar.classList.add("dosabled");
  
        if (typeof confetti === "function") {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        }

        return;
      }
      // Mostrar turno siguiente
      const siguiente = partida.turno === 1 ? partida.jugador1 : partida.jugador2;
   /*    if (mensajeTurno) mensajeTurno.textContent = `Turno de ${siguiente.nombre}`; */

  });


///=======FIN  LOGICA  BOTON TIRRAR================/

///=======Inicio LOGICA BTN INICIAR SESION=========/
// Obtenemos el elemento del DOM
  const btnReiniciar = document.getElementById("btn-reiniciar");
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      // Reiniciar jugadores
      partida.jugador1.puntos = 0;
      partida.jugador2.puntos = 0;

      partida.jugador1.ultimaTirada = null;
      partida.jugador2.ultimaTirada = null;

      // Limpiar tiradas de cada jugador
      partida.jugador1.tiradas = [];
      partida.jugador2.tiradas = [];

      partida.jugador1.totalPuntos = 0;
      partida.jugador2.totalPuntos = 0;

      partida.jugador1.rondasGanadas = 0;
      partida.jugador2.rondasGanadas = 0;

      // Reiniciar partida
   
      partida.tiradas = 0;
      partida.turno = 1;
      partida.numRonda = 1;
      partida.historial = [];
      partida.terminada = false;

     
      // Limpiar pantalla
      // Limpiar los textos de tiradas y puntos actuales
      document.getElementById("tiradas-j1").textContent = "🎲 Aún no tiró.";
      document.getElementById("tiradas-j2").textContent = "🎲 Aún no tiró.";

      document.getElementById("puntos-j1").textContent = "0";
      document.getElementById("puntos-j2").textContent = "0";

      document.getElementById("lista-historial").innerHTML = ""; //limpia el historial
      document.getElementById("resultado-ronda").textContent = "";
      document.getElementById("mensaje-ronda").textContent = ""; //limpia mensaje del ganador
      document.getElementById("mensajeTurno").textContent =
        "Turno del jugador 1"; //vuelve al turno por default
      
      document.getElementById("contador-tiradas").textContent = "";

      document.getElementById("dado-imagen").src = "assets/imgsDados/dado1.png"; // Limpia la imagen del dado

      // Volver a habilitar botón de tirar
      btnLanzar.disabled = false;

      console.log(" Partida reiniciada correctamente");

      actualizarPantalla(partida); // restablece la info de la pantalla

      //guardarEstado(partida);

    });
  }
///=======FIN LOGICA BTN REINICIAR SESION=========/


///=======Inicio LOGICA BTN CERRAR SESION=========/
// Obtenemos   elementos del DOM
const botonCerrarSesion = document.getElementById("cerrarSesionBtn");
if (botonCerrarSesion) {
  // Cerrar sesión y borrar los datos de los jugadores en localStorage
  botonCerrarSesion.addEventListener("click", () => {
    console.log("Cerrando sesión…");
 
   //  Evitar que se siga guardando estado
   // sesionActiva = false;
    
    localStorage.removeItem(CLAVE);
    localStorage.removeItem("nombreJ1");
    localStorage.removeItem("nombreJ2");

    //localStorage.setItem("sesionActiva", "false"); 
   // console.log("SESION ACTIVA:", sesionActiva);
    console.log("LOCALSTORAGE TRAS BORRAR:", JSON.stringify(localStorage));

    console.log("ANTES DE BORRAR:", localStorage);
    localStorage.clear();
    console.log("despues DE BORRAR:", localStorage);

    partida = null; //resetea la partida en memoria

    const enlaceBatalla = document.getElementById("enlace-volverBatalla");

    if (enlaceBatalla) {
      enlaceBatalla.classList.add("disabled");
      enlaceBatalla.style.pointerEvents = "none";
      enlaceBatalla.style.opacity = "0.5";
      enlaceBatalla.setAttribute("aria-disabled", "true");
    }


    alert("Has cerrado sesión.");
    setTimeout(() => {
      window.location.href = "index.html"; //redirige al inicio
    }, 1000);

  });
}
///=======FIN LOGICA BTN CERRAR SESION=========/
}})