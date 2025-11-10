import Jugador from "./classes/jugador.js";
import Partida from "./classes/partida.js";
import Dado from "./classes/dado.js";

// Obtenemos   elementos del DOM
const mensajeTurno = document.getElementById("mensajeTurno");

//let turno = 1; // 1 para jugador 1, 2 para jugador 2

// =====================
// LOCALSTORAGE
// =====================
const CLAVE = "batalla-dados-estado";

export function guardarEstado(partida) {
  const datos = {
    jugador1: partida.jugador1,
    jugador2: partida.jugador2,
    turno: partida.turno,
    objetivo: partida.objetivo,
    terminada: partida.terminada,
  };
  localStorage.setItem(CLAVE, JSON.stringify(datos));
}

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
//     UI
// =====================
export function mostrarMensaje(texto) {
  const el = document.getElementById("mensaje-ronda");
  if (el) {
    el.textContent = texto;
  } else {
    console.log(texto);
  }
}

function actualizarPantalla(partida) {
  // nombres
  const nj1 = document.getElementById("nombre-j1");
  const nj2 = document.getElementById("nombre-j2");
  if (nj1) nj1.textContent = partida.jugador1.nombre;
  if (nj2) nj2.textContent = partida.jugador2.nombre;

  // jugador 1
  const pj1 = document.getElementById("puntos-j1");
  const rj1 = document.getElementById("rondas-j1");
  if (pj1) pj1.textContent = partida.jugador1.puntos;
  if (rj1) rj1.textContent = partida.jugador1.rondasGanadas;

  const puntosTotalesJ1 = document.getElementById("totalJugador1");
  if (puntosTotalesJ1)
    puntosTotalesJ1.textContent = `Puntos totales de partida: ${partida.jugador1.totalPuntos}`;

  // jugador 2
  const pj2 = document.getElementById("puntos-j2");
  const rj2 = document.getElementById("rondas-j2");

  if (pj2) pj2.textContent = partida.jugador2.puntos;

  if (rj2) rj2.textContent = partida.jugador2.rondasGanadas;

  const puntosTotalesJ2 = document.getElementById("totalJugador2");
  if (puntosTotalesJ2)
    puntosTotalesJ2.textContent = `Puntos totales de partida: ${partida.jugador2.totalPuntos}`;

  // ⭐ mostrar estrellas (uno por ronda)
  const sj1 = document.getElementById("stars-j1");
  const sj2 = document.getElementById("stars-j2");

  if (sj1) sj1.textContent = "⭐".repeat(partida.jugador1.rondasGanadas);
  if (sj2) sj2.textContent = "⭐".repeat(partida.jugador2.rondasGanadas);

  //  actualizar historial en pantalla
  actualizarHistorial(partida);
}

function actualizarHistorial(partida) {
  const lista = document.getElementById("lista-historial");
  if (!lista) return;

  lista.innerHTML = ""; // limpio para no duplicar

  // Si no hay historial, muestro mensaje
  if (!Array.isArray(partida.historial) || partida.historial.length === 0) {
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

// =====================
// UN SOLO DOMContentLoaded
// =====================
document.addEventListener("DOMContentLoaded", function () {
  //instanciar dado para usarlo en la partida
  const dado = new Dado("dado-imagen");

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

  // 2) si estoy en batalla.html (hay dado)
  const imagenDado = document.getElementById("dado-imagen");

  if (!imagenDado) return;

  let partida = cargarEstado();
  if (!partida) {
    const nombre1 = localStorage.getItem("nombreJ1") || "Jugador 1";
    const nombre2 = localStorage.getItem("nombreJ2") || "Jugador 2";

    const j1 = new Jugador(nombre1);
    const j2 = new Jugador(nombre2);

    partida = new Partida(j1, j2);
    guardarEstado(partida);
  }

  mensajeTurno.textContent = `Turno de ${partida.jugador1.nombre}`;
  //console.log(mensajeTurno.textContent);

  actualizarPantalla(partida);

  /****logica del boton para lanzar el dado  y todas las res al lanzar cada tirada***/

  let contadorTiradas = 0;
  let contadorTiradasJ1 = 0;
  let contadorTiradasJ2 = 0;

  const contadorJ1 = document.getElementById("tiradas-j1");
  const contadorJ2 = document.getElementById("tiradas-j2");
  const resultadoRonda = document.getElementById("resultado-ronda");
  const contador = document.getElementById("contador-tiradas");

  const boton = document.getElementById("boton-tirar");
  if (boton) {
    boton.addEventListener("click", function () {
      // si ya terminó, no dejo seguir
      if (partida.terminada) {
        return;
      }

      const resultado = partida.tirar(dado); //tira una vez
      //console.log("mostrar resultado en partida.tirar:", resultado);

      //Obtener y Actualizar la imagen correspondiente al resultado del dado
      imagenDado.src = dado.obtenerImagen(resultado);
      //console.log("resultado real del dado al lanzar", resultado);

      contadorTiradas++;
      if (contador) contador.textContent = `🎰Tirada: ${contadorTiradas}`;

      // Saber quién tiró
      const jugadorActual =
        partida.turno === 1 ? partida.jugador2 : partida.jugador1;

      // Mostrar en pantalla el número de tirada

      // Aumentar tirada del jugador correspondiente
      if (jugadorActual.nombre === partida.jugador1.nombre) {
        contadorTiradasJ1++;
        if (contadorJ1) contadorJ1.textContent = `Tirada: ${contadorTiradasJ1}`;
      } else if (jugadorActual.nombre === partida.jugador2.nombre) {
        contadorTiradasJ2++;
        if (contadorJ2)
          contadorJ2.textContent = ` Tirada: ${contadorTiradasJ2}`;
      }

      // Mostrar el resultado de la tirada
      mostrarMensaje(`🎲${jugadorActual.nombre} obtuvo un ${resultado}`);

      // Actualizar indicador de turno en pantalla
      mensajeTurno.textContent = `Turno de ${jugadorActual.nombre}`;

      // Comparar puntajes y mostrar quién ganó o si empataron
      const p1 = partida.jugador1.puntos;
      const p2 = partida.jugador2.puntos;

      if (p1 > p2) {
        if (resultadoRonda)
          resultadoRonda.textContent = `${partida.jugador1.nombre} ganó la ronda 🏆`;
      } else if (p2 > p1) {
        if (resultadoRonda)
          resultadoRonda.textContent = `${partida.jugador2.nombre} ganó la ronda 🏆`;
      } else {
        if (resultadoRonda) resultadoRonda.textContent = `Empate 🤝`;
      }

      actualizarPantalla(partida);

      const ganador = partida.ganadorFinal();
      if (ganador) {
        mostrarMensaje("🎉 " + ganador.nombre + " ganó la partida");

        if (typeof confetti === "function") {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        }

        // desactivo botón
        boton.disabled = true;
      }

      guardarEstado(partida);
    });
  }

  // botón reiniciar (solo en batalla)
  /*   const btnReiniciar = document.getElementById("btn-reiniciar");
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", function () {
      localStorage.removeItem(CLAVE);
      localStorage.removeItem("nombreJ1");
      localStorage.removeItem("nombreJ2");
      window.location.href = "index.html";
    });
  } */

  // Obtenemos   elementos del DOM
  const btnReiniciar = document.getElementById("btn-reiniciar");
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      // Reiniciar jugadores
      partida.jugador1.puntos = 0;
      partida.jugador2.puntos = 0;

      partida.jugador1.ultimaTirada = null;
      partida.jugador2.ultimaTirada = null;

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

      contadorTiradas = 0;
      contadorTiradasJ1 = 0;
      contadorTiradasJ2 = 0;
      if (contadorJ1) contadorJ1.textContent = "";
      if (contadorJ2) contadorJ2.textContent = "";
      if (resultadoRonda) resultadoRonda.textContent = "";

      // Limpiar pantalla
      document.getElementById("lista-historial").innerHTML = ""; //limpia el historial
      document.getElementById("mensaje-ronda").textContent = ""; //limpia mensaje del ganador
      document.getElementById("mensajeTurno").textContent =
        "Turno del jugador 1"; //vuelve al turno por default

      document.getElementById("contador-tiradas").textContent = "";

      document.getElementById("dado-imagen").src = "assets/imgsDados/dado1.png"; // Limpia la imagen del dado

      //  Volver a habilitar botón de tirar
      boton.disabled = false;

      console.log(" Partida reiniciada correctamente");

      actualizarPantalla(partida); // restablece la info de la pantalla

      //guardarEstado(partida);

    });
  }
});

// Obtenemos   elementos del DOM
const botonCerrarSesion = document.getElementById("cerrarSesionBtn");
if (botonCerrarSesion) {
  // Cerrar sesión y borrar los datos de los jugadores
  botonCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem(CLAVE);
    localStorage.removeItem("nombreJ1");
    localStorage.removeItem("nombreJ1");
    alert("Has cerrado sesión.");
    setTimeout(() => {
      window.location.href = "index.html"; //redirige al inicio
    }, 1000);
  });
}
