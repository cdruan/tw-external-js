/*\
title: $:/plugins/cdr/external-js/startup.js
type: application/javascript
module-type: startup
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "external-js";
exports.platforms = ["browser"];
exports.after = ["rootwidget"];
exports.before = ["story"];
exports.synchronous = true;

function downloadExternalJSWiki(saver,filename) {
	var text = $tw.wiki.renderTiddler("text/plain",saver.titleSaveTemplate,null /*options*/);

	saver.save(text,"save",null,{variables: { filename: filename }});
}

exports.startup = function() {
	for(var t=$tw.saverHandler.savers.length-1; t>=0; t--) {
		var saver = $tw.saverHandler.savers[t];
		if(saver.info.name === "external-js") {
			$tw.rootWidget.addEventListener("tm-download-external-js-wiki",function(event) {
				downloadExternalJSWiki(saver, event.param);
			});
			break;
		}
	}

	var plugins = {};
	$tw.utils.each(
		$tw.wiki.filterTiddlers("[enlist{$:/config/ExternalJS/Exports}]"),
		function(title) {
			plugins[title] = "yes";
		}
	);

	var fields = {
		original: "yes",
		list: $tw.wiki.getTiddlerText("$:/config/ExternalJS/Exports")
	}
	$tw.wiki.setTiddlerData("$:/temp/external-js/exports",plugins,fields);
}
})();