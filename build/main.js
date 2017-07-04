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