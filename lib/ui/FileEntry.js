/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */


class FileEntry extends InputEntry{
    
    constructor(filedata){
        super("File",filedata.shortname,filedata);
        //this.data=filedata;
        
    }
    
    getTemplate(){ return super.getTemplate(""); }
}