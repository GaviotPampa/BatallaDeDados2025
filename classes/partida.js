import { guardarEstado } from "../app.js";

class Partida {
  constructor(j1, j2) {
    this.jugador1 = j1;
    this.jugador2 = j2;
    this.tiradasJ1 = 0;
    this.tiradasJ2 = 0;
    this.tiradas = 0;
    this.turno = 1; // 1 = jugador1 / 2 = jugador2
    this.objetivo = 5; //  para ganar una ronda
    this.terminada = false; // <- importante
    this.historial = []; // Guarda:  ronda, jugador1, jugador2
    this.numRonda = 1;
  }

  // Cambia el turno del jugador
  cambiarTurno() {
    this.turno = this.turno === 1 ? 2 : 1;
  }

  tirar(dado) {
    if (this.terminada) return;

    const valor = dado.lanzar();
    // ahora la tirada usa la clase Dado

    const jugadorActual = this.turno === 1 ? this.jugador1 : this.jugador2;

    //Contar cuantas tiradas lleva el jugador
    this.tiradas++;
    console.log(` Tirada #${this.tiradas} | Turno de ${jugadorActual.nombre}`);
    console.log(`${jugadorActual.nombre} obtuvo: ${valor}`);

    //tirada actual a cada jugador
    if (this.turno === 1) {
      this.tiradasJ1++;
      console.log(`🎲 ${this.jugador1.nombre} - Tirada #${this.tiradasJ1}`);
    } else {
      this.tiradasJ2++;
      console.log(`🎲 ${this.jugador2.nombre} - Tirada #${this.tiradasJ2}`);
    }

    //registrar tirada
    jugadorActual.ultimaTirada = valor;
    jugadorActual.puntos += valor; //suma puntos de la ronda
    jugadorActual.totalPuntos += valor; //  puntos totales de la partida

    this.cambiarTurno();

    //  Cuando alcanza el objetivo (30) gana la ronda
    if (jugadorActual.puntos >= this.objetivo) {
      jugadorActual.rondasGanadas++;
      // Primero, guardamos los valores REALES antes de reiniciar
      const puntosJ1 = this.jugador1.puntos;
      const puntosJ2 = this.jugador2.puntos;
      // Guardamos historial
      this.historial.push({
        ronda: this.numRonda,
        jugador1: puntosJ1,
        jugador2: puntosJ2,
      });
      console.log(
        "guarde historial:",
        this.historial[this.historial.length - 1]
      );

      // Reiniciar para nueva ronda
      this.jugador1.puntos = 0;
      this.jugador2.puntos = 0;
      this.jugador1.tiradas = [];
      this.jugador2.tiradas = [];
      this.numRonda++;

      //Guardar partida actual
      guardarEstado(this);

      //reinicio de contadores de tiradas
      /*   this.tiradasJ1 = 0;
      this.tiradasJ2 = 0; */
    }

    return valor;
  }

  ganadorFinal() {
    if (this.jugador1.rondasGanadas >= this.objetivo) {
      this.terminada = true;
      return this.jugador1;
    }
    if (this.jugador2.rondasGanadas >= this.objetivo) {
      this.terminada = true;
      return this.jugador2;
    }
    return null;
  }
}
export default Partida;
