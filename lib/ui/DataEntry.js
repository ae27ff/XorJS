/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */


class DataEntry{
    //static count=0;
    constructor(label,data){
        this.id = DataEntry.count;
        DataEntry.count++;
        //console.log("ctor, data="+data);
        this.data = data;
        //console.log("this.data after="+this.data);
        this.element = null;
        this.label=label;
        this.updateCallback=null;
        //this.type=type;
    }
    getData(){ return this.data; }
    getElement(){ return this.element; }
    createElement(){ this.element=$(this.getTemplate()); return this.element; }
    
    updateSelectionProgress(){
        var before = 100*(this.data.selection_start / this.data.realsize);
        var mid = 100*(this.data.selection_length / this.data.realsize);
        var after = 100-(before+mid);
        //console.log(before+" "+mid+" "+after)
        this.elem('selection-progress-before').css('width', before+"%");
        this.elem('selection-progress-mid').css('width', mid+"%");
        this.elem('selection-progress-after').css('width', after+"%");
    }
    
    updateElementsFromSelection(){
        this.elem('selection-start').val( this.data.selection_start );
        this.elem('selection-end').val( this.data.selection_end );
        this.updateSelectionProgress();
        if(this.updateCallback!==null) this.updateCallback(this);
        //console.log("updatecallback "+this.updateCallback);
    }
    

    
    load(){
        this.updateElementsFromSelection();
    }
    
    elem(elementName){
        if(typeof elementName==="undefined") return this.getElement();//get parent element for the entry
        //console.log(elementName+this.id);
        return $('#'+elementName+this.id);
    }
    
    bind(elementName, eventName, func){
        //console.log(elementName+this.id+" "+eventName);
        this.elem(elementName).on(eventName,func);
    }
    
    
    getTemplate(customdata){
        if(typeof customdata==="undefined") customdata="";//optional argument
        return `
<div class="shadow-lg p-2 mb-2 bg-light" id="entry${this.id}">
<div class="accordion" id="accordion${this.id}">
    <div class="mb-1" data-toggle="collapse" data-target="#collapse${this.id}" >
        <button  id="entry-close${this.id}" type="button" class="btn btn-m border bg-white" aria-label="Close">&times;</button>
        <button type="button" class="btn">${this.label}</button>
    </div>
    <div id="collapse${this.id}" class="collapse show bg-white" data-parent="#accordion${this.id}">
      <div class="card-body">
<form>
        ${customdata}
  <div class="form-group row bg-light" id="selection-label-group${this.id}">
      <h6 class="" id="selection-label${this.id}">Select Data Range</h6>
  </div>
  <div class="form-group row" id="selection-group${this.id}">
    <label id="selection-start-label${this.id}" class="col col-sm-1">Start Offset</label>
    <div class="col col-sm-3">
      <input id="selection-start${this.id}" type="number" class="form-control" value="0" max="4294967295" min="0">
    </div>
    <label id="selection-end-label${this.id}" class="col col-sm-1">End Offset</label>
    <div class="col col-sm-3">
      <input id="selection-end${this.id}" type="number" class="form-control" value="4294967295" max="4294967295" min="0">
    </div>
    <button id="selection-length-button${this.id}" type="button" class="btn btn-secondary form-control col col-sm-2">Set Length...</button>
  </div>
    <div class="progress row" id="selection-progress${this.id}">
      <div class="progress-bar bg-transparent" style="width:0%" id="selection-progress-before${this.id}"></div>
      <div class="progress-bar" style="width:100%" id="selection-progress-mid${this.id}"></div>
      <div class="progress-bar bg-transparent" style="width:0%" id="selection-progress-after${this.id}"></div>
    </div>
</form>  
      </div>
    </div>
</div>
</div>
`;
    }
}

DataEntry.count=0;