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

let isAsync = true;

try {
  eval('async () => {}');
} catch (e) {
  if (e instanceof SyntaxError)
    isAsync = false;
  else
    throw e; // throws CSP error
}

$(function(){
    if(!isAsync){
        $("#compatModal").modal();
    }
});