'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectAttributes = require('./object-attributes');

class Node {
    constructor(data, left = null, right = null) {
        (0, _objectAttributes.permanent)(this, {
            data: data,
            left: left,
            right: right
        });
    }
}
exports.default = Node;