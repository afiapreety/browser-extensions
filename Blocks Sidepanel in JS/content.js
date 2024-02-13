// content.js

// Highlighting 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'highlight') {
      console.log('Received text in content script:', request.text);
      highlightText(request.text);
  }else if(request.action === 'unhighlight'){
    removeHighlight();
  }
});

const searchPageContent = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, th, caption, span, button, strong, em, div:not(:has(a)), pre, code, br, hr, input, select, textarea, option');

function highlightText(text) {
    for (let i = 0; i < searchPageContent.length; i++) {
        const element = searchPageContent[i];
        console.log('highlightText '+text)
        if (element.tagName.toLowerCase() !== ('a' | 'img')) {
            const innerHTML = element.innerHTML;
            const highlightedHTML = innerHTML.replace(new RegExp(text, 'gi'), match => `<span class="highlight">${match}</span>`);
            element.innerHTML = highlightedHTML;
        }
    }
}

function removeHighlight() {
  const highlightedElements = document.querySelectorAll('.highlight');

  highlightedElements.forEach(element => {
      const parent = element.parentNode;
      parent.replaceChild(document.createTextNode(element.textContent), element);
  });
}

// sending to ChatGPT

let selectedText = '';

const apiUrl = 'https://stg-microservices.selise.biz/api/blocks-assistant/BlocksAssistant/Assistant/AiCompletion';
const apiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiI4NjU2RDg1Ri1DM0UwLTQ4QUEtOTUwNS02NTQ1MDUwOTZBRUMiLCJzdWIiOiI4ODg4YjJlMi01MTQ2LTQzMmEtYTZmNC1jNWU4ZjVjNGMzYzEiLCJzaXRlX2lkIjoiQTE1QUQ0NkUtNEUzMy00MUMwLUJFOTctNzVBOEFCNDhGODBEIiwib3JpZ2luIjoiYmxvY2tzLnNlbGlzZXN0YWdlLmNvbSIsInNlc3Npb25faWQiOiJlY2FwLTJiOWY1NjFlLTY5MDQtNDNjMy05Nzg1LTMyNmY5ZjQ0NGE3OCIsInVzZXJfaWQiOiI4ODg4YjJlMi01MTQ2LTQzMmEtYTZmNC1jNWU4ZjVjNGMzYzEiLCJkaXNwbGF5X25hbWUiOiJCbG9ja3MgRXh0ZXJuYWwgVGVzdCIsInNpdGVfbmFtZSI6IlNFTElTRSBCbG9ja3MiLCJ1c2VyX25hbWUiOiJibG9ja3NleHRlcm5hbHRlc3Rfc3RnQHlvcG1haWwuY29tIiwiZW1haWwiOiJibG9ja3NleHRlcm5hbHRlc3Rfc3RnQHlvcG1haWwuY29tIiwicGhvbmVfbnVtYmVyIjoibm8tcGhvbmUiLCJsYW5ndWFnZSI6ImVuLVVTIiwidXNlcl9sb2dnZWRpbiI6IlRydWUiLCJuYW1lIjoiODg4OGIyZTItNTE0Ni00MzJhLWE2ZjQtYzVlOGY1YzRjM2MxIiwidXNlcl9hdXRvX2V4cGlyZSI6IkZhbHNlIiwidXNlcl9leHBpcmVfb24iOiIwMS8wMS8wMDAxIDAwOjAwOjAwIiwicm9sZSI6ImJsb2Nrc2FkbWluXzBjYWFhMGM2LTA0YWUtNDliZS1hNzliLTZiN2FmZDVhNGYwYiIsImhkciI6IlRydWUiLCJvcmdpZCI6IjBjYWFhMGM2LTA0YWUtNDliZS1hNzliLTZiN2FmZDVhNGYwYiIsIm5iZiI6MTcwNzA2MTUzMywiZXhwIjoxNzA3MDYxOTUzLCJpc3MiOiJDTj1FbnRlcnByaXNlIENsb3VkIEFwcGxpY2F0aW9uIFBsYXRmb3JtIiwiYXVkIjoiKiJ9.ZlwKNiZBKlC0f2kcPNHHcqcPdgFaMtEV0PomUDV55hZzrWum8RhKjKq3GKkttsvlHECr3dRUGfq0yIo2GR686C-T5mI_bnDCqqWTUkEta0oXCLLk4s-ROcJIoT_LM-ZvsWN1T1WWBH3Ea29n9zNrgxP6iR2w-n77C9pXwADVPSihsbO5hIVWLsrxe5l9NBcVuzGLQfIQMym-8L2ZrTETHbS46UnGnXVgqfzLV9eGVPdu0r_hLQid0Cg2n3B7JCgv4nUJMZ0kfGcBSwnNTeadt7SUBnXxsd9qbrkuFi851HH8C2JbpNCcs3o4FfiTmwAhxO3NkPGQzWdA0R1dpr2XoA';  // Replace with your actual API key

async function apiRequestGerman(text) {
    const requestData = {
        Message: `The requirement is to translate a user interface element of a webpage.The output should include only the text of the specified element, without any additional text or quotes or punctuation.The element type in question is 'Form Field'.Considering the above, translate the following from English to German:'${selectedText}'.`,
        Temperature: 0.5
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('responseData',responseData)
      let translation = responseData.Content == null ? 'Translation not found' : responseData.Content;
      chrome.runtime.sendMessage({ action: 'translateDe', translatedText: translation });
    } catch (error) {
      console.error('Error in API request:', error);
    }
}

async function apiRequestBangla(text) {
  const requestData = {
      Message: `The requirement is to translate a user interface element of a webpage.The output should include only the text of the specified element, without any additional text or quotes or punctuation.The element type in question is 'Form Field'.Considering the above, translate the following from English to Bangla:'${selectedText}'.`,
      Temperature: 0.5
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Authorization': `bearer ${apiKey}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('responseData',responseData)
    let translation = responseData.Content == null ? 'Translation not found' : responseData.Content;
    // Assuming this code is part of a Chrome extension, send the translation to the background script
    chrome.runtime.sendMessage({ action: 'translateBn', translatedText: translation });
  
  } catch (error) {
    console.error('Error in API request:', error);
  }
}


window.addEventListener('mouseup', function () {
    selectedText = window.getSelection().toString();
    console.log(selectedText);
    if (selectedText.length > 0) {
        console.log(selectedText);
        chrome.runtime.sendMessage({ action: 'updatePopup', selectedText: selectedText });
        // apiRequest(selectedText, language);
        apiRequestGerman(selectedText);
        apiRequestBangla(selectedText);
    }
});


// Replaces the selected text with the translation
function replaceSelectedText(replacementText) {
  var sel, range;
  if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          prevRange = range;
          range.deleteContents();
          range.insertNode(document.createTextNode(replacementText));
      }
  }
}


























// var prev = '',
//     prevRange = '';
// const API_KEY = "9226ee4dbbmshebc129e1bee233ep1adc5bjsncbb910c3878c",
// XHR = new XMLHttpRequest();
// XHR.withCredentials = true;

// const language = 'bn';
// let translation = '';

// const pageContent = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span, a, button');


// function apiRequest(text, target = language, source = '') {
//     XHR.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to="
//         + target.toString() +
//         "&api-version=3.0&"
//         + source +
//         "profanityAction=NoAction&textType=plain");
//     XHR.setRequestHeader("content-type", "application/json");
//     XHR.setRequestHeader("x-rapidapi-key", API_KEY);
//     XHR.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    
//     XHR.send(JSON.stringify([{ "text": text }]));
// }
// // Handles the translation response
// XHR.addEventListener("readystatechange", function () {
//     if (this.readyState === this.DONE) {
//         const responseData = JSON.parse(this.responseText)[0];
//         console.log('responseData '+responseData.translations[0].text)
//         translation = responseData.translations[0].text;
//         // replaceSelectedText(translation);
//     }
// });




// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'translate') {

//         // for(let i=0; i < pageContent.length; i++){
//         //     console.log(pageContent[i].innerHTML);
//         //     // pageContent[i].innerHTML =  "Replacing Tag Text";
//         //     // Call the API with the entire page text
//         //     // apiRequest(pageContent[i].innerHTML, language);
//         //     // pageContent[i].innerHTML =  translation;
//         // }    

//         pageContent.forEach(element => {
//             // const textContent = element.innerText;
//             // console.log(element.innerText);
//             const textContent = element.textContent;
//             console.log(textContent);

//             // Call the API with the individual text content
//             apiRequest("Replacing Tag Text", language)
            
//             // Replace the text content with the translation
//             // element.innerText = translation;
//             element.innerText = translation;
//         });
//     }
//   });




// Makes the HTTP request using the selected text as the query string
// function apiRequest(text, target = language, source = '') {
//     XHR.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to="
//         + target.toString() +
//         "&api-version=3.0&"
//         + source +
//         "profanityAction=NoAction&textType=plain");
//     XHR.setRequestHeader("content-type", "application/json");
//     XHR.setRequestHeader("x-rapidapi-key", API_KEY);
//     XHR.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    
//     XHR.send(JSON.stringify([{ "text": text }]));
// }
// // Handles the translation response
// XHR.addEventListener("readystatechange", function () {
//     if (this.readyState === this.DONE) {
//         const responseData = JSON.parse(this.responseText)[0];
//         console.log(responseData)
//         let translation = responseData.translations[0].text;
//         replaceSelectedText(translation);
//     }
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'translate') {
//         let entirePageText = document.body.innerText;
//         console.log(entirePageText);
    
//         // Call the API with the entire page text
//         apiRequest(entirePageText, language);
//     }
//   });

// // Replaces the selected text with the translation
// function replaceSelectedText(replacementText) {
//     document.body.innerText = replacementText;
// }





  

  



  
 
  