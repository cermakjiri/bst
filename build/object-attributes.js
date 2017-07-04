"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constant = exports.permanent = undefined;

var _validators = require("./validators");

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const options = {
    permanent: {
        enumerable: false,
        configurable: false,
        writable: true
    },

    constant: {
        enumerable: false,
        configurable: false,
        writable: false
    }
};

const setEach = (type, object, attributes) => {
    if (_validators2.default.not("object", object) || _validators2.default.not("object", attributes)) {
        throw new TypeError("Second and third parameters must be objects.");
    }

    const entries = Object.entries(attributes);
    const typeOptions = options[type];

    for (let [name, value] of entries) {
        let opts = Object.assign({ value }, typeOptions);

        Object.defineProperty(object, name, opts);
    }
};

// undeletable
const permanent = (object, name, value) => {
    // setEach('permanent', object, is.object(name) ? name : {
    //     [name]: value
    // });
    if (_validators2.default.object(name)) {
        // name == attributs
        setEach("permanent", object, name);
    } else {
        setEach("permanent", object, {
            [name]: value
        });
    }
};

// constant object / class attribute
const constant = (object, name, value) => {
    if (_validators2.default.object(name)) {
        // name == attributs
        setEach("constant", object, name);
    } else {
        setEach("constant", object, {
            [name]: value
        });
    }
};

exports.permanent = permanent;
exports.constant = constant;