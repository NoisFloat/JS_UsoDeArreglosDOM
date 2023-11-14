var arregloObjetos = [];
var textoAyuda;

var select = [
  "Apopa",
  "La Campanera",
  "Morazan",
  "Soyapango",
  "San Salvador"
];

class Usuario {
  constructor() {
    this.id = 0;
    this.nombre_Usuario = "";
    this.telefono_Usuario = 0;
    this.sexo_Usuario = "";
    this.fechaN_Usuario = "";
    this.ciudadResidencia_Usuario = "";
    this.edadUsuario = 0;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setNombre(nombre) {
    this.nombre_Usuario = nombre;
  }

  getNombre() {
    return this.nombre_Usuario;
  }

  setTelefono(telefono) {
    this.telefono_Usuario = telefono;
  }

  getTelefono() {
    return this.telefono_Usuario;
  }

  setSexo(sexo) {
    this.sexo_Usuario = sexo;
  }

  getSexo() {
    return this.sexo_Usuario;
  }

  setFecha(fecha) {
    this.fechaN_Usuario = fecha;
    this.setEdad();
  }

  getFecha() {
    return this.fechaN_Usuario;
  }

  setResidencia(residencia) {
    this.ciudadResidencia_Usuario = residencia;
  }

  getResidencia() {
    return this.ciudadResidencia_Usuario;
  }

  setEdad() {
    this.edadUsuario = this.calcularEdad();
  }

  calcularEdad() {
    if (this.fechaN_Usuario) {
      const fechaNacimiento = new Date(this.fechaN_Usuario);
      const fechaActual = new Date();
      const diferencia = fechaActual - fechaNacimiento;
      const edad = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
      return edad;
    } else {
      return 0;
    }
  }
}

function mostarSelect() {
  var selectoHTML = document.getElementById("seleccion");
  select.forEach((e) => {
    var option = document.createElement("option");
    option.text = e;
    option.value = e;
    selectoHTML.add(option);
  });
}

function guardarEnLocalStorage(nombre, datos) {
  try {
    const datosJSON = JSON.stringify(datos);
    localStorage.setItem(nombre, datosJSON);
    console.log(`Los datos se han guardado en localStorage con el nombre "${nombre}".`);
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

function recuperarDatosLocalStorage() {
  try {
    var datosLocalStorage = localStorage.getItem("users");

    if (datosLocalStorage) {
      arregloObjetos = JSON.parse(datosLocalStorage);

      arregloObjetos = arregloObjetos.map((data, index) => {
        const usuario = new Usuario();
        usuario.setId(index);
        usuario.setNombre(data.nombre_Usuario);
        usuario.setTelefono(data.telefono_Usuario);
        usuario.setSexo(data.sexo_Usuario);
        usuario.setFecha(data.fechaN_Usuario);
        usuario.setResidencia(data.ciudadResidencia_Usuario);
        return usuario;
      });
    } else {
      console.log("No se encontraron datos en localStorage");
    }
  } catch (error) {
    console.error("Ocurrió un error al leer los datos de localStorage: " + error);
  }
}

function inicializacion() {
  mostarSelect();
  recuperarDatosLocalStorage();
  MostrarInstancia();
  let InputNombre = document.getElementById("nombre");
  let InputTelefono = document.getElementById("telefono");
  let InputSexo = document.getElementById('sexo');
  let InputFechaNacimiento = document.getElementById("fecha_de_nac");
  var select = document.getElementById('seleccion');

  let BtnSubmit = document.getElementById("submit");

  if (BtnSubmit.addEventListener) {
    BtnSubmit.addEventListener("click", function (e) {
      e.preventDefault();
      var SelectedSexo = InputSexo.value;
      var selectedText = select.value;
      CrearUnaNuevaInstancia(
        InputNombre.value,
        InputTelefono.value,
        SelectedSexo,
        InputFechaNacimiento.value,
        selectedText
      );
    });
  }
}

function CrearUnaNuevaInstancia(nombre, tel, sex, fea, sel) {
  if (nombre.trim() === '' || tel.trim() === '' || sex.trim() === '' || fea.trim() === '' || sel.trim() === '') {
    alert("Por favor, complete todos los campos.");
    return;
  }

  var telefonoPattern = /^[27]\d{7}$/;
  if (!tel.match(telefonoPattern)) {
    alert("El formato del teléfono no es válido. Debe contener 8 dígitos y empezar con 2 o 7.");
    return;
  }

  var anioNacimiento = new Date(fea).getFullYear();
  var anioActual = new Date().getFullYear();
  if (anioNacimiento > anioActual) {
    alert("El año de nacimiento no puede ser mayor que el año actual.");
    return;
  }

  let ObjetoUsuario = new Usuario();
  ObjetoUsuario.setId(arregloObjetos.length);
  ObjetoUsuario.setNombre(nombre);
  ObjetoUsuario.setTelefono(tel);
  ObjetoUsuario.setSexo(sex);
  ObjetoUsuario.setFecha(fea);
  ObjetoUsuario.setResidencia(sel);
  arregloObjetos.push(ObjetoUsuario);
  guardarEnLocalStorage('users', arregloObjetos);
  MostrarInstancia();
}

var filasDeVentas = document.getElementById("tablaResultados");

function MostrarInstancia() {
  let tbody = filasDeVentas;
  tbody.innerHTML = "";

  arregloObjetos.forEach((element) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${element.id}</td>
      <td>${element.nombre_Usuario}</td>
      <td>${element.telefono_Usuario}</td>
      <td>${element.sexo_Usuario}</td>
      <td>${element.fechaN_Usuario}</td>
      <td>${element.ciudadResidencia_Usuario}</td>
      <td>${element.edadUsuario}</td>
      <td><button onclick='eliminar(${element.id})' class='btn btn-danger'>Eliminar</button></td>
    `;
    tbody.appendChild(row);
  });
}

function eliminar(index) {
  if (index >= 0 && index < arregloObjetos.length) {
    arregloObjetos.splice(index, 1);

    for (let i = 0; i < arregloObjetos.length; i++) {
      arregloObjetos[i].setId(i);
    }

    guardarEnLocalStorage('users', arregloObjetos);
    MostrarInstancia();
  } else {
    console.log("Índice fuera de los límites del arreglo: " + index);
  }
}

window.addEventListener("load", function () {
  recuperarDatosLocalStorage();
  inicializacion();
}, false);
