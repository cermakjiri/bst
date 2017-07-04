(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validators = require("./validators");

var _validators2 = _interopRequireDefault(_validators);

var _objectAttributes = require("./object-attributes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validControllers = ["valid", "compare", "toString"];
const defaultsDataTypes = ["number", "string", "array", "object", "map", "weakmap", "set", "weakset"];

class Controllers {
    constructor(options) {
        // the tree can contains data with only one type
        // such a number, string, array, ..., or you can set custom data
        // and you must create custom checking method for that type
        (0, _objectAttributes.constant)(this, "dataType", options.dataType || "number");

        /*
            controller is object containing default methods for data validation, comparing, etc.,
            but you can override them with your custom methods
        */
        const fn = options[this.dataType] || _validators2.default[this.dataType];

        // set validator
        if (fn) {
            (0, _objectAttributes.constant)(this, "validator", fn);
        } else {
            throw `Missing validator for '${this.dataType}'. Choose from default data types (${defaultsDataTypes.join(", ")}) or if you set your own.\nIf you set your own data type, you must create method with the same name, which will check if inserted data are of that type.`;
        }

        // set custom controllers
        validControllers.forEach(name => {
            const fn = options[name];

            if (fn && options.hasOwnProperty(name)) {
                (0, _objectAttributes.constant)(this, name, fn);
            }
        });
    }

    valid(data) {
        return data !== null && data !== undefined && this.validator(data);
    }

    /*
        a < b -> -1
        a > b -> 1
        else 0 // for '==' and '==='
    */
    compare(a, b) {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    validTree(other) {
        return other.dataType === this.dataType;
    }

    toString(data) {
        return data;
    }
}
exports.default = Controllers;
},{"./object-attributes":6,"./validators":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _controllers = require('./controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _objectAttributes = require('./object-attributes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BSTCore {
    constructor(options) {
        (0, _objectAttributes.constant)(this, {
            controllers: new _controllers2.default(options || {})
        });
    }

    /*
        controllers
    */
    valid(data) {
        return this.controllers.valid(data);
    }

    validTree(other) {
        return this.controllers.validTree(other);
    }

    compare(a, b) {
        return this.controllers.compare(a, b);
    }

    toString(data) {
        return this.controllers.toString(data);
    }

    // ------------------------------------

    insert(current, data) {
        const root = current;
        const node = new _node2.default(data);

        if (!current) return node;

        while (current) {
            let compareResult = this.controllers.compare(node.data, current.data);

            if (compareResult < 0) {

                if (current.left) {
                    current = current.left;
                } else {
                    current.left = node;
                    break;
                }
            } else if (compareResult > 0) {

                if (current.right) {
                    current = current.right;
                } else {
                    current.right = node;
                    break;
                }
            } else {
                // node with such a data already exists
                return null;
            }
        }

        return root;
    }

    getMin(node) {
        while (node.left) node = node.left;

        return node.data;
    }

    getMax(node) {
        while (node.right) node = node.right;

        return node.data;
    }

    getHeight(node) {
        if (!node) return -1;

        const queue = [node];
        let height = 0;

        while (queue.length) {
            let nodeCount = queue.length;

            if (nodeCount === 0) return height;

            height++;

            // remove nodes of this level and add nodes of next level
            while (nodeCount) {
                let node = queue.shift();

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);

                nodeCount--;
            }
        }

        return height;
    }

    isBalanced(node) {
        if (!node) return true;

        const heightLeft = this.getHeight(node.left);
        const heightRight = this.getHeight(node.right);
        const diff = Math.abs(heightLeft - heightRight);

        return diff > 1 ? false : this.isBalanced(node.left) && this.isBalanced(node.right);
    }

    // todo - iterative alg. 'isBalanced'
    isBalanced(node) {
        if (!node) return true;

        let heightLeft = 0;
        let heightRight = 0;
        let diff = 0;

        const queue = [node];

        while (queue.length) {}
    }

    findParentNode(node, data) {
        let parent = null;
        let current = node;
        let side = null;

        while (current) {
            let compareResult = this.controllers.compare(data, current.data);

            if (compareResult < 0) {
                parent = current;
                current = current.left;
                side = 'left';
            } else if (compareResult > 0) {
                parent = current;
                current = current.right;
                side = 'right';
            } else {
                break;
            }
        }

        return { parent, current, side };
    }

    delete(ref, data) {
        const root = ref.node;

        let toDel = this.findParentNode(root, data);

        // node with the data wasn't found -> return false
        if (!toDel.current) return false;

        // node was found
        if (toDel.current.left && toDel.current.right) {

            const min = {
                parent: null,
                current: toDel.current.right,
                side: 'right'
            };

            // closest value, to the value we want to delete, is the minimum in the right subtree
            while (min.current.left) {
                min.parent = min.current;
                min.current = min.current.left;
                min.side = 'left';
            }

            // swap those two nodes
            toDel.current.data = min.current.data;

            // now we need to delete the min
            toDel = min;
        }

        // delete root (-> the node hasn't got any parent)
        if (!toDel.parent) {
            ref.node = null;
            return true;
        }

        let current = toDel.current;
        if (current.left) {
            toDel.parent[toDel.side] = current.left;
        } else {
            toDel.parent[toDel.side] = current.right;
        }

        return true;
    }

    findNode(node, data) {
        const { current } = this.findParentNode(node, data);

        return current;
    }

    includes(current, data) {
        return this.findNode(current, data) !== null;
    }

    getSortedData(node) {
        return [...this.inorder(node)];
    }

    /*
        depth-first search
    */
    *preorder(node) {
        if (!node) return;

        const stack = [node];

        while (stack.length) {
            let current = stack.pop();

            yield current.data;

            if (current.right) stack.push(current.right);
            if (current.left) stack.push(current.left);
        }
    }

    *inorder(node) {
        const stack = [];

        while (stack.length || node) {
            if (node) {
                stack.push(node);

                node = node.left;
            } else {
                node = stack.pop();

                yield node.data;

                node = node.right;
            }
        }
    }

    *postorder(node) {
        const stack = [];
        let lastNodeVisited = null;

        while (stack.length || node) {
            if (node) {
                stack.push(node);

                node = node.left;
            } else {
                let peekNode = stack[stack.length - 1];

                // if right child exists and traversing node
                // from left child, then move right
                if (peekNode.right && lastNodeVisited !== peekNode.right) {
                    node = peekNode.right;
                } else {
                    yield peekNode.data;

                    lastNodeVisited = stack.pop();
                }
            }
        }
    }

    /*
        breadth-first search
    */
    *breadthFirstSearch(node) {
        if (!node) return;

        const queue = [node];

        while (queue.length) {
            let node = queue.shift();

            yield node.data;

            if (node.left) queue.push(node.left);

            if (node.right) queue.push(node.right);
        }
    }

    /**
        O(n*log(n))
        merge source tree (src) into dest. tree (dest)
    */
    merge(dest, destCore, src) {
        // source tree
        const it = this.preorder(src.root);
        let next = it.next();

        while (!next.done) {
            dest.insert(next.value);

            next = it.next();
        }

        return dest;
    }

    /*
        How it works:
         1. get middle element (-> median) from sorted elements
         2. insert the element to node parameter (node.data = median)
         3. if left side from median is bigger than 0:
         3a. create new node on the left of current node (node.left = new Node())
         3b. call recursively balance() method on left subtree with left side of the elements
         4. if right side form median is bigger than 0:
         4a. create new node on the right of current node (node.right = new Node())
         4b. call recursively balance() method on right subtree with right side of the elements
          Complexity:
        O(n) - where n is number of elements (-> each element will be inserted into tree)
          @param {Node} node
        @param {Array} elements - sorted elements from tree
        @return {void}
    */
    balance(node, elements) {
        if (!node) return;

        const indexOfMedian = Math.floor(elements.length / 2);

        node.data = elements[indexOfMedian];

        if (indexOfMedian > 0) {
            node.left = new _node2.default();
            this.balance(node.left, elements.slice(0, indexOfMedian));
        }

        if (indexOfMedian < elements.length - 1) {
            node.right = new _node2.default();
            this.balance(node.right, elements.slice(indexOfMedian + 1, elements.length));
        }
    }

    treeStructure(node) {
        if (!node) return [];

        const tree = [[this.toString(node.data)]];

        const queue = [node.left, node.right];
        let nodes = [];

        let floor = 1;
        let floorMax = 2 ** floor;

        while (queue.length) {
            let node = queue.shift();

            if (node) {
                nodes.push(this.toString(node.data));
            } else {
                nodes.push(' ');
            }

            if (nodes.length >= floorMax) {
                tree.push(nodes);
                nodes = [];

                floor++;
                floorMax = floor ** 2;
            }

            // don't enqueu nulls
            if (!node) continue;

            queue.push(node.left);
            queue.push(node.right);
        }

        return tree;
    }
}
exports.default = BSTCore;
},{"./controllers":1,"./node":5,"./object-attributes":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: add Proxy

exports.default = _main2.default;
},{"./main":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validators = require("./validators");

var _validators2 = _interopRequireDefault(_validators);

var _node = require("./node");

var _node2 = _interopRequireDefault(_node);

var _core = require("./core");

var _core2 = _interopRequireDefault(_core);

var _objectAttributes = require("./object-attributes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// save private attributes outside of the class
/*
    reference: https://en.wikipedia.org/wiki/Tree_traversal
*/

const g = new WeakMap();

// options are saved as private data
const o = new WeakMap();

/*
    todo:
    - node.data - unique / dupli.
*/

class BinarySearchTree {
    /*
        @param {Object|this} - options or instance of BinarySearchTree (copy constructor)
    */
    constructor(options) {
        // copy constructor
        if (options instanceof BinarySearchTree) {
            const other = options;
            const copy = new this.constructor(o.get(other));

            return copy.merge(other);
        }

        (0, _objectAttributes.permanent)(this, {
            root: null,
            size: 0
        });

        o.set(this, options);

        const core = new _core2.default(options);
        g.set(this, core);

        (0, _objectAttributes.constant)(this, "dataType", core.controllers.dataType);
    }

    /*
        basic interface
     */
    insert(data) {
        const core = g.get(this);

        if (!core.valid(data)) return false;

        const result = core.insert(this.root, data);

        if (!result) return false;

        this.root = result;

        this.size++;

        return true;
    }

    /**
     * delete a node with specic data
     * @param  {*} data - anything, it depends on default set up data type
     * @return {Boolean}
     */
    delete(data) {
        const core = g.get(this);

        if (!core.valid(data)) return false;

        const container = { node: this.root };

        if (core.delete(container, data)) {
            this.root = container.node;

            this.size--;
            return true;
        }

        return false;
    }

    /**
     * check if the tree includes node with such a data
     * @param  {*} data - anything, it depends on default set up data type
     * @param {Node} node - default is root of tree, but it can be any node
     * @return {Boolean}
     */
    includes(data, node = this.root) {
        _validators2.default.node("includes", node);

        const core = g.get(this);

        return core.valid(data) && core.includes(node, data);
    }

    /**
     * find a node with specific data
     * @param  {*} data - anything, it depends on default set up data type
     * @param {Node} node - default is root of tree, but it can be any node
     * @return {Node|null}
     */
    findNode(data, node = this.root) {
        _validators2.default.node("findNode", node);

        const core = g.get(this);

        if (!core.valid(data)) return null;

        return core.findNode(node, data);
    }

    getMin(node = this.root) {
        if (!_validators2.default.node("getMin", node)) return null;

        return g.get(this).getMin(node);
    }

    getMax(node = this.root) {
        if (!_validators2.default.node("getMax", node)) return null;

        return g.get(this).getMax(node);
    }

    getHeight(node = this.root) {
        if (!_validators2.default.node("getHeight", node)) return null;

        return g.get(this).getHeight(node);
    }

    isBalanced(node = this.root) {
        if (!_validators2.default.node("isBalanced", node)) return null;

        return g.get(this).isBalanced(node);
    }

    /*
        time complexity - O(2n) - where n is number of elements in this tree
    */
    balance() {
        if (!this.root) return;

        const core = g.get(this);

        // get sorted elements from whole tree
        // complexity - O(n) - n is number of elements in this tree
        const elements = core.getSortedData(this.root);

        const newRoot = new _node2.default();

        core.balance(newRoot, elements);

        this.root = newRoot;

        return this;
    }

    /**
     * destroy whole tree, all nodes
     */
    destroy() {
        this.root = null;
        this.size = 0;

        const options = o.get(this);

        // reset bst core with same options (from constructor)
        g.delete(this);
        g.set(this, new _core2.default(options));

        return this;
    }

    /**
     * collect data from whole tree based on walking type (inorder, postorder, preorder),
     * with complexity O(n) (n-1 is number of nodes hanging on a input node (param node))
     * @param {String} walkingType
     * @param {Node} node - default is root of tree, but it can be any node
     * @return {Array}
     */
    getData(walkingType = "inorder", node = this.root) {
        if (!this.root) return null;

        walkingType = _validators2.default.traversalType(walkingType);

        _validators2.default.node("getData", node);

        const generator = this.traverseDFS(walkingType, node);

        return [...generator];
    }

    *traverseBFS(node = this.root) {
        _validators2.default.node("traverseBFS", node);

        return yield* g.get(this).breadthFirstSearch(node);
    }

    /**
     * get iterator with specific walking type,
     * complexity is O(1) (-> it returns generator, not array of data)
     * @param  {String} walkingType - pre-order, in-order, post-order
     * @param {Node} node - default is root of tree, but it can be any node
     * @return {Generator}
     */
    *traverseDFS(walkingType = "preorder", node = this.root) {
        walkingType = _validators2.default.traversalType(walkingType);

        _validators2.default.node("traverseDFS", node);

        return node ? yield* g.get(this)[walkingType](node) : null;
    }

    /*
        more about toString and when it's called (as 'overloading')
        http://stackoverflow.com/questions/19620667/javascript-operator-overloading
    */
    // toString() {
    //     if (!this.root) {
    //         console.log('Binary search tree is empty!');
    //         return '';
    //     }

    //     const n = new Node('\n');
    //     const queue = [this.root, n];
    //     const core = g.get(this);
    //     let str = '';

    //     while (queue.length) {
    //         let node = queue.shift();
    //         let nodeToString = '';

    //         if (core.valid(node.data)) {
    //             nodeToString = core.toString(node.data);
    //         }

    //         str += nodeToString + (node.data !== '\n' ? ' ' : '');

    //         if (node === n && queue.length) {
    //             queue.push(n);
    //         }

    //         if (node.left) queue.push(node.left);
    //         if (node.right) queue.push(node.right);
    //     }

    //     return str.trim();
    // }

    // todo
    toString(data) {
        if (!this.root) {
            console.log("Binary search tree is empty!");
            return "";
        }

        const current = data ? this.findNode(data) : this.root;

        if (!current) return "";

        const tree = g.get(this).treeStructure(current);
        // get length of last level
        const treeWidth = tree[tree.length - 1].length;
        let string = "";
        const space = " ";

        // print level by level
        tree.forEach((level, levelIndex) => {
            // let paddingLeft = Math.floor((treeWidth - (2 ** levelIndex)) / 2);
            // string += space.repeat(paddingLeft);
            level.forEach(value => {
                string += value + " ";
            });
            string += "\n";
        });

        return string;
    }

    /*
        more about valueOf and when it's called (as 'overloading')
        http://stackoverflow.com/questions/19620667/javascript-operator-overloading
    */
    valueOf() {
        /*
            Binary search tree is data structure, not a number.
            There is no value which could represent the whole tree.
        */
        return NaN;
    }

    /**
     * merge two or more trees together
     * @return {this} instance of current binary tree (which includes all the trees together)
     */
    merge(...trees) {
        if (trees && _validators2.default.array(trees[0])) {
            trees = trees[0];
        }

        const core = g.get(this);

        trees.forEach((tree, index) => {
            if (!_validators2.default.object(tree) || !_validators2.default.constructor(tree, BinarySearchTree)) {
                throw `Invalid input, argument on position ${index} is not instance of BinarySearchTree class.`;
            }

            if (core.validTree(tree)) {
                core.merge(this, core, tree);
            } else {
                throw `Can't merge two binary search trees with different data type: ${this.controllers.dataType} !== ${tree.controllers.dataType}.\n-> Invalid argument on position ${index}/${trees.length}.`;
            }
        });

        return this;
    }
}
exports.default = BinarySearchTree;
},{"./core":2,"./node":5,"./object-attributes":6,"./validators":7}],5:[function(require,module,exports){
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
},{"./object-attributes":6}],6:[function(require,module,exports){
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
},{"./validators":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _node = require("./node");

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        if (!this.object(node) || !this.constructor(node, _node2.default)) {
            throw new TypeError(`Invalid argument '${node}' in '${methodName}' method. It must be an instance of the Node class.`);
        }

        return true;
    },

    traversalType(type) {
        type = type.toLowerCase();

        if (!type.match(/^(in|post|pre)order$/)) {
            throw new TypeError(`First parameter must be 'preorder', 'inorder' or 'postorder', not '${type}'`);
        }

        return type;
    },

    not(name, a, b) {
        const fn = this[name];

        if (!fn) {
            const available = Object.keys(this);
            const indexOfNot = available.indexOf("not");

            available.splice(indexOfNot, 1);

            throw new TypeError(`'${name}' is not defined validator. Select from: ${available.join(", ")}.`);
        }

        return !(name === "constructor" ? fn.call(this, a, b) : fn.call(this, a));
    }
};

exports.default = validators;
},{"./node":5}]},{},[3]);

//# sourceMappingURL=bst-extended.js.map
