/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */

/**
 * 
 * @author crashdemons
 * @type {Object}
 */



function handleFileSelect(evt) {
        console.log("file select "+evt);
	var files = evt.target.files; // FileList object

	// use the 1st file from the list
	f = files[0];

        window.xfile = new FileWindow(f);
}

function hookFileSelect(elem){
    elem.addEventListener('change', handleFileSelect, false);
}



$(function(){
    hookFileSelect(document.getElementById('f1'));
});



