<?php
include 'inc/funciones/sesiones.php';
include 'inc/templates/header.php'; 
include_once 'inc/funciones/funciones.php';
include 'inc/templates/barra.php';

// echo "<pre>";
//     var_dump($_SESSION);
// echo "</pre>";


//obtener el id de la URL
if(isset($_GET['id_proyecto'])) {
    $id_proyecto = $_GET['id_proyecto'];
} 


?>





<div class="contenedor">

    <?php include 'inc/templates/sidebar.php';?>

    <main class="contenido-principal">
        
            <?php
                $proyecto = obtenerNombreProyecto($id_proyecto);
                if($proyecto): ?>
                <h1>      
                        <?php foreach($proyecto as $nombre): ?>
                            <span><?php echo $nombre['nombre']; ?></span>
                                

                <?php endforeach; ?>
                
            </h1>

            <form action="#" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                </div>
                <div class="campo enviar">
                    <input type="hidden" value="<?php echo $id_proyecto; ?>" id="id_proyecto">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>
        
        <?php
            else:
                //si no hay proyectos seleccionados
                echo "<p>Selecciona un proyecto a la izquierda</p>";
            endif;

        ?>
 

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
            <?php
                //obtiene las tareas del proyecto actual
                $tareas = obtenerTareasProyecto($id_proyecto);
                if($tareas->num_rows > 0) {
                    //si hay tareas
                    foreach($tareas as $tarea): ?>
                        <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                        <p><?php echo $tarea['nombre'] ?></p>
                            <div class="acciones">
                                <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : '') ?>"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        </li>

                    <?php endforeach;
                } else {
                    //no hay tareas
                    echo "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                }

            ?>
                  
            </ul>
        </div>
        <div class="avance">
                <h2 class="porcentajeAvance"></h2>
                <div id="barra-avance" class="barra-avance">
                    <div id="porcentaje" class="porcentaje">
                    </div>
                </div>
        </div>
    </main>
</div><!--.contenedor-->


<?php include 'inc/templates/footer.php'; ?>