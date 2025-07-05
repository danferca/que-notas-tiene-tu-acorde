// Funciones relacionadas con la interfaz de usuario

export function valorInicial(){
    document.getElementById("alteracion").value = " ";
    document.getElementById("alteracionM").value = " ";    
}

export function filtrarAlteraciones(){
    valorInicial();    
    const tono = document.getElementById("tonos").value;
    if (tono === "B" || tono === "E") {
        document.getElementById("#").style.display = "none";
        document.getElementById("b").style.display = "inline";
    } else if (tono === "C" || tono === "F") {
        document.getElementById("#").style.display = "inline";
        document.getElementById("b").style.display = "none";
    } else {
        document.getElementById("#").style.display = "inline";
        document.getElementById("b").style.display = "inline";
    }
}
