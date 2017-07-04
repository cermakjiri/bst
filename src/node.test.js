import { expect } from "chai";
import Node from "./node";

describe("src/node.js - Node class", () => {
    describe("empty Node", () => {
        const node = new Node();

        it("Node data should be undefined as default", done => {
            expect(node.data).to.equal(undefined);
            done();
        });

        it("Node left and right should be null as default", done => {
            expect(node.left).to.equal(null);
            expect(node.right).to.equal(null);
            done();
        });

        it("Node attributes shouldn't be possible to delete", done => {
            Object.keys(node).forEach(attribute => {
                delete node[attribute];

                expect(node.hasOwnProperty(attribute)).to.equal(true);
            });

            done();
        });
    });

    describe("Node with a value", () => {
        const left = new Node(5);
        const right = new Node(15);
        const node = new Node(10, left, right);

        it("Node with data (value, access left and right sub-node)", done => {
            expect(node.left.data).to.equal(5);
            expect(node.data).to.equal(10);
            expect(node.right.data).to.equal(15);
            done();
        });
    });
});
