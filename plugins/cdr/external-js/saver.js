/*\
title: $:/plugins/cdr/external-js/saver.js
type: application/javascript
module-type: saver

Download saver for external-js enabled wiki
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var ExternalJSSaver = function(wiki) {
};

ExternalJSSaver.prototype.titleDownloadInstruction = "$:/plugins/cdr/external-js/ui/download-wiki";
ExternalJSSaver.prototype.titleSaveTemplate = "$:/core/save/offline-external-js";

ExternalJSSaver.prototype.save = function(text,method,callback,options) {
	var template = $tw.wiki.getTiddlerText("$:/config/SaveWikiButton/Template").trim();
	if (template !== this.titleSaveTemplate) {
		return false;
	}

	options = options || {};
	// Get the current filename
	var filename = options.variables.filename;
	if(!filename) {
		var p = document.location.pathname.lastIndexOf("/");
		if(p !== -1) {
			// We decode the pathname because document.location is URL encoded by the browser
			filename = document.location.pathname.substring(p+1);
			try {
				filename = decodeURIComponent(filename);
			} catch(e) {}
		}
	}
	if(!filename) {
		filename = "tiddlywiki.html";
	}
	// Set up the url
	var url = undefined;
	if(Blob !== undefined) {
		var blob = new Blob([text], {type: "text/html"});
		url = URL.createObjectURL(blob);
	} else {
		url = "data:text/html," + encodeURIComponent(text);
	}

	$tw.modal.display(this.titleDownloadInstruction,{
		variables: {
			dataURL: url,
			filename: filename
		},
		event: {}
	});

	// Callback that we succeeded
	if(callback) {
		callback(null);
	}
	return true;
};

/*
Information about this saver
*/
ExternalJSSaver.prototype.info = {
	name: "external-js",
	priority: 105
};

Object.defineProperty(ExternalJSSaver.prototype.info, "capabilities", {
	get: function() {
		var capabilities = ["save"];
		if(($tw.wiki.getTextReference("$:/config/DownloadSaver/AutoSave") || "").toLowerCase() === "yes") {
			capabilities.push("autosave");
		}
		return capabilities;
	}
});

/*
Static method that returns true if this saver is capable of working
*/
exports.canSave = function(wiki) {
	return document.createElement("a").download !== undefined;
};

/*
Create an instance of this saver
*/
exports.create = function(wiki) {
	return new ExternalJSSaver(wiki);
};

})();
