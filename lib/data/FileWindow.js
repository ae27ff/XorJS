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

class FileWindow extends DataWindow{
    
	constructor(file){
		super('file',file.name,file,file.size);
		this.reader=new FileReader();
                this.selectPos(0,this.realend);
                this.waitchain = Promise.resolve(null);
	}
        
        
        
        
	selectPos(start,end){
            super.selectPos(start,end);
            console.log(" fselect "+start+" "+end+"   "+this.realend);
            if(end===this.realend)
                this.selection_reference = this.reference.slice(start);
            else
                this.selection_reference = this.reference.slice(start,end+1);
	}


	getSelectionArrayBuffer(callback){
                var _slice = this.selection_reference;//instance variables so that they can't change during promise execution
                var _waitchain = this.waitchain;
		var _this = this;
		return this.waitchain = new Promise(function(resolve,reject){
                    console.log(_this);
                    console.log(_slice)
                    _waitchain.then(function(){
			_this.reader.onerror = function(event){
                            reject(event);
			};
			_this.reader.onabort=_this.reader.onerror;
			_this.reader.onload = function(event){
                            resolve(event.target.result);
			};
			_this.reader.readAsArrayBuffer(_slice);
                    });
		}).then(callback);
	}
}