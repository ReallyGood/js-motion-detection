var originalWindow,
	popupWindow,
	activeTab,
	dReload  = _.debounce(chrome.tabs.reload, 1000, true);
	dExecute = _.debounce(chrome.tabs.executeScript, 1000, true);

chrome.windows.getLastFocused(function(win){
	originalWindow = win;
})

chrome.browserAction.onClicked.addListener(function() {
	chrome.windows.create({'url': 'app.html', 'type': 'popup'}, function(win) {
		popupWindow = win;
	});
});

chrome.tabs.onActivated.addListener(function(tab) {
	if(!popupWindow) return;
	if(tab.windowId === popupWindow.id) return;
	chrome.tabs.get(tab.tabId, function(tabDetails){
		if(/^chrome/.test(tabDetails.url)) return;
		activeTab = tab;
	});
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type == 'refreshActiveTab' && activeTab) {
		dReload(activeTab.tabId, null, function(){
			sendResponse({success: true});
		});
	}

	if (request.type == 'backActiveTab' && activeTab) {
		dExecute(activeTab.tabId, {code: 'history.back();'}, function(){
			sendResponse({success: true});
		});
	}

	return true;
});