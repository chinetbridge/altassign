'use strict';
var isObj = require('is-obj');
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
    if (val === undefined) {
        throw new TypeError('Sources cannot be undefined');
    }
    var p={};
    for(var i in val){
        p[i] = isObj(val[i])? toObject(val[i]):clean(val[i]);
    }
    return p;
}
function trim(x) {
    try {
        return x.replace(/^\s+|\s+$/gm,'');
    }catch (e) {
        return x;
    }
}
function clean(x) {
    // if (x === undefined ||x === null ||x === 'null'||trim(x) === '') {
    if (x === undefined ||x === null ||x === 'null') {
        return '';
    }
    return x;
}
function assignKey(to, from, key) {
    var val = clean(from[key]);
    if (hasOwnProperty.call(to, key)) {
        if (to[key] === undefined) {
            throw new TypeError('Cannot convert undefined to object (' + key + ')');
        }
    }
    if (!hasOwnProperty.call(to, key) || !isObj(val)) {
        if((to[key]!==val && val!='')||(to[key] === undefined))
            to[key] = val;
    } else {
        to[key] = assign(Object(to[key]), from[key]);
    }
}

function assign(to, from) {
    if (to === from) {
        return to;
    }
    from = Object(from);

    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            assignKey(to, from, key);
        }
    }

    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
                assignKey(to, from, symbols[i]);
            }
        }
    }

    return to;
}

module.exports = function altAssign(target) {
    target = toObject(target);
    for (var s = 1; s < arguments.length; s++) {
        assign(target, arguments[s]);
    }
    return target;
};
