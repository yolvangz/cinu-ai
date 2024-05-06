const fs = require('node:fs');
const pdf = require('pdf-parse');


let databuffer = fs.readFileSync("ruta del archivo.pdf");

pdf(databuffer).then((data) => {
    let info = data.text; 
    console.log(info);
})
.catch((error) => {
    console.log(error)
}) 