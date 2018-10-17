function quoteText(info, tab) {
  chrome.tabs.query( {active: true}, function(tabs) {
    chrome.tabs.sendMessage(
      tab.id, 
      { action: "quote_text", text: info.selectionText }, 
      function(response) {}
    );
  });
}

var showForPages = ["https://mail.google.com/*"];

chrome.contextMenus.create( {
  title:    "Quote Text", 
  contexts: [ "selection" ], 
  onclick:  quoteText,
  "documentUrlPatterns": showForPages
} );