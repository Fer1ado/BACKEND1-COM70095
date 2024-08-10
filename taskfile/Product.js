import {ulid} from "ulid"; 

export default class Product{
    constructor(title, description, price, thumbnail, code, stock,status){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.status= status
        this.id = Product.agregarId()

    }

    static agregarId(){
           /* let date =  Date.now() 
            let number = Math.trunc(Math.random()*(5000 - 1)+1)
            let code =  number + date
            return code */
            let id = ulid()
            return id
    }
    
}