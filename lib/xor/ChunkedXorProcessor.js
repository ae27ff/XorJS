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
        this.progress=0;
        this.progress_callback=null;
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
        console.log( "shortest " + this.getShortestLength() )
        this.output_length = this.getShortestLength();
        this.output_end = this.output_length-1;
        this.chunks = Math.ceil(this.output_length / this.chunk_size);
        this.last_chunk = this.chunks-1;
        this.last_chunk_size = this.output_length % this.chunk_size;
        this.progress=0;
        if(this.last_chunk_size === 0) this.last_chunk_size = this.chunk_size;//output length divided evenly into chunks
    }
    
    prepareBuffer(){
        console.log("prepbuf "+this.output_length);
        if(this.output_length===0)
            this.output_buffer = null;
        else
            this.output_buffer = new Uint8Array(this.output_length); //MDN: "The contents are initialized to 0" perfect for what we want.
        console.log(this.output_buffer);
    }
    
    releaseBuffer(){
        console.log("releasebuf");
        this.output_buffer = null;
    }
    
    isLastChunk(i){
        return i===this.last_chunk;
    }
    
    getChunkView(i){
        //console.log(" getchunkview "+i);
        var start = this.chunk_size * i;
        var length = this.chunk_size;
        if(this.isLastChunk(i)) length = this.last_chunk_size;
        //console.log(" view "+i+"/"+this.last_chunk+" => "+start+" "+length+"B   "+this.output_buffer.length);
        return new Uint8Array(this.output_buffer.buffer,start,length);//view (reference) of stored output buffer's internal arraybuffer
    }

    
    xorChunk(i,arraybuffer_chunk){
        //console.log("xorchunk "+i);
        var output_chunk = this.getChunkView(i);
        
        if(output_chunk.length===0) return;//invalid range for the output;
        var input_chunk = new Uint8Array(arraybuffer_chunk);//view of returned chunk
        if(input_chunk===null || input_chunk.length===0) return;
        
        input_chunk.forEach((v,i)=>{  //xor each value into the output buffer
            //console.log(" xor chunk byte "+i+": "+output_chunk[i]+" ^ "+v);
            //console.log(i);
            
            //if(i!==0) return;
            //console.log("   "+i+": "+ output_chunk[i]+"^"+v+" = "+(output_chunk[i]^v));
            output_chunk[i]^=v;
            
            //console.log("  "+output_chunk[i]);
        });
        
    }
    
    async xorDataSourceChunk(ichunk, isource){
        var _xorp = this;
        var xor_callback = function(i){ return ((chunk)=>_xorp.xorChunk(i,chunk)); }(ichunk);//instance i so that when xorChunk is ran, it cant reference the changing 'i' since an anonymous inner function can read the value of a variable in another function after the scope finishes.  Sometimes I hate JS.
        
        //console.log(" queing2 source "+isource);
        //console.log(_xorp.sources[isource])
        return await _xorp.sources[isource].getChunkAsArrayBuffer(ichunk, xor_callback);
                /*.then(function(v){
           console.log("   xorchunk promise resolved"); 
           console.log(v);
           console.log(new Uint8Array(v));
        });*/
        
    }
    
    async xorDataSourcesChunk(ichunk){
        //var chunkwaitchain = Promise.resolve(null);
        var isource;
        for(isource in this.sources){
            await this.xorDataSourceChunk(ichunk, isource);
            /*
            chunkwaitchain = (function(_this,_ichunk,_isource){ //JS for the love of god stop sharing references across functions, we don't need this many levels of closure! (but each call will have the same i without)
                return chunkwaitchain.then(function(){
                    console.log(" previous waitchain resolved - queining "+_ichunk+" "+_isource)
                    _this.xorDataSourceChunk(_ichunk, _isource);
                });
            })(this,ichunk,isource);*/
            
            //console.log(" chunkwaitchain "+chunkwaitchain);
        }
        this.progress++;
        this.progress_callback(this.progress);
        //console.log(" retchunkwaitchain ");
        //console.log(chunkwaitchain);
        //return chunkwaitchain;
    }
    
    async sleep(ms){
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve(ms);
            },ms);
        });
    }
    
    async xorDataSources(){
        //var promises = [];
        for(var i=0; i<=this.last_chunk; i++){ //queue xor for all chunks
            await this.xorDataSourcesChunk(i);
            await this.sleep(1);//prevent hanging UI
            /*console.log(" promise pushed "+promise);
            promises.push( promise );
            var _i=i;
            promises[i].then(function(){ console.log("promise "+_i+" resolved"); });
            console.log(" promises "+promises);
            console.log(promises[0]);
            console.log("xor queued "+i);*/
            //if(i===1) break;
        }
        return this.output_buffer;
        
        /*
        var _xorp = this;
        return Promise.all(promises).then(function(v){
            console.log(v);
            console.log(v[0]);
            return _xorp.output_buffer;
        });*/
    }
    
    
    
    
}