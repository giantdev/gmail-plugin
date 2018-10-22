//////// Color Addition Feature ///////////

var colorList = ['#0000FF', '#FF0000', '#009900', '#9900FF', '#FF9900'];
var colorAssigned = [];
var savedSel = null;
var savedSelActiveElement = null;

function saveSelection() {
    // Remove markers for previously saved selection
    if (savedSel) {
        rangy.removeMarkers(savedSel);
    }
    savedSel = rangy.saveSelection();
    savedSelActiveElement = document.activeElement;
}

function restoreSelection() {
    if (savedSel) {
        rangy.restoreSelection(savedSel, true);
        savedSel = null;
        window.setTimeout(function() {
            if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
                savedSelActiveElement.focus();
            }
        }, 1);
    }
}

// var bE = null;
// var rp = null;

// function saveRangePosition()
// {
//   	var range=window.getSelection().getRangeAt(0);
//   	var sC=range.startContainer,eC=range.endContainer;

//   	A=[];while(sC!==bE){A.push(getNodeIndex(sC));sC=sC.parentNode}
//   	B=[];while(eC!==bE){B.push(getNodeIndex(eC));eC=eC.parentNode}

//   	return {"sC":A,"sO":range.startOffset,"eC":B,"eO":range.endOffset};
// }

// function restoreRangePosition(rp)
// {
//   	bE.focus();
//   	var sel=window.getSelection(),range=sel.getRangeAt(0);
//   	var x,C,sC=bE,eC=bE;

//   	C=rp.sC;x=C.length;while(x--)sC=sC.childNodes[C[x]];
//   	C=rp.eC;x=C.length;while(x--)eC=eC.childNodes[C[x]];

//   	range.setStart(sC,rp.sO);
//   	range.setEnd(eC,rp.eO);
//   	sel.removeAllRanges();
//   	sel.addRange(range)
// }

// function getNodeIndex(n){var i=0;while(n=n.previousSibling)i++;return i}

function dealBlur(e) {
	saveSelection();
	var html = e.target.innerHTML;
	var newHtml = html.replace(new RegExp('&nbsp;', "g"), ' ');
	newHtml = newHtml.replace(new RegExp('<', "g"), ' ');
	newHtml = newHtml.replace(new RegExp('>', "g"), ' ');

	var re = /(?:^|[ ])%([a-zA-Z0-9_]+)/gm;
	var m;
	while ((m = re.exec(newHtml)) != null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		i = m[0].trim();
		// console.log(i);

		var j = i.substr(1);
		if (colorAssigned[j] == undefined) {
			colorAssigned[j] = colorList[Object.keys(colorAssigned).length % 5];
		}
		
		//Replace All
		var re1 = new RegExp(i, 'g');
		html = html.replace(re1, "<font color=\"" + colorAssigned[j] + "\">" + j + "</font>");
	}

	e.target.innerHTML = html;
	restoreSelection();
}

function initListeners() {
	if (document.querySelectorAll('.dw .editable').length > 0) {
        for (var live_selector of document.querySelectorAll('.dw .editable')) {
	        // live_selector.addEventListener('blur', function (e) {
	        //     dealBlur(e);
	        // });

	        live_selector.addEventListener('keyup', function (e) {
	        	if (e.which == 13 || e.which == 32) {
	            	dealBlur(e);
	            }
	        });
	    }
	}

	if (document.querySelectorAll('.aSt .editable').length > 0) {
		// document.querySelector('.aSt .editable').addEventListener('blur', function(e) {
		// 	dealBlur(e);
		// });

		document.querySelector('.aSt .editable').addEventListener('keyup', function(e) {
			if (e.which == 13 || e.which == 32) {
            	dealBlur(e);
            }
		});
	}
}

var body = document.querySelector('body');

document.addEventListener('click', function(ev) {
	if (ev.target.className.indexOf("bkH") != -1 || ev.target.className.indexOf("bkI") != -1) {
		setTimeout(
			function() {
				if (document.querySelectorAll('.Bk .editable').length > 0) {
					// document.querySelector('.Bk .editable').addEventListener('blur', function(e) {
					// 	console.log('out');
					// 	dealBlur(e);
					// 	bE = document.querySelector('.Bk .editable');
					// 	console.log(document.activeElement);
					// 	rp = saveRangePosition();
					// });

					// document.querySelector('.Bk .editable').addEventListener('focusin', function(e) {
					// 	console.log('in');
					// 	if (bE != null && rp != null) {
					// 		restoreRangePosition(rp);
					// 		bE = null;
					// 		rp = null;
					// 	}
					// });

					document.querySelector('.Bk .editable').addEventListener('keyup', function(e) {
						if (e.which == 13 || e.which == 32) {
				        	dealBlur(e);
				        }
					});
				}
			}, 100
		);
	}
});

function locationHashChanged() {
    if ( location.hash.indexOf("?compose=") != -1) {
        // console.log('composed');
        initListeners();
    } else {
    	// console.log('no composer');
    	colorAssigned = [];
    }
}
window.onload = function() {
	if ( location.href.indexOf("ui=2&view=cm") != -1) {
		var observer = new MutationObserver(function (mutations) {
		    mutations.forEach(function (mutation) {
		       if (document.querySelectorAll('.xr .editable').length > 0) {
					// document.querySelector('.xr .editable').addEventListener('blur', function(e) {
					// 	dealBlur(e);
					// });

					document.querySelector('.xr .editable').addEventListener('keyup', function(e) {
						if (e.which == 13 || e.which == 32) {
			            	dealBlur(e);
			            }
					});
					observer.disconnect();
				}
		    });
		});
		observer.observe(body, {attributes: true, childList: true});
	}
}

rangy.init();
window.onhashchange = locationHashChanged;

/////////////////////// Context Menu for quote text ///////////////////////////////

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  	if (msg.action == 'quote_text' && msg.text != "") {

		// console.log(document.getElementsByClassName("bkH").length);
	  	if (document.getElementsByClassName("bkI").length > 0) {
	  		document.getElementsByClassName("bkI")[0].click();
	  	} else if (document.getElementsByClassName("bkH").length > 0) {
  			document.getElementsByClassName('bkH')[0].click();
	  	}

	  	if (document.querySelectorAll("div.editable").length > 0) {
			document.querySelectorAll(".aX")[0].style.display == 'block';
			document.querySelectorAll("div.editable")[0].focus();

			var sel, range, html = "<blockquote class=\"gmail_quote\" style=\"margin: 0px 0px 0px 0.8ex;border-left: 1px solid rgb(204, 204, 204);padding-left: 1ex;\"><i><font color=\"#666666\">" + msg.text + "</font></i></blockquote>";
		    if (window.getSelection) {
		        // IE9 and non-IE
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            range = sel.getRangeAt(0);
		            range.deleteContents();

		            // Range.createContextualFragment() would be useful here but is
		            // non-standard and not supported in all browsers (IE9, for one)
		            var el = document.createElement("div");
		            el.innerHTML = html;
		            var frag = document.createDocumentFragment(), node, lastNode;
		            while ( (node = el.firstChild) ) {
		                lastNode = frag.appendChild(node);
		            }
		            range.insertNode(frag);
		            
		            // Preserve the selection
		            if (lastNode) {
		                range = range.cloneRange();
		                range.setStartAfter(lastNode);
		                range.collapse(true);
		                sel.removeAllRanges();
		                sel.addRange(range);
		            }
		        }
		    } else if (document.selection && document.selection.type != "Control") {
		        // IE < 9
		        document.selection.createRange().pasteHTML(html);
		    }
	  	}
  	} else {
  	}
});