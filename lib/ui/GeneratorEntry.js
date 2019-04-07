/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */




class GeneratorEntry extends InputEntry{
    constructor(type,generatedsource){
        super("Generator",type,generatedsource);
        //console.log("this.data: ");//TODO: fix this.data not defined by constructor!?!?
        //console.log(this.data);
        //this.data = generator;
    }
    
    updateSelectionFromInputs(){
        super.updateSelectionFromInputs();
        this.data.selection_reference.generator_parameter=parseInt(this.elem('generator-value').val());
    }
    
    
    load(){
        super.load();
        this.elem('selection-group').hide();
        this.elem('selection-label-group').hide();
        this.elem('selection-progress').hide();
        var _this=this;
        this.bind('generator-value','change',function(){
            _this.updateSelectionFromInputs();
        });
    }
    
    
    getTemplate(){
        return super.getTemplate(`
  <div class="form-group row">
    <label class="col col-sm-1" id="generator-value-label${this.id}">Generator Input</label>
    <div class="col col-sm-3">
      <input type="number" class="form-control" value="0" max="255" min="0" id="generator-value${this.id}">
    </div>
  </div>
`);
    }
    
}