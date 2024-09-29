function obtenerIP() {
  
  return 'http://localhost:3000';
  //return 'ws://45.173.12.90:3000';
}

console.log('Socket.IO script loaded');
console.log('io object:', io);

const socket = io(obtenerIP(), {'forceNew': true});

socket.on('connect_error', function(error) {
  console.error('Error de conexión:', error);
});

socket.on('message', function(data) {
  //console.log(data);
  data.forEach(msg => {
    // Convierte el timestamp a la hora local del usuario
    msg.fecha = new Date(msg.fecha).toLocaleString();
  });
  cargarMensajes(data);
  const sonido = new Audio('message.mp3');
  sonido.play();
  //ultimomsg
  let ultimomsg = data.length - 1;
  hablar(data[ultimomsg].msg);
})



//-------------tts


document.documentElement.lang = 'es';


function obtenerConfiguracion(callback) {
       
      
  callback({
      velocidad: 1.2,
      volumen: 1,
      vozIndex: 5
  });

}

// Función para hablar usando la configuración guardada
function hablar(texto) {
obtenerConfiguracion(function(config) {
  return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es';
      utterance.rate = parseFloat(config.velocidad);
      utterance.volume = parseFloat(config.volumen);
      
      function setVoiceAndSpeak() {
          const voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
              utterance.voice = voices[config.vozIndex];
              speechSynthesis.speak(utterance);
          } else {
              setTimeout(setVoiceAndSpeak, 100); // Intentar de nuevo si las voces no están listas
          }
      }

      if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      } else {
          setVoiceAndSpeak();
      }

      utterance.onend = resolve;
  });
});
}

//------------fin tts

// Selecciona el elemento que quieres observar
const elemento = document.getElementById('game-view');

// Crea una instancia de MutationObserver
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.attributeName === 'style') {
            const displayStyle = window.getComputedStyle(elemento).display;
            if (displayStyle === 'none') {
                console.log('El elemento se ha ocultado');
            }
            if (displayStyle === 'block') {
                console.log('El elemento se ha mostrado');
              
            }
        }
    }
});



//--------------------------------------------


// Objeto para almacenar todos los usuarios únicos
let todosLosUsuarios = {};

// Escuchar el evento de actualización de usuarios desde el servidor
socket.on('actualizacion-usuarios', function(usuarios) {
  console.log('Usuarios actualizados:', usuarios);
  
  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    console.error('No se recibieron usuarios válidos');
    return;
  }

  // Actualizar el objeto todosLosUsuarios con los nuevos usuarios
  usuarios.forEach(user => {
    todosLosUsuarios[user.socketId] = user;
  });

  actualizarInterfazUsuarios();
});

function actualizarInterfazUsuarios() {
  const boxTitle = document.getElementById('boxTitle');
  const boxPopup = document.getElementById('boxPopup');

  // Limpiar contenido existente
  boxTitle.innerHTML = '';
  boxPopup.innerHTML = '';

  Object.values(todosLosUsuarios).forEach(user => {
    // Crear elemento de lista para el nickname
    let listItem = document.createElement('li');
    listItem.id = `user-${user.socketId}`;
    listItem.textContent = user.nickname;

    // Crear popup
    let popup = document.createElement('div');
    popup.id = `popup-${user.socketId}`;
    popup.className = 'popup';
    popup.style.display = 'none';

    popup.innerHTML = `
      <div class="realName" data-gest="gest">${user.realName}</div>
      <img class="avatar" src="${user.avatar}" alt="Avatar">
      <div class="nickname">${user.nickname}</div>
      <div class="level">Level: ${parseInt(user.level || '0').toLocaleString()}</div>
      <div class="experience">Exp: ${(user.experience || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
      <div class="botonX">X</div>
    `;

    // Añadir evento para mostrar/ocultar popup
    listItem.addEventListener('click', function(event) {
      event.stopPropagation();
      const allPopups = document.querySelectorAll('.popup');
      allPopups.forEach(p => p.style.display = 'none');
      popup.style.display = 'block';
    });

    // Añadir evento para cerrar popup
    const closeButton = popup.querySelector('.botonX');
    closeButton.addEventListener('click', function(event) {
      event.stopPropagation();
      popup.style.display = 'none';
    });

    boxTitle.appendChild(listItem);
    boxPopup.appendChild(popup);
  });

  // Cerrar todos los popups al hacer clic fuera de ellos
  document.addEventListener('click', function() {
    const allPopups = document.querySelectorAll('.popup');
    allPopups.forEach(popup => popup.style.display = 'none');
  });

  console.log(`Se han añadido ${Object.keys(todosLosUsuarios).length} usuarios al boxTitle.`);
}

// Resto del código...

//-----------------------------------------------------

function cargarMensajes(data) {
  let boxMessage = document.getElementById('boxMessage');
  
  // Verificar si data es null o undefined
  if (!data) {
    console.error('No se recibieron datos para cargar mensajes');
    return;
  }
  
  // Verificar si data es un array
  if (!Array.isArray(data)) {
    console.error('Los datos recibidos no son un array:', data);
    return;
  }

  // Crear un fragmento de documento para mejorar el rendimiento
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < data.length; i++) {
    if (data[i].nickname == '') {
      data[i].nickname = 'Anónimo';
    }
    if (data[i] && data[i].nickname && data[i].msg) {
      let msgDiv = document.createElement('div');
      msgDiv.id = `${i}msg`;
      msgDiv.className = 'boxMsg';
      msgDiv.style.fontSize = '10px';
      
      msgDiv.innerHTML = `
        <span class="boxNickname">${data[i].nickname}</span>
        <span class="boxDate" style="color: #fffc3c; margin-left: 5px;">${data[i].fecha}</span>
        <div class="boxTextMsg">${data[i].msg}</div>
      `;
      
      fragment.appendChild(msgDiv);
    } else {
      console.warn('Mensaje inválido recibido:', data[i]);
    }
  }

  // Añadir todos los nuevos mensajes al final del boxMessage
  boxMessage.appendChild(fragment);
  boxMessage.scrollTop = boxMessage.scrollHeight;
}

function newMessage() {
  const message = $('#inputChat').val();
  const nickname = $('#inputNickname').val();
  $('#inputChat').val('');
  enviarMensaje(nickname, message);
}

$('#inputChat').on('keyup', function(e) {
  if (e.keyCode === 13) {
      newMessage();
  }
})

$('#btnSendChat').on('click', function() {
  newMessage();
})

let inputNickname = document.getElementById('inputNickname');

inputNickname.onchange = function() {
console.log('cambiando nickname');

}

//-------------------------------------------

function cargarNickname() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['nickname', 'idwdata', 'realName', 'level', 'experience', 'avatar'], function(result) {
      if (chrome.runtime.lastError) {
        console.error('Error al cargar datos:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        //console.log('Datos cargados de chrome.storage:', result);
        // Asegurarse de que todos los campos existan, incluso si están vacíos
        const datosCompletos = {
          nickname: result.nickname || '',
          idwdata: result.idwdata || '',
          realName: result.realName || '',
          level: result.level || '',
          experience: result.experience || '',
          avatar: result.avatar || ''
        };
        //console.log('Datos completos a devolver:', datosCompletos);
        resolve(datosCompletos);
      }
    });
  });
}

let datosAnteriores = {};

function actualizarCampos(datos) {
  //console.log('Datos recibidos en actualizarCampos:', datos);

  const campos = [
    {id: 'inputNickname', key: 'nickname'},
    {id: 'inputidwdata', key: 'idwdata'},
    {id: 'realName', key: 'realName'},
    {id: 'level', key: 'level'},
    {id: 'experience', key: 'experience'},
    {id: 'avatar', key: 'avatar'}
  ];

  let cambiados = false;

  campos.forEach(campo => {
    const elemento = document.getElementById(campo.id);
    if (elemento) {
      const valorNuevo = datos[campo.key] !== undefined ? datos[campo.key] : '';
      if (valorNuevo !== datosAnteriores[campo.key]) {
        cambiados = true;
        //console.log(`Campo ${campo.id} ha cambiado de "${datosAnteriores[campo.key]}" a "${valorNuevo}"`);
      }
      elemento.value = valorNuevo;
      datosAnteriores[campo.key] = valorNuevo;
    } else {
      console.warn(`Elemento con ID '${campo.id}' no encontrado`);
    }
  });

  if (cambiados) {
    enviarDatosPorSocket(datos);
  }
}
function enviarDatosPorSocket(datos) {
  //console.log('Enviando datos actualizados por socket:', datos);
  socket.emit('actualizacion-datos', datos);
}

function actualizarDatosPeriodicamente() {
  cargarNickname()
    .then(datos => {
      //console.log('Datos obtenidos de cargarNickname:', datos);
      actualizarCampos(datos);
    })
    .catch(error => console.error('Error al actualizar campos:', error));
}

// Ejecutar la actualización cada 3 segundos
const intervaloActualizacion = setInterval(actualizarDatosPeriodicamente, 3000);

// Ejecutar la actualización inmediatamente al cargar la página
actualizarDatosPeriodicamente();

// Función para detener la actualización periódica si es necesario
function detenerActualizacionPeriodica() {
  clearInterval(intervaloActualizacion);
}

//----------------------------------------------
  
// Conjunto para almacenar los IDs de los mensajes ya mostrados
const mensajesMostrados = new Set();

function parsearFecha(fechaString) {
  const [fecha, hora] = fechaString.split(', ');
  const [dia, mes, anio] = fecha.split('/');
  const [horaCompleta, meridiano] = hora.split(' ');
  let [horas, minutos, segundos] = horaCompleta.split(':');

  // Ajustar las horas si es PM
  if (meridiano.toLowerCase() === 'p. m.' && horas !== '12') {
    horas = parseInt(horas) + 12;
  }
  // Ajustar las 12 AM a 00 horas
  if (meridiano.toLowerCase() === 'a. m.' && horas === '12') {
    horas = '00';
  }

  return new Date(anio, mes - 1, dia, horas, minutos, segundos);
}

function formatearFecha(fechaString) {
  console.log('Fecha recibida:', fechaString);

  if (!fechaString) {
    console.error('Fecha vacía o nula');
    return 'Fecha desconocida';
  }

  const fechaMensaje = parsearFecha(fechaString);
  const ahora = new Date();

  if (isNaN(fechaMensaje.getTime())) {
    console.error('Error al parsear la fecha:', fechaString);
    return 'Fecha inválida';
  }

  console.log('Fecha parseada:', fechaMensaje);

  const esHoy = fechaMensaje.toDateString() === ahora.toDateString();
  const esAyer = new Date(ahora.getTime() - 86400000).toDateString() === fechaMensaje.toDateString();

  const opciones = { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  };
  const hora = fechaMensaje.toLocaleString(undefined, opciones);

  if (esHoy) {
    return `Hoy ${hora}`;
  } else if (esAyer) {
    return `Ayer ${hora}`;
  } else {
    return fechaMensaje.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

function cargarMensajes(data) {
  let boxMessage = document.getElementById('boxMessage');
 
  if (!data || !Array.isArray(data)) {
    console.error('Datos de mensajes inválidos:', data);
    return;
  }
  let fragment = document.createDocumentFragment();
  let nuevosMsg = 0;
  for (let i = 0; i < data.length; i++) {
    const msg = data[i];
    console.log('Mensaje completo recibido:', JSON.stringify(msg));
    if (!msg || !msg.id || !msg.nickname || !msg.msg || !msg.fecha) {
      console.warn('Mensaje inválido recibido:', msg);
      continue;
    }
    // Verificar si el mensaje ya ha sido mostrado
    if (mensajesMostrados.has(msg.id)) {
      continue; // Saltar este mensaje si ya ha sido mostrado
    }
    // Añadir el ID del mensaje al conjunto de mensajes mostrados
    mensajesMostrados.add(msg.id);
    let msgDiv = document.createElement('div');
    msgDiv.id = `msg-${msg.id}`;
    msgDiv.className = 'boxMsg';
    msgDiv.style.fontSize = '10px';
    
    console.log('Fecha original:', msg.fecha);
    const fechaFormateada = formatearFecha(msg.fecha);
   
    msgDiv.innerHTML = `
      <span class="boxNickname">${msg.nickname || 'Anónimo'}</span>
      <span class="boxDate">${fechaFormateada}</span>
      <div class="boxTextMsg">${msg.msg}</div>
    `;
   
    fragment.appendChild(msgDiv);
    nuevosMsg++;
  }
  // Añadir nuevos mensajes solo si hay alguno
  if (nuevosMsg > 0) {
    boxMessage.appendChild(fragment);
    boxMessage.scrollTop = boxMessage.scrollHeight;
    console.log(`Se añadieron ${nuevosMsg} nuevos mensajes.`);    
  } else {
    console.log('No se encontraron nuevos mensajes para añadir.');
  }
}

// Añadir nuevos mensajes solo si hay alguno
if (nuevosMsg > 0) {
  boxMessage.appendChild(fragment);
  boxMessage.scrollTop = boxMessage.scrollHeight;
  console.log(`Se añadieron ${nuevosMsg} nuevos mensajes.`);    
} else {
  console.log('No se encontraron nuevos mensajes para añadir.');
}

// Función para enviar un nuevo mensaje
function newMessage() {
  const message = $('#inputChat').val();
  const nickname = $('#inputNickname').val();
  $('#inputChat').val('');
  //const fecha = new Date().toLocaleString();
  const id = Date.now().toString(); // Usar timestamp como ID único
  enviarMensaje(nickname, message, id);
}

// Función modificada para enviar mensaje
function enviarMensaje(nickname, message, id) {
  if (message.trim() !== '') {
    socket.emit('new-message', {
      id: id,
      nickname: nickname,
      msg: message,
      fecha: ""
    });
  } else {
    console.warn('Intento de enviar mensaje vacío');
  }
}






