//CONSTRUCCIONES
function Seguro(marca, year, tipo) {
     this.marca = marca;
     this.year = year;
     this.tipo = tipo;
}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {
     /*
          1 = Americano 1.15
          2 = Asiatico 1.05
          3 = Europeo 1.35
     */

     let cantidad;
     const base = 2000;

     switch(this.marca) {
          case '1':
               cantidad = base * 1.15;
               break;
          case '2':
               cantidad = base * 1.05;
               break;
          case '3':
               cantidad = base * 1.35;
               break;
          default:
               break;
     }

     // Leer el año
     const diferencia = new Date().getFullYear() - this.year;

     // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
     cantidad -= ((diferencia * 3) * cantidad) / 100;

     /*
          Si el seguro es basico se multiplica por un 30% mas
          Si el seguro es completo se multiplica por un 50% mas
     */

     if(this.tipo === 'basico') {
          cantidad *= 1.30;
     } else {
          cantidad *= 1.50;
     }

     return cantidad;

}

function UI() {}

// LLENA LAS OPCIONES DE LOS NIÑOS

UI.prototype.llenarOpciones = () => {
     const max = new Date().getFullYear(),
          min = max - 20;

          const selectYear = document.querySelector('#year');

          for(let i = max; i > min; i-- ) {
               let option = document.createElement('option');
               option.value = i;
               option.textContent = i;
               selectYear.appendChild(option);
          }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
     const div = document.createElement('div');
     
     if(tipo === 'error') {
          div.classList.add('mensaje', 'error');
     } else {
          div.classList.add('mensaje', 'correcto');
     }

     div.classList.add('mensaje', 'mt-10');
     div.textContent = mensaje;

     // Insertar en HTML
     const formulario = document.querySelector('#cotizar-seguro');
     formulario.insertBefore(div, document.querySelector('#resultado'));

     setTimeout(() => {
          div.remove();
     }, 1500);
}

UI.prototype.mostrarResultado = (total, seguro) => {

     const {marca, year, tipo} = seguro;

     let textoMarca;

     switch(marca) {
          case '1':
               textoMarca = 'Americano';
               break;
          case '2':
               textoMarca = 'Asiatico';
               break;
          case '3':
               textoMarca = 'Europeo';
               break;
          default:
               break;
     }

     // Crear el resultado
     const div = document.createElement('div');
     div.classList.add('mt-10');
      div.innerHTML = `
          <p class="header"> Tu Resultado</p>
          <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
          <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
          <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span></p>
          <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p> 
     `;

     const resultadoDiv = document.querySelector('#resultado');

     // Mostrar el spinner
     const spinner = document.querySelector('#cargando');
     spinner.style.display = 'block';

     setTimeout(() => {
          spinner.style.display = 'none';
          resultadoDiv.appendChild(div);
     }, 1500);
}

// INSTANCIAR UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
     ui.llenarOpciones();
})

eventListeners();
function eventListeners() {
     const formulario = document.querySelector('#cotizar-seguro');
     formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
     e.preventDefault();
     
     // Leer la marca seleccionada
     const marca = document.querySelector('#marca').value

     // Leer el año seleccionada
     const year = document.querySelector('#year').value;

     // Leer el tipo de cobertura
     const tipo = document.querySelector('input[name="tipo"]:checked').value;

     if(marca === '' || year === '' || tipo === '') {
          ui.mostrarMensaje('todos los campos son obligatorios', 'error');
          return;
     } 
     ui.mostrarMensaje('Cotizando...', 'exito');

     // Ocultar las cotizaciones previas
     const resultados = document.querySelector('#resultado div');
     if(resultados != null) {
          resultados.remove();
     }

     // Instanciar
     const seguro = new Seguro(marca, year, tipo);
     const total = seguro.cotizarSeguro();

     // Utilizar el prototype que va a cotizar
     ui.mostrarResultado(total, seguro);

}