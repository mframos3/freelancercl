# FREELANCERCL By Quarantinos :rotating_light:

Quarantinos propone una aplicación tipo red social con bulletin board digital. Esto permitea los usuarios que estén buscando algún trabajo freelance u ofreciendo un servicio, el darse a conocer. A su vez, las empresas o particulares que busquen algún servicio o empleo part time, podrán publicar el aviso correspondiente para que los interesados en la oferta puedan enterarse, informarse y postular con facilidad.

## Product Owner :robot:

* **Alejandro Ramírez:** elramirez@uc.cl

## Developers :construction_worker:

* **Matías Ramos:** mframos@uc.cl

* **Nicolás Casassus:** ncasassus@uc.cl

* **Christian Carstens:** ctcarstens@uc.cl 

### Ya Puedes dejar de esperar!

La cuarta versión de freelancercl ya está disponible en tu navegador, solo debes hacer click en el siguiente link y listo!

https://freelancercl.herokuapp.com

Consideraciones a tener:

* La versión 1.0.3 de esta App, presenta a todos los modelos que estarán presentes en una futura versión definitiva de freelancercl. Están ya muy cerca del css definitivo, esta bien avanzado y da una muy buena imágen de cómo va a terminar siendo. El index de Searching Post y Offering Post muestra las publicaciones en forma de grid, mostrando su foto, el título, su contenido y su categoría. Hay pop ups para el inicio de sesión y el register. 

* Las validaciones al crear nuevas entidades, por ejemplo, los caracteres de un nombre, que la fecha de término debe ser mayor a la de inicio (actual), etc. A modo de prueba, dejamos ciertas validaciones  que, posteriormente, serán reafinadas de acuerdo a los requerimientos de la página.

* Para los no registrados, el landing page les muestra los usuarios con más followers y los offering post con mejor rating. Para los registrados, el landing page muestra la actividad de los usuarios que sigue. Además, si nunca han hecho un offering post o un searching post, la página principal los incitará a crearse uno nuevo.

* Creamos un sistema de rating que funciona por medio de los reviews de los offering post. El rating de cada usuario es el promedio de todos las valoraciones de los reviews puestos en los offering post que le pertenecen. A su vez cada offering post tiene un promedio de sus ratings.

* Extrañamente al iniciar sesión en Firefox y Google Chrome, la página se cae. Pero en Safari no hay problemas. Intentamos de arreglarlo pero no supimos bien cómo hacerlo.

* Otro problema que tuvimos con los navegadores, y de nuevo solo funciona en Safari, es para la vista previa de las fotos a subir. En los otros navegadores solo se encuentra el botón.

* Básicamente, está todo lo que se esperaba para esta entrega de la App y más!!! Espero seas feliz navegando por ella.

* El usuario administrador es:  
    email: user1@example.com  
    contraseña: 123456789

* Las barras de busqueda son sensibles a las mayúsculas.

* El mail se manda cuando uno se registra, esta la probabilidad de que se mande a spam.

* El chat tiene a la izquierda la lista de usuarios con los que se tiene una conversación activa, es decir, existe un historial de mensajes entre ambos usuarios. Para chatear con otros usuarios con los que nunca se ha conversado, se hace click en el boton '+' debajo de la lista de usuarios. Al presionar el botón aparecerá una lista de usuarios con los que no se tiene una conversación. Se puede enviar mensajes a estos, y por lo tanto, formarán parte de la lista de ususarios inicial (conversación activa). Si se hace click al botón '-' Se volvera a la lista de usuarios del principio. Si no hay usuarios nuevos con quien conversar, la lista + aparecerá vacía. Se puede enviar mensaje tanto con el botón enviar como con enter.

La tabla follows también fue creada, pero sin vista (ya que no tenía mucho sentido realizarle ahora independiente del usuario, pero están creadas sus partes necesarias para las siguientes entregas del proyecto)

Además, en estos últimos, las relaciones con usuarios se realizaron en base al siguiente modelo: https://nodeontrain.xyz/tuts/relationship_model/

## Licencia 📄

Este proyecto está bajo la Licencia de la Pontificia Universidad Católica de Chile.
