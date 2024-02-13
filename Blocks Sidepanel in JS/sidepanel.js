
  document.addEventListener('DOMContentLoaded', function () {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updatePopup') {
          showSuggestions(request.selectedText);

          if(request.selectedText === 'Last male of his kind'){
            document.body.querySelector('#excat-match').style.display = 'block';
            document.body.querySelector('#key-suggestions').style.display = 'none';
          } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              const activeTabId = tabs[0].id;
              chrome.tabs.sendMessage(activeTabId, { action: 'unhighlight' });
            });
            document.body.querySelector('#key-suggestions').style.display = 'block';
            document.body.querySelector('#excat-match').style.display = 'none';
          }
          document.body.querySelector('#select-a-word').style.display = 'none';
          document.getElementById('selectedText').innerText = request.selectedText;
        }
        if (request.action === 'translateDe') {
          document.body.querySelector('#definition-text-de').innerText = request.translatedText;
        }
        if (request.action === 'translateBn') {
          document.body.querySelector('#definition-text-bn').innerText = request.translatedText;
        }

        document.body.querySelector('#suggest-button').addEventListener('click', function () {
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTabId = tabs[0].id;
            chrome.tabs.sendMessage(activeTabId, { action: 'unhighlight' });
          });
          document.body.querySelector('#key-suggestions').style.display = 'block';
          document.body.querySelector('#excat-match').style.display = 'none';
        });
    });

    function showSuggestions(sentence) {

      const suggestions = ["APP_X", "APP_Y", "APP_Z", "APP_KEY_SOMETHING"];

      const chipContainer = document.body.querySelector("#chipContainer");
      chipContainer.innerHTML = '';
  
        for (let i = 0; i < suggestions.length; i++) {
              let chip = document.createElement("div");
              chip.classList.add("chip");
              chip.textContent = suggestions[i];
              chipContainer.appendChild(chip);
              
              if (i === 3) {
                chip.addEventListener('click', function () {
                  document.body.querySelector('#excat-match').style.display = 'block';
                  document.getElementById('selectedText').innerText = 'Last male of his kind';
                  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const activeTabId = tabs[0].id;
                    chrome.tabs.sendMessage(activeTabId, { action: 'highlight', text: 'Last male of his kind' });
                  });
                });
              }else {
                chip.addEventListener('click', function () {
                  document.getElementById('selectedText').innerText = sentence;
                  document.body.querySelector('#excat-match').style.display = 'block';
                  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const activeTabId = tabs[0].id;
                    chrome.tabs.sendMessage(activeTabId, { action: 'unhighlight' });
                  });
                });
              }
       }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

  });

