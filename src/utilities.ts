﻿///////////////////////////////////////////////////////////////////////////////
// Copyright (c) ENikS.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0  ( the  "License" );  you may 
// not use this file except in compliance with the License.  You may  obtain  a 
// copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required  by  applicable  law  or  agreed  to  in  writing,  software 
// distributed under the License is distributed on an "AS  IS"  BASIS,  WITHOUT
// WARRANTIES OR CONDITIONS  OF  ANY  KIND, either express or implied.  See the 
// License for the specific  language  governing  permissions  and  limitations 
// under the License.


//-----------------------------------------------------------------------------
// Utility Functions
//-----------------------------------------------------------------------------



/** Default predicate, always true */
export var trueFn = () => true;

/** Default transformer, returns self */
export var selfFn = o => o;

/** Default Grouping */
export var defGrouping = (a, b) => {
    if ('undefined' != typeof b['key']) throw duplicateKey;
    b['key'] = a;
    return b;
};

/** Returns default value for the type */
export function getDefaultVal(type) {
    if (typeof type !== 'string') throw new TypeError(noString);

    // Handle simple types (primitives and plain function/object)
    switch (type) {
        case 'boolean': return false;
        case 'function': return function () { };
        case 'null': return null;
        case 'number': return 0;
        case 'object': return {};
        case 'string': return "";
        case 'symbol': return Symbol();
        case 'undefined': return void 0;
    }

    try {
        // Look for constructor in this or current scope
        var ctor = typeof this[type] === 'function'
            ? this[type]
            : eval(type);

        return new ctor;

        // Constructor not found, return new object
    } catch (e) { return {}; }
}

/** Returns a map of element bsed on extracted keys  **/
export function getKeyedMap<T, K, E>(iterable: Iterable<T>, keySelector: (I) => K, selElement?: (T) => E): Map<K, Array<E>> {
    let map = new Map<K, Array<E>>();
    for (let value of iterable) {
        let key = keySelector(value);
        if ('undefined' === typeof key) throw invalidKey;
        let group: Array<E> = map.get(key);
        if ('undefined' === typeof group) {
            group = [];
            map.set(key, group);
        }
        group.push(selElement(value));
    }
    return map;
}

export function getKeyedMapFast<T, K>(iterable: Iterable<T>, keySelector: (I) => K): Map<K, Array<T>> {
    let map = new Map<K, Array<T>>();
    for (let value of iterable) {
        let key = keySelector(value);
        if ('undefined' === typeof key) throw invalidKey;
        let group: Array<T> = map.get(key);
        if ('undefined' === typeof group) {
            group = [];
            map.set(key, group);
        }
        group.push(value);
    }
    return map;
}


//-----------------------------------------------------------------------------
//  Constants
//-----------------------------------------------------------------------------

const invalidKey = "Key selector returned undefined Key";
const noString = "Type must be a string.";
const duplicateKey = "Object already has property [key]";
export const nothingFound = "No element satisfies the condition in predicate";
export const noElements = "The source sequence is empty.";
export const tooMany = "More than one element satisfies the condition in predicate.";
export const outOfRange = "Argument Out Of Range";


