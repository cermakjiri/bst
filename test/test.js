import { expect } from "chai";
import BST from "../build/bst-extended";

describe("build/bst-extended.js - BinarySearchTree class", () => {
    describe("Test default type (number)", () => {
        describe("Test default attributes", () => {
            const bst = new BST();

            it("Should be empty", () => {
                expect(bst.root).to.equal(null);
                expect(bst.size).to.equal(0);
            });

            it("Data type should be number", () => {
                expect(bst.dataType).to.equal("number");
            });
        });

        describe("Test basic operations", () => {
            const bst = new BST();

            it("insert() operation", () => {
                expect(bst.insert(1)).to.be.true;
                expect(bst.size).to.equal(1);
                expect(bst.insert(-10)).to.be.true;
                expect(bst.size).to.equal(2);
                expect(bst.insert(20)).to.be.true;

                expect(bst.insert(20)).to.be.false;
                expect(bst.insert()).to.be.false;
                expect(bst.insert(null)).to.be.false;
                expect(bst.insert([])).to.be.false;
                expect(bst.insert({})).to.be.false;
                expect(bst.insert("abc")).to.be.false;

                expect(bst.size).to.equal(3);
            });

            it("includes() operation", () => {
                expect(bst.includes(1)).to.be.true;
                expect(bst.includes(-10)).to.be.true;
                expect(bst.includes([])).to.be.false;
                expect(bst.includes()).to.be.false;
                expect(bst.includes(null)).to.be.false;
                expect(bst.includes({})).to.be.false;
                expect(bst.includes("abc")).to.be.false;
            });

            it("delete() operation", () => {
                expect(bst.delete(1)).to.be.true;
                expect(bst.size).to.equal(2);
                expect(bst.delete(1)).to.be.false;
                expect(bst.delete(7)).to.be.false;
                expect(bst.delete()).to.be.false;
                expect(bst.delete({})).to.be.false;
                expect(bst.delete([])).to.be.false;
                expect(bst.delete("abc")).to.be.false;
            });
        });
    });
});
