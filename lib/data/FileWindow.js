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
	}
        
	selectPos(start,end){
		super.selectPos(start,end);
		this.selection_reference = this.reference.slice(start,end+1);
	}


	getSelectionArrayBuffer(){
		var _this = this;
		return new Promise(function(resolve,reject){
			_this.reader.onerror = function(event){
				reject(event);
			};
			_this.reader.onabort=_this.reader.onerror;
			_this.reader.onload = function(event){
				resolve(event.target.result);
			};
			_this.reader.readAsArrayBuffer(_this.selection_reference);
		});
	}
}