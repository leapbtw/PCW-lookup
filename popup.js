// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const automaticRedirectionCheckbox = document.getElementById('automaticPokemonRedirection');
    const pcwRedirectionCheckbox = document.getElementById('pcwRedirection');
  
    // Get the current status of the toggles from storage and update the checkboxes
    chrome.storage.sync.get(['automaticRedirection', 'pcwRedirection'], function(result) {
      const automaticRedirection = result.automaticRedirection ?? true;
      const pcwRedirection = result.pcwRedirection ?? true; // Impostiamo a true il valore predefinito
  
      automaticRedirectionCheckbox.checked = automaticRedirection;
      pcwRedirectionCheckbox.checked = pcwRedirection;
  
      // Aggiorniamo il valore predefinito nello storage se non esiste ancora
      if (result.automaticRedirection === undefined) {
        chrome.storage.sync.set({ automaticRedirection: true });
      }
  
      if (result.pcwRedirection === undefined) {
        chrome.storage.sync.set({ pcwRedirection: true });
      }
    });
  
    // Update the storage when checkboxes are changed
    automaticRedirectionCheckbox.addEventListener('change', function() {
      const automaticRedirection = automaticRedirectionCheckbox.checked;
      chrome.storage.sync.set({ automaticRedirection });
    });
  
    pcwRedirectionCheckbox.addEventListener('change', function() {
      const pcwRedirection = pcwRedirectionCheckbox.checked;
      chrome.storage.sync.set({ pcwRedirection });
    });
  });
  