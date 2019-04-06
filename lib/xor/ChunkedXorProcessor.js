/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */


class ChunkedXorProcessor{
    constructor(chunk_size){
        this.chunk_size = chunk_size;
        this.sources=[];
        this.output_buffer = null;
        this.output_length = 0;
        this.output_end = -1;
        this.chunks = 0;
        this.last_chunk = this.chunks-1;
        this.last_chunk_size = 0;
    }
    
    removeSources(){
        for(var isource in this.sources){
            this.removeSource(isource);
        }
        this.sources=[];//probably can just do this instead
    }
    
    removeSource(id){
        delete this.sources[id];//do not want to reorder indices
    }
    
    getShortestLength(){
        var min = -1;
        var source;
        console.log("sources "+this.sources);
        for(source in this.sources){
            console.log("source "+source);
            if(min===-1 || this.sources[source].selection_length < min) min = this.sources[source].selection_length;
        }
        console.log("min "+min);
        return min;
    }
    
    prepareDataSource(datawindow){
        var chunkedwindow = new ChunkedWindow(this.chunk_size,datawindow);
        var newlength = this.sources.push(chunkedwindow);
        chunkedwindow.xor_source_id = newlength-1;
        return chunkedwindow;
    }
    
    prepareSelection(){
        console.log( this.getShortestLength() )
        this.output_length = this.getShortestLength();
        this.output_end = this.output_length-1;
        this.chunks = Math.ceil(this.output_length / this.chunk_size);
        this.last_chunk = this.chunks-1;
        this.last_chunk_size = this.output_length % this.chunk_size;
        if(this.last_chunk_size === 0) this.last_chunk_size = this.chunk_size;//output length divided evenly into chunks
    }
    
    prepareBuffer(){
        if(this.output_length===0)
            this.output_buffer = null;
        else
            this.output_buffer = new Uint8Array(this.output_length); //MDN: "The contents are initialized to 0" perfect for what we want.
    }
    
    releaseBuffer(){
        this.output_buffer = null;
    }
    
    isLastChunk(i){
        return i===this.last_chunk;
    }
    
    getChunkView(i){
        var start = this.chunk_size * i;
        var length = this.chunk_size;
        if(this.isLastChunk(i)) length = this.last_chunk_size;
        console.log(" view "+i+"/"+this.last_chunk+" => "+start+" "+length+"   "+this.output_buffer.length);
        return new Uint8Array(this.output_buffer.buffer,start,length);//view (reference) of stored output buffer's internal arraybuffer
    }

    
    xorChunk(i,arraybuffer_chunk){
        var output_chunk = this.getChunkView(i);
        
        if(output_chunk.length===0) return;//invalid range for the output;
        var input_chunk = new Uint8Array(arraybuffer_chunk);//view of returned chunk
        if(input_chunk===null || input_chunk.length===0) return;
        
        input_chunk.forEach((v,i)=>{  //xor each value into the output buffer
            console.log(" xor chunk byte "+i+": "+output_chunk[i]+" ^ "+v);
            output_chunk[i]^=v;
            console.log("  "+output_chunk[i]);
        });
        
        
    }
    
    xorDataSourceChunk(chunkwaitchain, ichunk, isource){
        var _xorp = this;
        var xor_callback = function(i){ return ((chunk)=>_xorp.xorChunk(i,chunk)); }(ichunk);//instance i so that when xorChunk is ran, it cant reference the changing 'i' since an anonymous inner function can read the value of a variable in another function after the scope finishes.  Sometimes I hate JS.
        return chunkwaitchain.then(function(){
            _xorp.sources[isource].getChunkAsArrayBuffer(ichunk, xor_callback); //did I mention I hate JS?  await/async support came after promises...
        });
    }
    
    xorDataSourcesChunk(ichunk){
        var chunkwaitchain = Promise.resolve(null);
        var isource;
        for(isource in this.sources){
            chunkwaitchain = this.xorDataSourceChunk(chunkwaitchain, ichunk, isource);
        }
        return chunkwaitchain;
    }
    
    xorDataSources(){
        var promises = [];
        for(var i=0; i<=this.last_chunk; i++){ //queue xor for all chunks
            promises.push( this.xorDataSourcesChunk(i) );
            console.log("xor queued "+i);
        }
        
        var _xorp = this;
        return Promise.all(promises).then(()=>_xorp.output_buffer);
    }
    
    
    
    
}