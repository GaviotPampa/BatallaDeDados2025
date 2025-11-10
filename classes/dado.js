//clase Dado que se exporta a app.js con export default
class Dado {
    constructor() {
        // Imágenes asociadas a las caras del dado
        this.imagenes = [
            'assets/imgsDados/dado1.png',
            'assets/imgsDados/dado2.png',
            'assets/imgsDados/dado3.png',
            'assets/imgsDados/dado4.png',
            'assets/imgsDados/dado5.png',
            'assets/imgsDados/dado6.png'
        ];
    }

    // Método para lanzar el dado y obtener un resultado aleatorio
    lanzar() {
        const resultado = Math.floor(Math.random() * 6)+1; // Generamos un número aleatorio entre 0 y 5
        return resultado ; // Retornamos el número entre 1 y 6
    }

    // Método para obtener la imagen correspondiente al resultado del dado
    obtenerImagen(resultado) {
        // Retorna la imagen que corresponde a la cara del dado según el resultado
        return this.imagenes[resultado-1];
    }
}

export default Dado;
