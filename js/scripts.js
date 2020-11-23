eventListeners();

//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    //Document ready
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });
    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);


    //boton para una nueva tarea
    //se agrega en una variable y luego en un if, ya que cuando logueas, como no hay proyecto elegido, el boton de agregar tarea no existe, y te tira un error en el DOM porq no lo encuentra
    let agregarTareaListener = document.querySelector('.nueva-tarea');
    if(agregarTareaListener) {
        agregarTareaListener.addEventListener('click', agregarTarea);
    }

    //botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    //crea un input para el nombre del nuevo nuevoProyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);


    //seleccionar el id con el nuevoProyecto

    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al presionar enter crear el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.wich || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    // console.log(nombreProyecto);

    //enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    //crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //en la carga
    xhr.onload = function() {
        if (this.status === 200) {
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //comprobar la insercion
            if (resultado === 'correcto') {
                //fue exitoso
                if (tipo === 'crear') {
                    //se creo un nuevo proyecto
                    //inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    //agrear al html
                    listaProyectos.appendChild(nuevoProyecto);

                    //enviar alerta
                    swal({
                            title: 'Proyecto creado',
                            text: 'El proyecto: ' + proyecto + ' se creo correctamente ',
                            type: 'success'
                        })
                        .then(resultado => {
                            //redireccionar a la nueva URL
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })
                } else {
                    //se actualizo o elimino
                }
            } else {
                //hubo error
                swal({
                    title: 'error',
                    text: 'Hubo un error',
                    type: 'error'
                });
            }
        }
    }

    //enviar el request 
    xhr.send(datos);

}


//agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();


    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //validar que el campo tenga algo escrito
    if (nombreTarea === '') {
        swal({
            title: 'Oops!',
            text: 'El campo no puede estar vacio',
            type: 'error',
        })
    } else {
        //la tarea tiene algo, insertar en PHP

        //crear llamado a ajax
        var xhr = new XMLHttpRequest();

        //crear formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //ejecutarlo y respuesta
        xhr.onload = function() {
                if (this.status === 200) {
                    //todo correcto
                    var respuesta = JSON.parse(xhr.responseText);
                    //asignar valores
                    var resultado = respuesta.respuesta,
                        tarea = respuesta.tarea,
                        id_insertado = respuesta.id_insertado,
                        tipo = respuesta.tipo;

                    if (resultado === 'correcto') {
                        //se agrego correctamente
                        if (tipo === 'crear') {
                            //lanzar alerta
                            swal({
                                title: 'tarea creada',
                                text: 'La tarea :' + tarea + 'se creo correctamente',
                                type: 'success',
                            })

                            //seleccionar el parrafo con la lista vacia 
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }

                            //construir template
                            var nuevaTarea = document.createElement('li');

                            //agregamos el ID
                            nuevaTarea.id = 'tarea:' + id_insertado;

                            //agregar la clase tarea
                            nuevaTarea.classList.add('tarea');

                            //construir el HTML
                            nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                            //agregarlo al HTML
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);
                            //actualizando la barra de progreso cada vez que se crea una tarea
                            actualizarProgreso();

                            //limpiar el formulario
                            document.querySelector('.agregar-tarea').reset();

                        }
                    } else {
                        //hubo un error
                        swal({
                            title: 'Oops!',
                            text: 'Error',
                            type: 'error',
                        })
                    }
                }
            }
            //Enviar la consulta
        xhr.send(datos);
    }
}


//cambia el estado de las tareas o las elimina ESTO ESTA BUENISIMO
function accionesTareas(e) {
    e.preventDefault();
    // console.log(e.target);
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    if (e.target.classList.contains('fa-trash')) {
        Swal({
            title: 'Seguro (a)?',
            text: "Esta accion no se puede deshacer",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;
                //borrar de la base de datos
                eliminarTareaBD(tareaEliminar);
                //borrar del HTML
                tareaEliminar.remove();
                //actualizando la barra de progreso cada vez que se elimina una tarea
                actualizarProgreso();

                Swal(
                    'Tarea eliminada!',
                    'Tu tarea ha sido eliminada pa!',
                    'success'
                )
            }
        })
    }

}


//Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');

    //crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);


    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //onload
    xhr.onload = function() {
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));
            //actualizar la barra de progreso cada vez que se cambia el estado de una tarea
            actualizarProgreso();
        }
    }

    //enviar la peticion
    xhr.send(datos);

}


//elimina las tareas de la BD
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');

    //crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');


    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //onload
    xhr.onload = function() {
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));

            //comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";

                //estas dos las agrego, para que cuando quede solo una tarea marcada en completa y la eliminemos, la barra de progreso se vaya a 0, sino no se va a 0, queda en 100%.
                //no queda bien, hace como un salto raro, habria que identificar porque.
                const porcentajeEnCero = document.querySelector('#porcentaje');
                porcentajeEnCero.style.width = '0%';

            }
        }
    }

    //enviar la peticion
    xhr.send(datos);

    
}


//actualiza el avance del proyecto
function actualizarProgreso() {
    //obtener cantidad de tareas
    const tareas = document.querySelectorAll('li.tarea');
    // console.log(tareas.length);

    //obtener cuales son las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');
    // console.log(tareasCompletadas.length);

    //determinar el avance (haciendo la cuenta matematica para que me de el porcentaje adecuado, es una regla de 3 simple) el math.round esta para redondear y que no quede 33.3333333333 en algunos casos cuando hay 3 tareas solas por ejemplo, se puede hacer sin ese math.round y anda bien tmb
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    // console.log(avance);
    
    //asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    
    //cuando creas la primer tarea, en avance del proyecto como aun no hay tareas, la variable avance no hace ninguna cuenta y arroja un error de NaN, esta funcion sirve para
    //chequear esto, si esta sin tareas, en vez de hacer la cuenta de la var avance, te carga 0%. (la funcion isNaN arroja true o false (true es que no es numero y false si))
    if(isNaN(avance) === true) {
        const porcentajeAvance = document.querySelector('.porcentajeAvance');
            porcentajeAvance.innerHTML = `
            <span>Avance del proyecto: 0%</span>
            `;
    } else {
        const porcentajeAvance = document.querySelector('.porcentajeAvance');
            porcentajeAvance.innerHTML = `
            <span>Avance del proyecto: ${avance}%</span>
            `;
    }
}