import cartRoute from "./routes/cart.routes.js";
import prodRoute from "./routes/products.routes.js";

import handlebars from "express-handlebars";
import path from "path"
import {Server} from "socket.io"
import ProductManager from "./taskfile/productManager.js";
import displayRoutes from "express-routemap";

/// CONFIG SERVIDOR
import express from "express";
import { _dirname } from "./utils.js";

const app = express()
const PORT = 8080;

// SETEO DE PUERTO
const httpserver = app.listen(PORT, ()=>{
  console.log(`Server listening on port ${PORT}`)
  displayRoutes(app)
})


//IMPLEMENTACION SOCKET IO
const io = new Server(httpserver)

io.on('connection', (socket)=> {
  console.log(`servidor de socket io conectado`)
  console.log(socket.handshake.headers.referer)
  

  socket.on('nuevoProducto', async (nuevoProd) => {
      const response = await manager.addProduct(nuevoProd)
      console.log(response)
      const products = await manager.getProducts()
      products.reverse()
      socket.emit("status-changed", response)
      socket.emit('products-data', products)
      
  })

  socket.on('update-products', async () => {
      const products = await manager.getProducts()
      products.reverse()
      socket.emit('products-data', products);
  });

  socket.on('remove-product', async (code) => {
      console.log("inicio remove socket")
      const response = await manager.deleteProduct(code) ;
      console.log(response)
      socket.emit("status-changed", response)
      const products = await manager.getProducts();
      products.reverse()
      socket.emit('products-data', products);
      console.log("fin remove socket")
  })
})


// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static(_dirname + "/public"))
app.use('/realtimeproducts', express.static(path.join(_dirname, '/public')))
app.use('/products', express.static(path.join(_dirname, '/public')))



// CONFIG HANDLEBARS
app.engine("handlebars", handlebars.engine())
app.set("views", path.resolve(_dirname, "./views"))
app.set("view engine", "handlebars")


//Saludo
app.get("/", (req,res)=>{
res.render("index", {})
})

// VISTAS
app.get("/realtimeproducts", (req, res) => {
  res.render ("realtimeproducts", {name: "Realtime Products - Socket.io", js:"js/rtprod.js" } )
})

app.get("/products", async (req, res)=> {
  const listado = await manager.getProducts()
  res.render("products",{name: "listado productos", js:"js/listado.js", ...listado})
  console.log("listado")
})

//ROUTES
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoute)



const manager = new ProductManager()