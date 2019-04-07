/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */

function* constant_generator(n){
    while(true) yield n;
}

class ConstantGeneratorEntry extends GeneratorEntry{
    constructor(generatedsource){
        super("Constant Bytes",generatedsource);
        
        
    }
    load(){
        super.load();
        this.elem('generator-value-label').text("Byte Value");
    }
};