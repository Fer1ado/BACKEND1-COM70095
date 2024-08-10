import { promises as fs } from "fs";
import { _dirname } from "../utils.js"
import Cart from "./cart.js"


const cartRoute = `${_dirname}/Json/cart.json`;
const productsRoute = `${_dirname}/Json/products.json`

export default class CartManager {

  constructor() {
    this.carrito = [];
  }

  async getCarrito(cid){
    const cart = JSON.parse(await fs.readFile(cartRoute, "utf-8"));
    try{
        if(!cid){
          console.log("LISTADO DE CARRITOS COMPLETO")
          console.table(cart)
          return {status: "Success", message: "LISTADO COMPLETO DE CARRITOS", cart: cart}
        }
        else{
            const entrega = cart.find((e) => e.cartId === parseInt(cid))
            if(entrega === undefined){
              return {status: "failed", message: "NO HAY CARRITO CON ESE ID"}
            }
            else{
              console.log(entrega)
              return {status: "success", message: `CONTENIDO DE CARRITO CON ID ${cid}`, entrega}
            }
           
        }
    }
    catch(err){
        return{status: "failed", message: err.message}
    }
  }

  async createCart() {
    try{
        const cart = new Cart()
        const parseCart = JSON.parse(await fs.readFile(cartRoute, "utf-8"))
        const remplazo = parseCart.concat(cart)
        await fs.writeFile(cartRoute, JSON.stringify(remplazo, null, 2))
        return{status: "success", message: "NUEVO CARRITO DE COMPRAS CREADO", carrito: cart}}
    catch(err){
        return{status: "failed", message: err.message}
    }
    }

  async addCarrito(cid, pid) {
    //busco si el id ya tiene un carrito creado
     const added = await this.isAdded(cid,pid)
    //dejo a disposición el contenido del cart.json
    const parseCart = JSON.parse(await fs.readFile(cartRoute, "utf-8"));
    const parseProduct = JSON.parse(await fs.readFile(productsRoute, "utf-8"))

  try{
    if ( added === null) {
        console.log("producto inexistente")
      return {status: "failed", message: "NECESITA CREAR UN CARRITO EN TIENDA PARA PODER COMPRAR"}}

    if(added === "agregar al carro"){
    const prod = parseProduct.some(e => e.id === pid);
      if(prod){
        const cart =  parseCart.find((e) => e.cartId === cid);
        const existencia = cart.products
        const item =  {productid: pid, quantity: 1 }
        const nuevoarray = [...existencia, item]
        const nuevoitem = {cartId: cid, products: [...nuevoarray]}
        const nuevoJson = parseCart.filter((e) => e.cartId != cid);
        const remplazo = nuevoJson.concat(nuevoitem);
        await fs.writeFile(cartRoute, JSON.stringify(remplazo, null, 2));
        console.log(`Hay ${item.quantity} unidad del producto ${pid} agregada en Carrito `)
        return {status: "success", message: "SE AGREGARON PRODUCTOS AL CARRITO EXITOSAMENTE", producto: nuevoitem}
      }
      else{
        return{status: "failed", message: "PRODUCTO INEXISTENTE EN BASE DE DATOS"}
      }
    }

    if (added === "aumentar cantidad") {
      const cartToUpdate = parseCart.find(e => e.products.find(prod => prod.productid === pid));
      const edicion = cartToUpdate.products.find(prod => prod.productid === pid)
      const cantidad = cartToUpdate.products.find(prod => prod.productid === pid).quantity
      const final = {...edicion, quantity: cantidad +1}
      const existencia = cartToUpdate.products
      const filtrado = existencia.filter(prod => prod.productid != pid)
      const nuevoarray = [...filtrado, final]
      const objRemplazo = {...cartToUpdate, products: nuevoarray }
      const nuevoJson = parseCart.filter((e) => e.cartId != cid);
      const remplazo = nuevoJson.concat(objRemplazo);
      await fs.writeFile(cartRoute, JSON.stringify(remplazo, null, 2));
      console.log(`Hay ${final.quantity} unidades del producto ${pid} en Carrito `)
      return {status: "success", message: `AUMENTASTE CANTIDAD DEL PRODUCTO ID: ${pid}` , producto: objRemplazo}}
      
    else{
        return {status: "failed", message: "ALGO SALIO MAL Y NO SABEMOS QUE"}}
    } 
    catch(err){
      return {status: "failed", message: err.message}
    }
  }
    
  async isAdded(cid, pid){
      const produ = JSON.parse(await fs.readFile(cartRoute, "utf-8"));
      const cart =  produ.some((e) => e.cartId === cid);
      const contenido = produ.find((e) => e.products.find(e => e.productid === pid))

      if (!cart) {
        console.log("No hay carritos creados con ese id")
        return null;
      } if(contenido === undefined) {
        return ("agregar al carro")
      } else {
        return ("aumentar cantidad")
      }
    }

    async deleteProduct(id) {
    const ID = parseInt(id)
    const producto = JSON.parse(await fs.readFile(this.ruta, "utf-8"));
    const produ = producto.find((prod) => prod.id === ID);

    try{
      if (produ) {
        console.log(`EL SIGUIENTE PRODUCTO HA SIDO ELIMINADO CON EXITO`);
        console.log(produ);
        await fs.writeFile(
          this.ruta,
          JSON.stringify(producto.filter((prod) => prod.id != id))
        )
        return {status: "success", msg: "PRODUCTO ELIMINADO CON EXITO", item: {produ} }
        
      } else {
        return {status: "failed", msg: "PRODUCTO NO ENCONTRADO" };
      }
    }

    catch(e){
      console.error("ERROR AL REALIZAR LA OPERACION", e.message)
    }
  }

  async deleteCart(id) {
    const ID = parseInt(id)
    const parseCart = JSON.parse(await fs.readFile(cartRoute, "utf-8"));
    const produ = parseCart.find((prod) => prod.cartId === ID);



    try{
      if (produ) {
        console.log(`EL SIGUIENTE CARRITO HA SIDO ELIMINADO CON EXITO`);
        console.log(produ);
        await fs.writeFile(
          cartRoute,
          JSON.stringify(parseCart.filter((prod) => prod.id != id))
        )
        return {status: "success", msg: "CARRITO ELIMINADO CON EXITO", item: {produ} }
        
      } else {
        return {status: "failed", msg: "CARRITO NO ENCONTRADO" };
      }
    }

    catch(e){
      console.error("ERROR AL REALIZAR LA OPERACION", e.message)
    }
  }


}



const carro = new CartManager()