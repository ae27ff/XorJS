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


class ChunkedReader extends InputWindow {
    constructor(name,chunk_size, data_window){
        super('chunked',data_window.shortname,data_window,data_window.realsize);
        this.chunk_size = chunk_size;
        this.selection_reference = this.reference;
    }
    
    
    
    getChunkAsArrayBuffer(i){
        
    }
}