/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */


class InputEntry{
    //static count=0;
    constructor(type,name,data){
        this.id = InputEntry.count;
        InputEntry.count++;
        //console.log("ctor, data="+data);
        this.data = data;
        //console.log("this.data after="+this.data);
        this.element = null;
        this.name=name;
        this.type=type;
    }
    getData(){ return this.data; }
    getElement(){ return this.element; }
    createElement(){ this.element=$(this.getTemplate()); this.updateElement(); return this.element; }
    updateElement(){
        $("#selection-start"+this.id).val( this.data.selection_start );
        $("#selection-end"+this.id).val( this.data.selection_end );
        
        var before = 100*(this.data.selection_start / this.data.realsize);
        var mid = 100*(this.data.selection_length / this.data.realsize);
        var after = 100-(before+mid);
        //console.log(before+" "+mid+" "+after)
        $("#selection-progress-before"+this.id).css('width', before+"%");
        $("#selection-progress-mid"+this.id).css('width', mid+"%");
        $("#selection-progress-after"+this.id).css('width', after+"%");
    }
    
    bind(elementName, eventName, func){
        console.log(elementName+this.id+" "+eventName);
        $('#'+elementName+this.id).on(eventName,func);
    }
    
    
    getTemplate(customdata){
        if(typeof customdata==="undefined") customdata="";//optional argument
        return `
<div class="shadow-lg p-2 mb-2 bg-light" id="entry${this.id}">
<div class="accordion" id="accordion${this.id}">
    <div class="mb-1" data-toggle="collapse" data-target="#collapse${this.id}" >
        <button  id="entry-close${this.id}" type="button" class="btn btn-m border bg-white" aria-label="Close">&times;</button>
        <button type="button" class="btn">${this.type}: ${this.name}</button>
    </div>
    <div id="collapse${this.id}" class="collapse show bg-white" data-parent="#accordion${this.id}">
      <div class="card-body">

<form>
  ${customdata}
  <div class="form-group row bg-light" id="selection-label${this.id}">
      <h6 class="">Select Data Range</h6>
  </div>
  <div class="form-group row" id="selection${this.id}">
    <label class="col col-sm-1">Start Offset</label>
    <div class="col col-sm-3">
      <input id="selection-start${this.id}" type="number" class="form-control" value="0" max="4294967295" min="0">
    </div>
    <label class="col col-sm-1">End Offset</label>
    <div class="col col-sm-3">
      <input id="selection-end${this.id}" type="number" class="form-control" value="4294967295" max="4294967295" min="0">
    </div>
    <button type="button" class="btn btn-secondary form-control col col-sm-2">Set Length...</button>
  </div>
    <div class="progress form-group row" id="selection-progress${this.id}">
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

InputEntry.count=0;