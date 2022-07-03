const container = document.getElementById("container");
const btn = document.getElementById("btn");

const filas = 50;
const columnas = 30;
let tableroClon = [];
let reproducir = false;

// generamos un ciclo infinito y le decimos que si se esta reproduciendo pasamos al siguiente estado con una duracion de 300ms
setInterval(() => {
  if (reproducir) {
    siguienteEstado();
  }
}, 300);

// toggle que permite detener o reanudar la reproduccion
const pausarReanudar = () => {
  reproducir = !reproducir;
  if (reproducir) {
    btn.innerHTML = "Detener";
    btn.style.background = "red";
  } else {
    btn.innerHTML = "Iniciar";
    btn.style.background = "#84e4f5";
  }
};

// generamos el tablero con un <table/>
const generarTablero = () => {
  // le doy un id para obtener el elemento y poder usarlo posteriormente
  let body = "<table id='tablero'>";
  // recorremos la cantidad de filas que requerimos
  for (let f = 0; f < filas; f++) {
    body += "<tr>";
    // este for recorre la cantidad de columnas, con esto metemos los td dentro de los tr
    for (let c = 0; c < columnas; c++) {
      // le ponemos un identificador unico a cada celula para manejar el estado de cada uno individualmente
      // cada vez que presionamos un cuadrado, cambiamos de estado a c y f por vivo o muerto
      body += `<td id="${c + "-" + f}" onclick='cambiarEstado(${c}, ${f})' >`;
      body += "</td>";
      // console.log(c + "," + f);
      // por cada columna, c suma 1... y por cada fila f suma 1, ej:
      //  0,0 1,0 2,0 3,0 4,0 5,0
      //  0,1 1,1 2,1 3,1 4,1 5,1
      //  0,2 1,2 2,2 3,2 4,2 5,2
    }
    body += "</tr>";
  }
  body += "</table>";
  // el contenedor que recuperamos del index.html va a ser igual al body que creamos
  container.innerHTML = body;
  const tablero = document.getElementById("tablero");
  // definimos el ancho y alto de cada cuadradito
  tablero.style.width = "65em";
  tablero.style.height = "80em";
};
generarTablero();

// le pasamos a la funcion por parametro las columns y filas para devolverlas en el onclick de arriba
const cambiarEstado = (c, f) => {
  // obtenemos cada celular por id
  let celula = document.getElementById(c + "-" + f);
  // si el color es negro, la celula esta viva... si es blanca esta muerta
  if (celula.style.background != "black") {
    celula.style.background = "black";
  } else {
    celula.style.background = "white";
  }
};

const reiniciarTablero = () => {
  for (let c = 0; c < columnas; c++) {
    for (let f = 0; f < columnas; f++) {
      let celula = document.getElementById(c + "-" + f);
      // independientemente si las celulas estan vivas o muertas, se ponen todas las casillas en blanco
      celula.style.background = "white";
    }
  }
};

// esto va a ser como un clon del tablero que va a recorrer todas las celdas verificando el comportamiento de las celulas vecinas
const clonarTablero = () => {
  tableroClon = [];
  // despues de cada iteracion en c se le va a agregar un arreglo vacio para que pueda contener los f
  for (let c = 0; c < columnas; c++) {
    tableroClon.push([]);
    // console.log(tableroClon);
    for (let f = 0; f < columnas; f++) {
      let celula = document.getElementById(c + "-" + f);
      // lo que almacenamos dentro de tableroClon es lo siguiente:
      // si la celula esta viva (es decir si tableroClon[x][y] da true) retorna el color negro
      tableroClon[c][f] = celula.style.background === "black";
    }
  }
};

// funcion para contar la cantidad de celulas vivas que hay en una posicion c f
const celulasVivas = (c, f) => {
  let vivas = 0;
  // recorremos los numeros de -1 a 1
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // si i es igual a 0 y j tmb, vamos a continuar con la siguiente iteracion de lo contrario verificamos el estado de la celula que estaba en esa posicion
      if (i === 0 && j === 0) continue;
      // usamos un try catch para q no nos de error al encontrar undefined en alguna posicion
      try {
        // si esa celda esta viva vamos a aumentar la cantidad de celulas vivas
        if (tableroClon[c + i][f + j]) vivas++;
      } catch (err) {}
      // si la cantidad de celulas vivas es mayor a 3 retornamos, porq no necesitamos seguir contando (mueren por sobrepoblacion)
      if (vivas > 3) {
        return vivas;
      }
    }
  }
  return vivas;
};

const siguienteEstado = () => {
  clonarTablero();
  // vamos a recorrer cada una de las celdas
  // vamos a contar cuantas celulas vivas tiene esa celda alrededor y vamos a obtener las celulas
  for (let c = 0; c < columnas; c++) {
    for (let f = 0; f < columnas; f++) {
      let vivas = celulasVivas(c, f);
      let celula = document.getElementById(c + "-" + f);
      if (tableroClon[c][f]) {
        // si la celula esta viva (tableroClon[c][f]) miramos lo siguiente:
        // si la cantidad de celulas vivas es < a 2, o > a 3, muere por sobrepoblacion
        if (vivas < 2 || vivas > 3) celula.style.background = "white";
        // si esta muerta ejecutamos el else:
      } else {
        // para que nazca otra tiene q haber 3 vivas su alrededor
        if (vivas === 3) celula.style.background = "black";
      }
    }
  }
};
