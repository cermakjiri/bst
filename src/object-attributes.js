import is from "./validators";

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
    if (is.not("object", object) || is.not("object", attributes)) {
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
    if (is.object(name)) {
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
    if (is.object(name)) {
        // name == attributs
        setEach("constant", object, name);
    } else {
        setEach("constant", object, {
            [name]: value
        });
    }
};

export { permanent, constant };
