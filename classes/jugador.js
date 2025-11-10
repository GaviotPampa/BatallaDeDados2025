class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.puntos = 0;
    this.ultimaTirada = null; 
    this.rondasGanadas = 0;
    this.totalPuntos = 0;  // acumula puntos en toda la partida

  }

 /*  registrarTirada(valor) {
    this.puntos = valor;
    this.tiradas = this.tiradas - 1;
  } */

/*   sumarRonda() {
    this.rondasGanadas = this.rondasGanadas + 1;
  } */
}
export default Jugador;
