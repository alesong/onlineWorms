
//contentwwc.js
let query = window.location.search; // "?name=Pedro&age=25"
console.log(query);
// Crear un objeto URLSearchParams con la consulta
let params = new URLSearchParams(query);

// Obtener el valor del parámetro name
let key = params.get("key"); // "Pedro"
console.log(key);
if (key) {
  console.log("si");
  let card = document.querySelector("body div article .card");
  card.style.display="block";

  let campo = document.querySelector("body div article .card div form div input");
  campo.value=key;

  let boton = document.querySelector("body div article .card div form button");
  console.log(boton);
  boton.click();

  function regreso() {
    window.location.href = 'https://wormate.io/';
  }

  setTimeout(regreso, 5000);


}
