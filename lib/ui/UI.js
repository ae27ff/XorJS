/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */



class UI{
    static load(){
        UI.xorProcessor = new ChunkedXorProcessor(4096);
        UI.entries=[];
        UI.fileTrigger = $("#ui-addfile-trigger");
        UI.entryContainer = $("#ui-entry-container");
        
        console.log("loading ui events");
        UI.fileTrigger.on('change',UI.handleFileSelect);
        
    }
    
    static clearEntries(){
        for(var id in UI.entries){
            UI.removeEntry(id);
        }
        UI.xorProcessor.removeSources();
    }
    
    static removeEntry(id){
        UI.xorProcessor.removeSource( UI.entries[id].data.xor_source_id );
        

        UI.entries[id].getElement().remove();
        delete UI.entries[id];
        //UI.entries.splice(id, 1);
             //TODO: remove datasource from ChunkedXorProcessor!
    }
    
    
    static addEntry(entry){
        UI.entries[entry.id]=entry;
        UI.entryContainer.append(entry.createElement());
        var _id = entry.id;
        entry.bind('entry-close','click',function(){
            console.log("close "+_id);
            UI.removeEntry(_id);
        });
        if(entry instanceof ConstantGeneratorEntry){
            $("#selection"+entry.id).hide();
            $("#selection-label"+entry.id).hide();
            $("#selection-progress"+entry.id).hide();
        }
        entry.updateElement();
    }
    
    
    static addFile(){//NOTE: must be called from a user interaction event
        UI.fileTrigger.show();
        UI.fileTrigger.trigger('click');//open file select window
        UI.fileTrigger.hide();
    }
    
    static addConstantGenerator(){
        var source = new GeneratorWindow('constant',constant_generator,0);
        var chunkedsource = UI.xorProcessor.prepareDataSource(source);
        var entry = new ConstantGeneratorEntry(chunkedsource);
        UI.addEntry(entry);
    }
    
    
    static handleFileSelect(evt) {
        console.log("file select "+evt);
	var files = evt.target.files; // FileList object

	// use the 1st file from the list
	var f = files[0];

        var source = new FileWindow(f);
        var chunkedsource = UI.xorProcessor.prepareDataSource(source);
        var entry = new FileEntry(chunkedsource);
        
        UI.addEntry(entry);
        
        
        /*
        
        window.xorp = new ChunkedXorProcessor(2);
        window.cfile = xorp.prepareDataSource(xfile);
        
        
        window.xconst = new GeneratorWindow('constant/1',constant_generator,1);
        window.cconst = xorp.prepareDataSource(xconst);
        
        
        xorp.prepareSelection();
        xorp.prepareBuffer();
        
        console.log(xorp.output_buffer);
        window.xor_done = xorp.xorDataSources();*/
    }
}


$(function(){
    UI.load();
});