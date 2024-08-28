// content.js

window.addEventListener('load', (event) => {
  const tryToModifyContent = () => {
    chrome.storage.local.get([
      'customImageUrl',
      'customBgImageUrl',
      'iframeWidth',
      'iframeHeight',
      'iframeBottom',
      'iframeRight'
    ], function(data) {
      const imageUrl = data.customImageUrl || chrome.runtime.getURL('banner.png');

      const targetDiv = document.getElementById('aqnvgcpz05orkobh');
      if (targetDiv) {
        targetDiv.innerHTML = `<img src="${imageUrl}" style="width:100%;">`;
      }

      // Apply custom background image
      if (data.customBgImageUrl) {
        document.body.style.backgroundImage = `url('${data.customBgImageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
      }

      // Update iframe size and position
      const boxFrame = document.getElementById('boxFrame');
      if (boxFrame) {
        boxFrame.style.width = (data.iframeWidth || 350) + 'px';
        boxFrame.style.height = (data.iframeHeight || 120) + 'px';
        boxFrame.style.bottom = (data.iframeBottom || 30) + 'px';
        boxFrame.style.right = (data.iframeRight || 30) + 'px';
      }
    });

    

    //Retirar publicidad de la arena y reemplazar por boton RESPAWN
    const specialDiv = document.getElementById('unl6wj4czdl84o9b');
    if (specialDiv) {
      specialDiv.style.boxShadow = 'none';
      specialDiv.style.background = 'none';
      specialDiv.innerHTML = '<center><input type="button" value="RESPAWN" onclick="respawnFn()" style="margin-top:5px;width:120px;background-color:#f7941d;color:#fff;border:0;height:35px;"></center>';
    }
    


    

    
  };
  
  
  setTimeout(tryToModifyContent, 1000);
});




// Función para ocultar el elemento con la clase "mm-merchant-cont"
const hideMerchantCont = () => {
  const elements = document.querySelectorAll('.mm-merchant-cont');
  if (elements.length) {
    elements.forEach(element => {
      element.style.display = 'none';
    });
    console.log('.mm-merchant-cont elements hidden');
  } else {
    // Si el elemento no existe, intenta nuevamente después de un breve retardo
    setTimeout(hideMerchantCont, 500);
  }
}

// Llama a hideMerchantCont inmediatamente y luego si es necesario en intervalos
hideMerchantCont();



function fastActivate(){
  
  //Buscar el ID hasta encontrarlo
  let idw = document.querySelectorAll("#wwc-set-view div div input");
  if (idw.length) {
    const Elemento = idw[0];
    console.log(Elemento.value); 
    const idwdata = Elemento.value;

    //ocultar boton y logo wwc
    let btnActivateWWC = document.querySelectorAll("#load_page_apoiador div button");
    if (btnActivateWWC) {
      btnActivateWWC[0].style.display="none";
      btnActivateWWC[1].style.display="none";
    }
    let imgActivateWWC = document.querySelectorAll("#load_page_apoiador div img");
    if (imgActivateWWC) {
      imgActivateWWC[0].style.display="none";
      imgActivateWWC[1].style.display="none";
    }
    let tituactivatewwc = document.querySelector("#load_page_apoiador div .apoio-aquix h4");
    if (tituactivatewwc) {
      tituactivatewwc.style.display="none";
    }
    // insertar nuevo boton activate con icono
    let idwbox = document.querySelector("#load_page_apoiador div p");
    const banner = chrome.runtime.getURL('banner.png');
    idwbox.innerHTML='<div style="margin-top:50px;margin-bottom:15px;text-align:center;"><a href="https://www.facebook.com/alesongg"><img src="'+banner+'" style="width:64px; border-radius:32px;"></a><form method="get" action="https://wormworld.io/active"><input type="text" value="'+idwdata+'" name="key" style="width:75%;margin-bottom:10px;margin-top:10px"><input class="mm-actions" type="submit" style="width:80%;background-color:#f7941d;color:#fff;border:0;height:35px;border-radius:5px;cursor:pointer" value="Fast Activate"></form></div>';
    
    
  }else{
    console.log('No aparece aún el ID');  
    setTimeout(fastActivate, 500);
  }
  
}
fastActivate();

function updateIframe(settings) {
  const boxFrame = document.getElementById('boxFrame');
  if (boxFrame) {
    boxFrame.style.width = `${settings.iframeWidth}px`;
    boxFrame.style.height = `${settings.iframeHeight}px`;
    boxFrame.style.bottom = `${settings.iframeBottom}px`;
    boxFrame.style.right = `${settings.iframeRight}px`;
  }
}

function applySettings(settings) {
  const targetDiv = document.getElementById('aqnvgcpz05orkobh');
  if (targetDiv) {
    targetDiv.innerHTML = `<img src="${settings.customImageUrl}" style="width:100%;">`;
  }

  if (settings.customBgImageUrl) {
    document.body.style.backgroundImage = `url('${settings.customBgImageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
  }

  updateIframe(settings);
}


function createElementFrame() {
  chrome.storage.local.get([
    'iframeWidth',
    'iframeHeight',
    'iframeBottom',
    'iframeRight'
  ], function(data) {
    const boxFrame = document.createElement('iframe');
    boxFrame.src = chrome.runtime.getURL('frame.html');
    boxFrame.id = 'boxFrame';
    boxFrame.style.cssText = `
          position: fixed;
          bottom: ${data.iframeBottom || 30}px;
          right: ${data.iframeRight || 30}px;
          z-index: 9999;
          width: ${data.iframeWidth || 350}px;
          height: ${data.iframeHeight || 120}px;
          background-color: rgba(0, 0, 00, 0.25);
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          padding: 5px;
          border: solid 1px rgba(255, 255, 255, 0.25);
          overflow: hidden;
          box-sizing: border-box;
      `;
    document.body.appendChild(boxFrame);

    const ojoOpen = document.createElement('div');
    ojoOpen.id = 'ojoOpen';
    ojoOpen.style.cssText = `
          position: fixed;
          bottom: 80px;
          right: 5px;
          z-index: 9999;
          width: 20px;
          height: 20px;
          background-color: rgba(0, 0, 00, 0.25);
          color: #fff;
          text-align: center;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          padding: 0px;
          border: solid 1px rgba(255, 255, 255, 0.25);
          overflow: hidden;
          box-sizing: border-box;
          cursor:pointer;
      `;
    document.body.appendChild(ojoOpen);
    document.getElementById('ojoOpen').innerHTML = '>';
    ojoOpen.addEventListener('click', function() {
      document.getElementById('ojoOpen').style.display = 'none';
      document.getElementById('ojoClose').style.display = 'block';
      document.getElementById('boxFrame').style.display = 'none';
    });

    const ojoClose = document.createElement('div');
    ojoClose.id = 'ojoClose';
    ojoClose.style.cssText = `
          position: fixed;
          bottom: 80px;
          right: 5px;
          z-index: 9999;
          width: 20px;
          height: 20px;
          background-color: rgba(0, 0, 00, 0.25);
          color: #fff;
          text-align: center;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          padding: 0px;
          border: solid 1px rgba(255, 255, 255, 0.25);
          overflow: hidden;
          box-sizing: border-box;
          cursor:pointer;
          display:none;
      `;
    document.body.appendChild(ojoClose);
    document.getElementById('ojoClose').innerHTML = '<';
    ojoClose.addEventListener('click', function() {
      document.getElementById('ojoOpen').style.display = 'block';
      document.getElementById('ojoClose').style.display = 'none';
      document.getElementById('boxFrame').style.display = 'block';
    });
  });
}


window.addEventListener('load', (event) => {
  createElementFrame();
  chrome.storage.local.get(null, function(data) {
    applySettings(data);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateIframe") {
    applySettings(request.settings);
  }
});

// Guardar el Ninkname en storage para ser consultado desde el archivo frame.js
setInterval(() => {
  nickname = $('#mm-params-nickname').val()
  chrome.storage.sync.set({
    nickname: nickname
  });
}, 5000);