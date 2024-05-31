const crypto = require('bcrypt');
class User{
  #password
  constructor(data){
    this.email = data.email;
    this.#password = data.password;
    this.cedula = data.cedula;
    this.name = data.name;
    this.lastname = data.lastname;
    this.conect = data.Conection;
    this.table = data.table
    this.status = false;
  }

  async register(){
    try {
      if(!this.cedula || !this.name || !this.lastname ) throw new Error("Datos Faltantes")
        const result = await this.conect.findOut(this.table,[this.email,this.cedula])
        //passwordHash se almacena el resultado final de la funcion sethash
        const passwordHash = await this.#sethash(this.#password)
        this.conect.insert(
          this.table,
          ["cedula","email","password","name","lastname"],
          [this.cedula,this.email,passwordHash,this.name,this.lastname]
        )
    } catch (error) {
      console.log(error)
    }
  }
  async login(){
    try {
      let userData = await this.conect.readsingle(this.table,this.email);
      const compare = await crypto.compare(this.#password,userData[0]["password"])

      if(compare === false )throw new Error("Contraseña Incorrecta")

      this.status = true;
      this.name = userData[0]["name"]
      this.lastname = userData[0]["lastname"]
      this.cedula = userData[0]["cedula"]

    } catch (error) {
      console.log(error)
    }
  }
  async changeProf(index,data){
    try{
      if(!this.status) throw new Error("Debes iniciar sesion")
      const result = await this.conect.readsingle(this.table,[this.email])
      for (const key in index) {
        this.conect.update(this.table,index[key],data[key],result[0]["Id"])
      }
    } catch(error){
      console.log("type",error)
    }
  }

  async recoverPass(){

  }

  async #sethash(password){
      const hash = await crypto.hash(password,8);
      return hash;
  }
}

/*
  
*/

module.exports = { User }