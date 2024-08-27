// content.js



window.addEventListener('load', (event) => {
  const tryToModifyContent = () => {
    chrome.storage.local.get('customImageUrl', function(data) {
      const imageUrl = data.customImageUrl || chrome.runtime.getURL('banner.png');

      const targetDiv = document.getElementById('aqnvgcpz05orkobh');
      if (targetDiv) {
        targetDiv.innerHTML = `<img src="${imageUrl}" style="width:100%;">`;
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


function createElementFrame() {
  const boxFrame = document.createElement('iframe');
  boxFrame.src = chrome.runtime.getURL('frame.html');
  boxFrame.id = 'boxFrame';
  boxFrame.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999;
        width: 350px;
        height: 120px;
        background-color: rgba(0, 0, 00, 0.25);
        border-radius: 5px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        padding: 5px;
        border: solid 1px rgba(255, 255, 255, 0.25);
        overflow: hidden;
        box-sizing: border-box;
    `;
  document.body.appendChild(boxFrame);
  
  
}
createElementFrame();

// Guardar el Ninkname en storage para ser consultado desde el archivo frame.js
setInterval(() => {
  nickname = $('#mm-params-nickname').val()
  chrome.storage.sync.set({
    nickname: nickname
  });
}, 5000);