
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'define-word',
      title: 'Open Blocks Sidepanel',
      contexts: ['selection']
    });
  });
  
  chrome.contextMenus.onClicked.addListener((data, tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
  });



  