function obtenerIP() {
  
  //return 'http://localhost:3000';
  return 'ws://45.173.12.90:3000';
}

console.log('Socket.IO script loaded');
console.log('io object:', io);

const socket = io(obtenerIP(), {'forceNew': true});

socket.on('message', function(data) {
  //console.log(data);
  cargarMensajes(data);
  const sonido = new Audio('message.mp3');
  sonido.play();
  //ultimomsg
  let ultimomsg = data.length - 1;
  hablar(data[ultimomsg].msg);
})

socket.on('connect_error', function(error) {
  console.error('Error de conexión:', error);
});

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


// Escuchar el evento de actualización de usuarios desde el servidor
socket.on('actualizacion-usuarios', function(usuarios) {
  console.log('Usuarios actualizados:', usuarios);
  // Aquí puedes actualizar la interfaz con los datos de los usuarios
  const boxTitle = document.getElementById('boxTitle');
  boxTitle.innerHTML = '';
  const boxPopup = document.getElementById('boxPopup');
  boxPopup.innerHTML = '';
  for (let i = 0; i < usuarios.length; i++) {
    const user = usuarios[i];

    // Crear elemento de lista para el nickname
    const listItem = document.createElement('li');
    listItem.id = user.socketId;
    listItem.innerHTML = user.nickname;

    listItem.onclick = function() {
      $(`.popup`).fadeOut(0);
      const clickedElement = this; // Referencia al elemento clickeado
      const socketId = clickedElement.id; // Extraer socketId
      $(`#${socketId}popup`).fadeIn(); // Mostrar popup correspondiente
    };

    $('#boxTitle').append(listItem);

    let popup = document.createElement('div');
    popup.id = usuarios[i].socketId+'popup';
    
    let elemento = document.getElementById('boxPopup');
    elemento.appendChild(popup);
    $('#'+usuarios[i].socketId+'popup').addClass('popup');
    
    let realName = document.createElement('div');
    realName.id = usuarios[i].socketId+'realName';
    realName.dataGest = 'gest';
    realName.innerHTML = usuarios[i].realName;
    popup.appendChild(realName);
    $('#'+usuarios[i].socketId+'realName').addClass('realName');

    let avatar = document.createElement('img');
    avatar.id = usuarios[i].socketId+'avatar';
    avatar.src = usuarios[i].avatar;
    popup.appendChild(avatar);
    $('#'+usuarios[i].socketId+'avatar').addClass('avatar');

    

    let nickname = document.createElement('div');
    nickname.id = usuarios[i].socketId+'nickname';
    nickname.innerHTML = usuarios[i].nickname;
    popup.appendChild(nickname);
    $('#'+usuarios[i].socketId+'nickname').addClass('nickname');

    let level = document.createElement('div');
    level.id = usuarios[i].socketId+'level';
    //separador de miles
    level.innerHTML = 'Level: ' + usuarios[i].level.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    popup.appendChild(level);
    $('#'+usuarios[i].socketId+'level').addClass('level');

    let experience = document.createElement('div');
    experience.id = usuarios[i].socketId+'experience';
    //separador de miles
    experience.innerHTML = 'Exp: ' + usuarios[i].experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    popup.appendChild(experience);
    $('#'+usuarios[i].socketId+'experience').addClass('experience');

    let botonX = document.createElement('div'); 
    botonX.id = usuarios[i].socketId+'botonX';
    botonX.innerHTML = 'X';
    popup.appendChild(botonX);
    $('#'+usuarios[i].socketId+'botonX').addClass('botonX');
    $('#'+usuarios[i].socketId+'botonX').on('click', function() {
      $('.popup').fadeOut();
    });

  }//fin for
});

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
  const fecha = new Date();
  enviarMensaje(nickname, message, fecha);
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
    if (!msg || !msg.id || !msg.nickname || !msg.msg) {
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
    
    msgDiv.innerHTML = `
      <span class="boxNickname">${msg.nickname || 'Anónimo'}</span>
      <span class="boxDate">${msg.fecha || ''}</span>
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

// Función para enviar un nuevo mensaje
function newMessage() {
  const message = $('#inputChat').val();
  const nickname = $('#inputNickname').val();
  $('#inputChat').val('');
  const fecha = new Date().toLocaleString();
  const id = Date.now().toString(); // Usar timestamp como ID único
  enviarMensaje(nickname, message, fecha, id);
}

// Función modificada para enviar mensaje
function enviarMensaje(nickname, message, fecha, id) {
  if (message.trim() !== '') {
    socket.emit('new-message', {
      id: id,
      nickname: nickname,
      msg: message,
      fecha: fecha
    });
  } else {
    console.warn('Intento de enviar mensaje vacío');
  }
}






