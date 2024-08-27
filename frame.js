
//---------------Chat------------------------------------------

document.body.style.margin = 0;



//crear elementos para chat
function createElementChat() {
   
    const boxUsers = document.createElement('div');
    boxUsers.id = 'boxUsers';
    boxUsers.style.cssText = `
          height: 100px;
          width: 25%;
          position: absolute;
          padding: 2px;
          //border: solid 1px rgba(255, 255, 255, 0.025);
      `;
    document.body.appendChild(boxUsers);

    const boxChat = document.createElement('div');
    boxChat.id = 'boxChat';
    boxChat.style.cssText = `
          height: 100px;
          width: 70%;
          position: absolute;
          left: 28%;
          padding: 2px;
          //border: solid 1px rgba(255, 255, 255, 0.025);
      `;
    document.body.appendChild(boxChat);


    const boxTitle = document.createElement('div');
    boxTitle.id = 'boxTitle';
    boxTitle.style.cssText = `
          height: 99%;
          background-color: rgba(255, 250, 250, 0.2);
          //background-color: rgba(0, 0, 0, 0.2);
          color: #fff;
          font-size: 10px;
          border-radius: 2px;
          padding: 2px;
          overflow-y: auto;
          scrollbar-width: none;
          
      `;
    boxUsers.appendChild(boxTitle);
    
    const boxMessage = document.createElement('div');
    boxMessage.id = 'boxMessage';
    boxMessage.style.cssText = `
          height: 72px;
          //background-color: rgba(255, 250, 250, 0.025);
          background-color: rgba(0, 0, 0, 0.2);
          color: #fff;
          font-size: 10px;
          border-radius: 2px;
          padding: 2px;
          overflow-y: auto;
          scrollbar-width: none;
      `;
    boxChat.appendChild(boxMessage);
  
    const boxInpuChat = document.createElement('input');
    boxInpuChat.type = 'text';
    boxInpuChat.placeholder = 'Type your message...';
    boxInpuChat.id = 'inputChat';
    boxInpuChat.style.cssText = `
          height: 20px;
          background: transparent;
          width: 100%;
          font-size: 11px;
          color: #fff;
          box-sizing: border-box;
          margin-top: 5px;
      `;
    boxChat.appendChild(boxInpuChat);
  
    const boxInpuNicname = document.createElement('input');
    boxInpuNicname.type = 'hidden';
    boxInpuNicname.id = 'inputNickname';
    boxInpuNicname.style.cssText = `
          height: 20px;
          background: transparent;
          width: 100%;
          font-size: 11px;
          color: #fff;
          box-sizing: border-box;
          margin-top: 5px;
      `;
    boxChat.appendChild(boxInpuNicname);
}
createElementChat();

cargarNickname(function(nickname) {
  //console.log('este es el nickname: ' + result.nickname);
  //document.getElementsById('inputNickname').value(nickname)
  document.getElementById('inputNickname').value=nickname
});


 $('#inputChat').on('keyup', function(e) {
   if (e.keyCode === 13) {
       const message = $('#inputChat').val();
       $('#inputChat').val('');
       cargarNickname(function(nickname) {
           //console.log('este es el nickname: ' + result.nickname);
           //document.getElementsById('inputNickname').value(nickname)
           document.getElementById('inputNickname').value=nickname
           enviarMensaje(nickname, message);
       });
    }
});

function cargarNickname(callback) {
  chrome.storage.sync.get(['nickname'], function(result) {
      //console.log('este es el nickname: ' + result.nickname);
      callback(result.nickname);
  });
}

  

  
  function enviarMensaje(nickname, message) {

    let ip = obtenerIP();
 
    $.ajax({
      type: 'GET',
      url: ip+'/api/chat',
      data: {
        nickname: nickname,
        message: message
      },
      success: function(data, status, xhr) {
        console.log('El servidor esta '+xhr.status+ ' '+data);
      },
      error: function(xhr, status, error) {
        console.log('Error al comunicarse con el servidor:', error);
      }
    })
  }

  let ultimomsgguardado;
  let dato;
  let ultimo=0;

  setInterval(() => {

    let ip = obtenerIP();

    $.ajax({
      type: 'GET',
      url: ip+ '/api/chat/mensajes',
      success: function(data, status, xhr) {
        let boxMessage = document.getElementById('boxMessage');
        for (let i = 0; i < data.length; i++) {
            const msg = document.createElement('div');
            msg.id = i+'msg';
            msg.style.cssText = `
              margin-bottom: 5px;
              font-size: 11px;
            `;
            
            boxMessage.appendChild(msg);
            $('#'+i+'msg').html('<span style="color: #fffc3c; margin-right: 5px;">'+data[i].nickname + ':</span> ' + data[i].msg);
            scrollToBottom();

          
        }

        dato = data[data.length-1].id
        ultimomsg(dato);

        
      },
      error: function(xhr, status, error) {
        boxMessage.innerHTML = '<div style="text-align: center;"><h1>😴<h1><H2>Server Sleeping</H2></div>';
      }
    })
  }, 2000);


  

  // Función para mantener el scroll en la parte inferior
function scrollToBottom() {
    boxMessage.scrollTop = boxMessage.scrollHeight;
}


function ultimomsg(dato) {
  const sonido = new Audio('message.mp3');
  if(dato > ultimo) {
    ultimo=dato
    sonido.play();
  }

}

/*
function cargarNickname() {

  let nickname = localStorage.getItem('nickname')
  //console.log(nickname);
  document.getElementById('inputNickname').value=nickname

}

cargarNickname();
*/

setInterval(() => {

  let nickname=document.getElementById('inputNickname').value    

  
  let ip = obtenerIP();
  
  $.ajax({
    type: 'GET',
    data: {'nickname':nickname},
    url: ip+'/api/chat/getUsers',
    success: function(data, status, xhr) {
      document.getElementById('boxTitle').innerHTML='';
      let boxTitle = document.getElementById('boxTitle');
      //console.log(data);

      if(data.length == 0){
        console.log('Vacío');
        
      }
      
      for (let i = 0; i < data.length; i++) {
          const msg = document.createElement('div');
          msg.id = i+'user';
          msg.style.cssText = `
            font-size: 7px;
          `;
          boxTitle.appendChild(msg);
          $('#'+i+'user').html('<span style="color: #fffc3c; margin-right: 5px;">😀 '+data[i].nickname+'</span>');          
      }

    },
    error: function(xhr, status, error) {
      document.getElementById('boxTitle').innerHTML='';
      boxTitle.innerHTML = '<img style="width: 100%; height: 100%;" src="chrome-extension://'+chrome.runtime.id+'/serveroff.jpg">';
    }
  })
}, 5000);

function obtenerIP() {
  //return 'http://localhost:3000';
  //return 'http://192.168.205.243:3000';
  return 'http://45.173.12.90:3000';
}