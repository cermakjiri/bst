import { permanent } from './object-attributes';

export default class Node {
    constructor(data, left = null, right = null) {
        permanent(this, {
            data: data,
            left: left,
            right: right
        });
    }
}
