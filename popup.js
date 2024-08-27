document.addEventListener('DOMContentLoaded', function () {
  const saveButton = document.getElementById('saveImage');
  const invertZoomCheckbox = document.getElementById('invertZoom');
  const zoomSpeedRange = document.getElementById('zoomSpeed');

  // Cargar la configuración guardada
  chrome.storage.local.get(['customImageUrl', 'invertZoom', 'zoomSpeed'], function(data) {
    if (data.customImageUrl) {
      document.getElementById('imageUrl').value = data.customImageUrl;
    }
    if (data.invertZoom !== undefined) {
      invertZoomCheckbox.checked = data.invertZoom;
    }
    if (data.zoomSpeed !== undefined) {
      zoomSpeedRange.value = data.zoomSpeed;
    }
  });

  saveButton.addEventListener('click', async () => {
    const imageUrl = document.getElementById('imageUrl').value;
    const invertZoom = invertZoomCheckbox.checked;
    const zoomSpeed = parseFloat(zoomSpeedRange.value);

    chrome.storage.local.set({ 'customImageUrl': imageUrl, 'invertZoom': invertZoom, 'zoomSpeed': zoomSpeed }, function() {
      console.log('Settings saved');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        if (currentTab) {
          chrome.tabs.reload(currentTab.id);
        }
      });
    });
  });
});




function sendMessage(){
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/api/serverstatus',
    success: function(data, status, xhr) {
      console.log('El servidor esta '+xhr.status);
    },
    error: function(xhr, status, error) {
      console.log('Error al comunicarse con el servidor:', error);
    }
  })
};
setInterval(sendMessage, 1000)