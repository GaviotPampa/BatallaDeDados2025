import { guardarEstado, mostrarMensaje } from "../app.js";
import Jugador from "./jugador.js";

class Partida {
  constructor(j1, j2) {

    this.jugador1 = j1;
    this.jugador2 = j2;


    this.turno = 1; // 1 = jugador1 / 2 = jugador2
    this.objetivo = 5; //  para ganar LA PARTIDA 5 rondas GANADAS
    this.terminada = false; // <- importante
    this.historial = []; // Guarda:  ronda, jugador1, jugador2 es para mantener las rondas para mostrar.
    this.numRonda = 1; //ara numerar rondas en el historial.
  }

  // Cambia el turno del jugador
  cambiarTurno() {
    this.turno = this.turno === 1 ? 2 : 1;
  }

   //  cada llamada a tirar(dado) corresponde a UNA tirada de UN jugador.
  // Si ambos jugadores ya tiraron en la ronda, se resuelve la ronda.
  tirar(dado) {
    if (this.terminada) return; //si la partida termino no tirar mas

     // genera valor con la clase Dado (dado.lanzar() devuelve de  1..6)
    const valor = dado.lanzar();// la tirada usa la clase Dado

    //se asigna la tirada del jugador actual segun el turno
    const jugadorActual = this.turno === 1 ? this.jugador1 : this.jugador2;
   
    jugadorActual.ultimaTirada = valor;
    //sumar puntos
    jugadorActual.puntos += valor;
    jugadorActual.totalPuntos += valor; //  puntos totales de la partida
    console.log(`${jugadorActual.nombre} le salio un ${valor}`)
      
    this.cambiarTurno();
    
    //  Si  ambos jugadores tienen ultimaTirada, resolvemos la ronda
    const j1t = this.jugador1.ultimaTirada;
    const j2t = this.jugador2.ultimaTirada;

    if (j1t !== null && j2t !== null) {
     const ganadorRonda = this.resolverRonda(j1t, j2t);

      // Guardar historial de la ronda
      this.historial.push({
        ronda: this.numRonda,
        jugador1: j1t,
        jugador2: j2t,
        ganador: ganadorRonda,
      });
       
      // Limpiar las tiradas para la siguiente ronda
      this.jugador1.ultimaTirada = null;
      this.jugador2.ultimaTirada = null;
      this.numRonda++;

      // Ver si hay ganador de la partida
      const ganadorFinal = this.ganadorFinal();
      if (ganadorFinal) {
        mostrarMensaje(`🎉 ${ganadorFinal.nombre} ganó la partida 🎉`);
      }

      // Guardar progreso
      guardarEstado(this);
    }

    return valor; // útil si querés mostrarlo en pantalla
  }

  //  Compara tiradas y devuelve quién ganó la ronda
  resolverRonda(j1t, j2t) {
    let ganadorRonda = null;

    if (j1t > j2t) {
      this.jugador1.sumarRonda();
      ganadorRonda = this.jugador1.nombre;
      mostrarMensaje(`${this.jugador1.nombre} ganó la ronda`);
    } else if (j2t > j1t) {
      this.jugador2.sumarRonda();
      ganadorRonda = this.jugador2.nombre;
      mostrarMensaje(`${this.jugador2.nombre} ganó la ronda`);
    } else {
      mostrarMensaje("Empate");
      ganadorRonda = "Empate";
    }

    console.log(`Ronda ganada por: ${ganadorRonda}`);
    return ganadorRonda;
  }

  //  Comprueba si alguien llegó al objetivo de rondas
  ganadorFinal() {
    if (this.jugador1.rondasGanadas >= this.objetivo) {
      this.terminada = true;
      return this.jugador1;
    }

    if (this.jugador2.rondasGanadas >= this.objetivo) {
      this.terminada = true;
      return this.jugador2;
    }

    return null; // si todavía no hay ganador
  }
}export default Partida;
