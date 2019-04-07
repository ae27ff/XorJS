/* 
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/ .
 */

// Mulberry32, a fast high quality PRNG: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
// [PD]
//only need this because JS randoms are not seedable
var mb32=s=>t=>(s=s+1831565813|0,t=Math.imul(s^s>>>15,1|s),t=t+Math.imul(t^t>>>7,61|t)^t,(t^t>>>14)>>>0)/2**32;
// Better 32-bit integer hash function: https://burtleburtle.net/bob/hash/integer.html
var hash=n=>(n=61^n^n>>>16,n+=n<<3,n=Math.imul(n,668265261),n^=n>>>15)>>>0;

function* random_generator(seed){
    var prng = mb32(hash(seed));
    var max=255;
    var min=0;
    while(true){
        var r = prng();
        yield Math.floor(r * (max - min + 1)) + min;
    }
}

class RandomGeneratorEntry extends GeneratorEntry{
    constructor(generatedsource){
        super("Random Bytes",generatedsource);
        
        
    }
    load(){
        super.load();
        this.elem('generator-value-label').text('Random Seed');
        this.elem('generator-value').prop('min',-(Math.pow(2,31)-1));
        this.elem('generator-value').prop('max',+(Math.pow(2,31)-1));
        //this.elem('generator-value').hide();
    }
};