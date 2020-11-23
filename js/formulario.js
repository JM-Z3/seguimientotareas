eventListerners();

function eventListerners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}


function validarRegistro(e) {
    e.preventDefault();
    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        //fallo
        swal({
            title: 'Oops!',
            text: 'Ambos campos deben ser completados',
            type: 'error',
        })
    } else {
        // ambos campos son correctos, mandar ejecutar ajax

        //datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // console.log(datos);

        //llamado a ajax
        var xhr = new XMLHttpRequest();

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                //si la respuesta es correcta
                if (respuesta.respuesta === 'correcto') {
                    //si es un nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        swal({
                            title: 'usuario Creado',
                            text: 'El usuario se creo correctamente',
                            type: 'success'
                        })
                        .then(resultado => {
                            if (resultado.value) {
                                window.location.href = 'login.php';
                            }
                        })
                    } else if (respuesta.tipo === 'login') {
                        swal({
                                title: 'usuario logueado',
                                text: 'El usuario se logueo correctamente',
                                type: 'success'
                            })
                            .then(resultado => {
                                if (resultado.value) {
                                    window.location.href = 'index.php';
                                }
                            })
                    }
                } else {
                    //hubo un error
                    swal({
                        title: 'error',
                        text: 'Hubo un error',
                        type: 'error'
                    });
                }
            }
        }

        //enviar la peticion
        xhr.send(datos);


    }

}