//agregar estilos con js, agregar alerts buenos y api de dolar
let contenedor = document.getElementById("contenedor")
let registrosDisponibles = document.getElementById("registrosDisponibles")
let dia = document.getElementById("dia")
let b = 1
//div inicial
let mesSeleccionado
let saldoInicial
//div registros
let diasDelMes
let numeroMov
let descripcion
let tipoDeMov
let montoRegistro
//objetos y json
let registroF1
let contenedorRegistros = []
//uss
let dolarBlue


//captura de elementos html

function capturaMes () {
    let mes = document.getElementById("meses")
    mes.addEventListener("change",()=>{
        mesSeleccionado = mes.value
    })
}

function capturaDia() {
    dia.addEventListener("change",()=>{
        diasDelMes = dia.value
    }) 
}

function tipoDeMovimiento() {
    let tipoMov = document.getElementById("tipoMov")
    tipoMov.addEventListener("change",()=>{
        if(tipoMov.value=="Elija una opcion"){
            tipoDeMov=undefined
        }
        if(tipoMov.value=="Entrada"){
            tipoDeMov=true
        }
        if(tipoMov.value=="Salida"){
            tipoDeMov=false
        }
    })
}

//principales

//elejir mes y monto inicial
function iniciarRegistro () {
    let a
    let diasAnteriores
    let numeroDias
    let eliminarAnterior = document.querySelectorAll(".numeroDeDia")
    let ingresoSaldoIncial = document.getElementById("ingresoSaldoIncial")
    let resultados = document.getElementsByClassName("resultados")
    let valoresIniciales = document.getElementById("iniciarRegistro")
    let error = document.getElementById("error")
    let elejirMes = document.getElementById("elejirMes")
    valoresIniciales.addEventListener("click",() =>{
        dia.innerHTML = ""
        if(mesSeleccionado==undefined){
            tostada2()
            elejirMes.style.color = "red"
            setTimeout(()=>{
                elejirMes.style.color = "black"
            },2000)
        }
        else {
            contenedor.innerHTML = ""
            numeroDias = 0
            numeroDias = totalDias(mesSeleccionado)
            error.innerText = null
            saldoInicial = Number(ingresoSaldoIncial.value)
            swal("Se inicio un nuevo registro", "El mes seleccionado es " + mesSeleccionado + " y el monto inicial es de " + formatoNum(saldoInicial) + " pesos", "success")
            resultados[0].innerText = "Mes seleccionado: " + mesSeleccionado
            resultados[1].innerText = "Saldo inicial: " + formatoNum(saldoInicial) + " $"
            for (let index = 0; index < numeroDias; index++) {
                let nDia = document.createElement("option")
                nDia.value=index+1
                nDia.className="numeroDeDia"
                nDia.textContent=index+1
                dia.appendChild(nDia)
            }
        }
    })
}

//movimientos del mes. capturo descripcion,tipo de movimiento y monto
function guardarRegistro() {
    iniciarRegistro(capturaMes())
    tipoDeMovimiento()
    capturaDia()
    let a = 1
    let movimientosMenusales = []
    let txError = document.getElementsByClassName("textoMovimiento")
    let guardarElemento = document.getElementById("cont")
    let terminarMes = document.getElementById("term")
    let montoRegistro = document.getElementById("ingresoSaldo")
    let descripcion = document.getElementById("ingresoDescripcion")
    let botonNR = document.getElementById("botonRegistro")
    let ert = document.getElementById("errorRegistrosTerminados")
    numeroMov = document.getElementById("numeroMov")
    guardarElemento.addEventListener("click",()=>{
        if(descripcion==undefined||montoRegistro==undefined||tipoDeMov==undefined||diasDelMes==undefined){
            tostada2()
            if(diasDelMes==undefined){
                setTimeout(()=>{
                    txError[0].style.color = "black"
                },5000)
                txError[0].style.color = "red"
            }
            if(descripcion==undefined){
                setTimeout(()=>{
                    txError[1].style.color = "black"
                },5000)
                txError[1].style.color = "red"
            }
            if(tipoDeMov==undefined){
                setTimeout(()=>{
                    txError[2].style.color = "black"
                },5000)
                txError[2].style.color = "red"
            }
            if(montoRegistro==undefined){
                setTimeout(()=>{
                    txError[3].style.color = "black"
                },5000)
                txError[3].style.color = "red"
            }
        }
        else {
            tostada1()
            a++
            let nMovimiento = new movimientos(diasDelMes,descripcion.value,tipoDeMov,Number(montoRegistro.value))
            movimientosMenusales.push(nMovimiento)
            numeroMov.innerText = a
        }
    })
    terminarMes.addEventListener("click",()=>{
        if(mesSeleccionado==undefined||saldoInicial==undefined){
            done.innerText = "No definiste mes o saldo inicial"
            setTimeout(()=>{
                done.innerText = ""
            },5000)
        }
        else{
            if(a==1){
                done.innerText = "No ingresaste ningun registro!"
                setTimeout(()=>{
                    done.innerText = ""
                },5000)
            }
            else{
                //guardo el ultimo movimientoi
                let nMovimiento = new movimientos(diasDelMes,descripcion.value,tipoDeMov,Number(montoRegistro.value))
                movimientosMenusales.push(nMovimiento)
                //guardo todos los movimientos en un objeto

                nRegistro = new registro(mesSeleccionado,saldoInicial,movimientosMenusales)

                //los convierto en JSON
                registroF1 =  JSON.stringify([mesSeleccionado,saldoInicial,movimientosMenusales])
                localStorage.setItem(mesSeleccionado,registroF1)
                swal("El mes de " + mesSeleccionado + " se registro exitosamente!", "Tu resumen se encuentra registrado y listo para ver","success")
                a=1
                b++
                numeroMov.innerText = a
                ert.innerText = ""
                contenedor.innerHTML = " "
                crearOpcionRegistro ()
                reset()
                movimientosMenusales = []
            }
        }
    })
}

function crearResumen() {
    let vuelta = 0;
    let total = 0;
    let parcial = 0;
    let tipo;
    let sum = 0;
    let rest = 0;
    let inicioResumen = document.createElement("div");
    let finalResumen = document.createElement("div");
    inicioResumen.className = "inicioResumen";
    finalResumen.className = "finalResumen";
    contenedor.style.borderStyle = "none";
    registrosDisponibles.addEventListener("change", () => {
        contenedor.innerHTML = " "
      contenedor.style.borderStyle = "solid";
      sum = 0;
      rest = 0;
      total = 0;
      parcial = 0;
      let resumenAfuera = JSON.parse(localStorage.getItem(registrosDisponibles.value));
      inicioResumen.innerHTML = `
      <h2>Resumen del mes de ${resumenAfuera[0]}</h2>
      <h2>Saldo al inicio del mes: ${formatoNum(resumenAfuera[1])} $ </h2>
      `;
      contenedor.appendChild(inicioResumen);
      const elementosARemover = document.querySelectorAll(".resumenListo");
      elementosARemover.forEach(elemento => {
        elemento.remove();
      });
      resumenAfuera[2].forEach(element => {
        if (element.tipo == true) {
          sum += element.monto;
          tipo = "Entrada";
        } else {
          rest += element.monto;
          tipo = "Salida";
        }
        let resumen = document.createElement("div");
        resumen.className = "resumenListo";
        resumen.innerHTML = `
          <p>${element.dia}/${resumenAfuera[0]}</p>
          <p> # ${element.descripcion}</p>
          <p>${tipo}</p>
          <p class="num">${formatoNum(element.monto)} $</p>
          `;
        contenedor.appendChild(resumen);
      });
  
      parcial = sum - rest;
      total = resumenAfuera[1] + parcial;
      finalResumen.innerHTML = `
      <h3 id="ingresosResumen">Tus ingresos ascendieron a la suma de : ${formatoNum(sum)} $</h3>
      <h3 id="gastosResumen">Tus gastos ascendieron a la suma de : ${formatoNum(rest)} $</h3>
      <h3 id="totalResumen">Por lo que al final de mes, dispones de ${formatoNum(total)} $</h3>
      <button id="uss" class="btn btn-primary">A dolar</button>
      `;
      contenedor.appendChild(finalResumen);

      let uss = document.getElementById("uss")
      uss.addEventListener("click",()=>{

        let resumenUss = document.createElement("div")
        resumenUss.className = "resumenUss"
        resumenUss.innerHTML = `
        <h2>Saldo al inicio del mes: ${(resumenAfuera[1]/dolarBlue).toFixed(2)} U$ </h2>
        <h2 id="ingresosResumen">Tus ingresos ascendieron a la suma de : ${(sum/dolarBlue).toFixed(2)} U$</h3>
        <h2 id="gastosResumen">Tus gastos ascendieron a la suma de : ${(rest/dolarBlue).toFixed(2)} U$</h3>
        <h2 id="totalResumen">Por lo que al final de mes, dispones de ${(total/dolarBlue).toFixed(2)} U$</h3>
        `
        contenedor.appendChild(resumenUss);
    })
});
}


//clases y metodos universales

async function aDolar() {
    try {
      const linkDolar = "https://api.bluelytics.com.ar/v2/latest";
      const respuesta = await fetch(linkDolar);
      const data = await respuesta.json();
      dolarBlue = Number(data.blue.value_avg);
    } catch (error) {
      console.error("Error al obtener el valor del dólar:", error)
      return null
    }
  }

function totalDias (mes) {
let año = 2023
mes = mes.toUpperCase();
var meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
return new Date(año, meses.indexOf(mes) + 1, 0).getDate();
}

class registro {
    constructor (mes,saldoInicial,movimientos){
        this.mes = mes
        this.saldoInicial = saldoInicial
        this.movimientos = movimientos
    }
}

class movimientos {
    constructor (dia,descripcion,tipo,monto){
        this.dia = dia
        this.descripcion = descripcion
        this.tipo = tipo
        this.monto = monto
    }
}

function reset () {
    mesSeleccionado = undefined
    saldoInicial = undefined
    descripcion = undefined
    tipoDeMov = undefined
    montoRegistro = undefined
}

function crearOpcionRegistro(){
    let nuevaOpcion = document.createElement("option")
    nuevaOpcion.className = "opcionRegistro"
    nuevaOpcion.innerHTML = `<option value="${b}">${mesSeleccionado}</option>`
    registrosDisponibles.appendChild(nuevaOpcion)
}

function tostada1() {
    Toastify({
        text: "Movimiento registrado",
        className: "info",
        duration: 1000,
        offset: {
            y: 500
        },
        style: {
            background: "orange",
        }
    }).showToast();
}

function tostada2() {
    Toastify({
        text: "Faltan datos a ingresar",
        className: "info",
        gravity: "bottom",
        position: "center",
        duration: 2000,
        style: {
            background: "red",
        }
    }).showToast();
}

function formatoNum(n){
    return new Intl.NumberFormat().format(n)
}

function primerUso(){
    swal("Bienvenido!", "Con este sistema, vas a poder registrar tus movimientos monetarios por mes")
    .then(()=>{
        Toastify({
            text: "Aca llenas el mes a registrar y el monto inicial",
            className: "info",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: "blue",
            }
        }).showToast();
        setTimeout(()=>{
            Toastify({
                text: "Aca seleccionas el dia, el detalle, el tipo de movimiento y el monto",
                className: "info",
                position: "right",
                offset: {
                y: 500
            },
            duration: 3000,
            style: {
                background: "violet",
              }
            }).showToast();
            setTimeout(()=>{
                Toastify({
                    text: "con el boton izquierdo, continuas agregando y con el derecho, terminas el registro",
                    className: "info",
                    position: "center",
                    offset: {
                        y: 750
                    },
                    duration: 3000,
                    style: {
                        background: "green",
                    }
                }).showToast();  
                setTimeout(()=>{
                    Toastify({
                        text: "Y abajo va a aparecer el registro, en el desplegable",
                        className: "info",
                        gravity: "bottom",
                        position: "center",
                        duration: 3000,
                        style: {
                            background: "black",
                        }
                      }).showToast();
                      setTimeout(()=>{
                          swal("Esperamos que te sea util!", "Ante cualquier consulta, manda un mail a ges.over@gmail.com");
                        },3000)
                    },3000)
                },3000)
        },3000)
    });
}

//ejecutar modulos

function ejecutar(){
    aDolar()
    primerUso()
    guardarRegistro()
    crearResumen()
}

ejecutar()

