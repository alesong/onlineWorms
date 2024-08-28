document.addEventListener('DOMContentLoaded', function () {
  const saveButton = document.getElementById('saveSettings');
  const restoreIframeDefaultsButton = document.getElementById('restoreIframeDefaults');
  const invertZoomCheckbox = document.getElementById('invertZoom');
  const zoomSpeedRange = document.getElementById('zoomSpeed');

  const defaultIframeSettings = {
    width: 350,
    height: 120,
    bottom: 30,
    right: 30
  };

  function loadSettings() {
    chrome.storage.local.get([
      'customImageUrl',
      'customBgImageUrl',
      'invertZoom',
      'zoomSpeed',
      'iframeWidth',
      'iframeHeight',
      'iframeBottom',
      'iframeRight'
    ], function(data) {
      document.getElementById('imageUrl').value = data.customImageUrl || '';
      document.getElementById('bgImageUrl').value = data.customBgImageUrl || '';
      invertZoomCheckbox.checked = data.invertZoom || false;
      zoomSpeedRange.value = data.zoomSpeed || 1;
      document.getElementById('iframeWidth').value = data.iframeWidth || defaultIframeSettings.width;
      document.getElementById('iframeHeight').value = data.iframeHeight || defaultIframeSettings.height;
      document.getElementById('iframeBottom').value = data.iframeBottom || defaultIframeSettings.bottom;
      document.getElementById('iframeRight').value = data.iframeRight || defaultIframeSettings.right;
    });
  }

  function saveSettings() {
    const settings = {
      customImageUrl: document.getElementById('imageUrl').value,
      customBgImageUrl: document.getElementById('bgImageUrl').value,
      invertZoom: invertZoomCheckbox.checked,
      zoomSpeed: parseFloat(zoomSpeedRange.value),
      iframeWidth: parseInt(document.getElementById('iframeWidth').value),
      iframeHeight: parseInt(document.getElementById('iframeHeight').value),
      iframeBottom: parseInt(document.getElementById('iframeBottom').value),
      iframeRight: parseInt(document.getElementById('iframeRight').value)
    };

    chrome.storage.local.set(settings, function() {
      console.log('Settings saved');
      applySettings(settings);
    });
  }

  function applySettings(settings) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateIframe",
        settings: settings
      });
    });
  }

  function restoreIframeDefaults() {
    document.getElementById('iframeWidth').value = defaultIframeSettings.width;
    document.getElementById('iframeHeight').value = defaultIframeSettings.height;
    document.getElementById('iframeBottom').value = defaultIframeSettings.bottom;
    document.getElementById('iframeRight').value = defaultIframeSettings.right;
  }

  loadSettings();

  saveButton.addEventListener('click', saveSettings);
  restoreIframeDefaultsButton.addEventListener('click', restoreIframeDefaults);
});