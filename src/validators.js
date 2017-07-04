import Node from "./node";

const validators = {
    number(data) {
        return typeof data === "number";
    },
    string(data) {
        return typeof data === "string";
    },
    array(data) {
        return Array.isArray(data);
    },
    object(data) {
        return this.constructor(data, Object);
    },
    map(data) {
        return this.constructor(data, Map);
    },
    weakmap(data) {
        return this.constructor(data, WeakMap);
    },

    set(data) {
        return this.constructor(data, Set);
    },

    weakset(data) {
        return this.constructor(data, WeakSet);
    },

    constructor(instance, classObject) {
        // return instance.constructor === classObject;
        return instance instanceof classObject;
    },

    node(methodName, node) {
        // null isn't invalid value
        if (node === null) return false;

        if (!this.object(node) || !this.constructor(node, Node)) {
            throw new TypeError(
                `Invalid argument '${node}' in '${methodName}' method. It must be an instance of the Node class.`
            );
        }

        return true;
    },

    traversalType(type) {
        type = type.toLowerCase();

        if (!type.match(/^(in|post|pre)order$/)) {
            throw new TypeError(
                `First parameter must be 'preorder', 'inorder' or 'postorder', not '${type}'`
            );
        }

        return type;
    },

    not(name, a, b) {
        const fn = this[name];

        if (!fn) {
            const available = Object.keys(this);
            const indexOfNot = available.indexOf("not");

            available.splice(indexOfNot, 1);

            throw new TypeError(
                `'${name}' is not defined validator. Select from: ${available.join(
                    ", "
                )}.`
            );
        }

        return !(name === "constructor"
            ? fn.call(this, a, b)
            : fn.call(this, a));
    }
};

export default validators;
