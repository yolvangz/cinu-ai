const fs = require('node:fs/promises');
const pdf = require('pdf-parse');


const databuffer = async () => {
  try{
    const text = await fs.readFile("js/cinu.pdf");
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
    const info = await databuffer();
    const data = await pdf(info);
    console.log(data.text);
    return data.text;
}
const chunk = async () => {
  const contenido = await read();
  const tamano = 10000;
  const desplazamiento = 9000;
  const chunks = [];
  for (let i = 0; i < contenido.length; i += desplazamiento) {
      let trozo = contenido.substring(i, i + tamano);
      chunks.push(trozo);
  }
  console.log(chunks)
}
chunk();