const fs = require('node:fs/promises');
const pdf = require('pdf-parse');


const databuffer = async () => {
    try{
        const text = await fs.readFile(".\\js\\cinu.pdf");
        const buffer = Buffer.from(text);
        return buffer;
    }catch(err){
        if(err.code === "ENOENT"){
            console.log("Error: archivo no encontrado");
        }else{
            console.log("Error al leer el archivo:",err);
        }
        throw err;
    }
}
const read = async () =>{
    try{
        const info = await databuffer();
        const data = await pdf(info);
        console.log(data.text);
    }catch(err){
        console.log("ha ocurrido el siguiente error",err.code);
    }
}
read()