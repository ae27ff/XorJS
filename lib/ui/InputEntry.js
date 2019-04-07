/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */


class InputEntry extends DataEntry{
    constructor(type,name,data){
        super(type+": "+name,data);
    }
    
    updateSelectionFromInputs(){
        var start = parseInt(this.elem('selection-start').val());
        var end = parseInt(this.elem('selection-end').val());
        this.data.selectPos(start,end);
        this.updateSelectionProgress();
        if(this.updateCallback!==null) this.updateCallback(this);
    }
    load(){
        super.load();
        var _this = this;
        this.bind('selection-start','change',function(){
            _this.updateSelectionFromInputs();
        });
        this.bind('selection-end','change',function(){
            _this.updateSelectionFromInputs();
        });
        this.bind('selection-length-button','click',function(){
            var length = prompt("Input new length (from starting position):",_this.data.selection_length);
            if(length===null) return;
            _this.data.selectLen(_this.data.selection_start,length);
            _this.updateElementsFromSelection();
        });
    }
}
