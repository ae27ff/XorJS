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


function* constant_generator(n){
    while(true) yield n;
}


function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

//download(xorp.output_buffer,'output.bin','application/octet-stream');
//TODO: take buffer from ChunkedXorProcessor and immeditately release before file download

function handleFileSelect(evt) {
        console.log("file select "+evt);
	var files = evt.target.files; // FileList object

	// use the 1st file from the list
	f = files[0];

        window.xfile = new FileWindow(f);
        
        window.xorp = new ChunkedXorProcessor(2);
        window.cfile = xorp.prepareDataSource(xfile);
        
        
        window.xconst = new GeneratorWindow('constant/1',constant_generator,1);
        window.cconst = xorp.prepareDataSource(xconst);
        
        
        xorp.prepareSelection();
        xorp.prepareBuffer();
        
        console.log(xorp.output_buffer);
        window.xor_done = xorp.xorDataSources();
        
        
        
        
        
        
}

function hookFileSelect(elem){
    elem.addEventListener('change', handleFileSelect, false);
}



$(function(){
    //hookFileSelect(document.getElementById('f1'));
});






class A{
    foo(){ console.log("X"); }
    boo(){ this.foo() }
}

class B extends A{
    foo(){ console.log("Y"); }
}