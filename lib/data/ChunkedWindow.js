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


class ChunkedWindow extends DataWindow {
    constructor(chunk_size, data_window){
        super('chunked',data_window.shortname,data_window,data_window.realsize);//set the real datawindow source as the internal reference
        this.chunk_size = chunk_size;
        this.chunks=1;
        this.last_chunk=0;
        this.getSelectionArrayBuffer = undefined;//disallow this method in this class, we only permit chunked reading here.
        this.selectPos(0,this.realend);
        console.log("ss "+this.selection_start);
        console.log("se "+this.selection_end);
        console.log("sl "+this.selection_length);
    }
    
    selectPos(start,end){
        super.selectPos(start,end);
        this.chunks = Math.ceil( this.selection_length / this.chunk_size );
        this.last_chunk = this.chunks-1;
    }
    
    selectInternalChunk(i){
        var iStart = this.selection_start + this.chunk_size * i;
        var iEnd = iStart + this.chunk_size - 1;
        
        if(iStart>this.selection_end) return false;//if this chunk starts beyond the selection, don't allow it
        if(iEnd>this.selection_end) iEnd = this.selection_end;//if the normal end of this chunk is beyond the selection, truncate the chunk.
        
        this.selection_reference.selectPos(iStart,iEnd);//select chunks from the original datawindow
        return true;
    }

    getChunkAsArrayBuffer(i,callback){
        //console.log("chunk "+i);
        if(i<0 || i>this.last_chunk) return null;
        this.selectInternalChunk(i);
        return this.selection_reference.getSelectionArrayBuffer(callback);//read internal selection
    }
    
    getChunkGenerator(callback){
        var _this = this;
        var chunks = this.chunks;
        function* gen(){
            for(var i=0;i<chunks;i++) yield _this.getChunkAsArrayBuffer(i,callback);
        }
        return gen();
    }
    
    
    
}