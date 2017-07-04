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