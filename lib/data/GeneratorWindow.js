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


class GeneratorWindow extends DataWindow{
    
	constructor(generator,name,generator_parameter){
		super('generator',name,generator,4294967296);
		this.generator_parameter=generator_parameter;
	}
        
        selectPos(start,end){
            this.selection_reference=this.reference( this.generator_parameter );//start a generator sequence
            for(var i=0;i<start;i++){
                //var v = 
                this.selection_reference.next();
                //console.log("ff gen "+i+" -> "+v.value)
            }//fast-forward generator to position
            super.selectPos(start,end);
	}
        
        
	getSelectionArrayBuffer(){
                var arr = new Uint8Array(this.selection_length);
                for(var i=0; i<this.selection_length; i++){
                    //var pos = this.selection_start + i;
                    arr[i] = this.selection_reference.next().value;
                    //console.log(" gen "+pos+" -> "+arr[i]);
                }
		return Promise.resolve(arr.buffer);
	}
}