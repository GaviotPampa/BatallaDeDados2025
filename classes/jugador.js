class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.puntos = 0; //NUMERO DEL DADO QUE LE TOCA EN LA TIRADA
    this.ultimaTirada = null; 
    this.rondasGanadas = 0; //NUMERO DE RONDAS GANADAS POR EL JUGADOR
    this.totalPuntos = 0;  // TOTAL DE PUNTOS QUE  acumula EL JUGADOR en toda la partida
    this.tiradas = [];

  }


  sumarRonda() {
    this.rondasGanadas = this.rondasGanadas + 1;
  }
}
export default Jugador;
