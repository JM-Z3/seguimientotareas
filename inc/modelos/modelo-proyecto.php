<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if($accion === 'crear') {
    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizamos la consulta a la bd
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        //en el caso de un error tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
    
}