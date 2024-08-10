<h1  style="text-align:center" > <font color="red">npm start</font> para levantar el programa </h1> 

---
<h3  style="text-align:center" >----> TESTING ENTREGABLE 2 <---</h3> 

<br>
<h5 style="text-align:center" >Listado de rutas sobre las que se trabajo para la entrega y comentarios</h5> 

<h6 style="text-align:center"> server levantado en (http://localhost:8080) <h6>

| METODO | RUTA | DESCRIPCION | COMMENTARIOS |
| :--- | :---: | :---: |:---: |
| GET  | /  | Saludo  | "listado de rutas activas"  |
| GET | /realtimeproducts | se monto una conexión utilizando socket.io y el motor de plantillas Hadlebars, donde se pueden visualizar ingresos de registros y eliminaciones de registros en tiempo real| la interaccion de ingreso y eliminación de registros se realizó con sweet alert para darle mejor dinámica  |
| GET | /products|  Devuelve listado de productos completos en una direccion y plantilla diferente de handlebars
|PUT| /api/products/upAll| La ruta se utilizó para la actualización automática de número de ID en los productos de la BD | Se incorporaron las recomendaciones realizadas por el profesor, cambiando a una solución mas robusta de generación de ID`s utilizando al libreria ULID |

