/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */


class OutputEntry extends DataEntry{
    constructor(){
        super("Output", new DataWindow('virtual','output',null,4294967295));
        this.outputCallback = null;
        this.cancelCallback = null;
        this.outputState = false;
    }
    
    getTemplate(){
        return super.getTemplate(`
  <div class="form-group row">
    <label class="col col-sm-2" id="output-length-label${this.id}">Total Length</label>
    <div class="col col-sm-3">
      <input type="number" class="form-control" readonly value="0" min="0" id="output-length${this.id}">
    </div>
    <div class="col col-sm-1"></div>
    <button type="button" class="btn btn-primary col col-sm-2" id="output-button${this.id}">Combine Inputs</button>
  </div>
`);
    }
    
    load(){
        this.elem('entry-close').hide();
        this.elem('selection-length-button').hide();
        this.elem('selection-label-group').hide();
        this.elem('selection-group').hide();
        this.setSize(0);
        this.setComplete(0);
        var _this=this;
        this.bind('output-button','click',function(){
            if(!_this.outputState){
                console.log("starting output "+_this.outpuState);
                if(_this.outputCallback!==null) _this.outputCallback(_this);
            }else{
                console.log("starting cancel "+_this.outpuState);
                if(_this.cancelCallback!==null) _this.cancelCallback(_this);
            }
        });
    }
    
    setButtonState(inprogress){
        console.log("set button state "+inprogress);
        this.outputState=inprogress;
        if(!inprogress){
            //this.elem('output-button').prop('disabled',true);
            this.elem('output-button').addClass("btn-primary").removeClass("btn-danger");
            this.elem('output-button').text("Combine Inputs");
        }else{
            this.elem('output-button').addClass("btn-danger").removeClass("btn-primary");
            this.elem('output-button').text("Cancel");
            //this.elem('output-button').prop('disabled',false);
        }
    }
    
    
    updateElementsFromSelection(){
        this.elem('output-length').val(this.data.realsize);
        this.updateSelectionProgress();
        if(this.data.realsize>0){
            this.elem('output-button').prop('disabled',false);
        }else{
            this.elem('output-button').prop('disabled',true);
        }
    }
    setComplete(length){
        if(length>this.data.realsize) length = this.data.realsize;
        this.data.selectLen(0,length);
        this.updateElementsFromSelection();
    }
    setSize(size){
        console.log("outputsize "+size);
        if(size===-1) size=0;
        this.data.realsize=size;
        this.updateElementsFromSelection();
    }
}