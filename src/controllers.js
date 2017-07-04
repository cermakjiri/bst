import validators from "./validators";
import { constant } from "./object-attributes";

const validControllers = ["valid", "compare", "toString"];
const defaultsDataTypes = [
    "number",
    "string",
    "array",
    "object",
    "map",
    "weakmap",
    "set",
    "weakset"
];

export default class Controllers {
    constructor(options) {
        // the tree can contains data with only one type
        // such a number, string, array, ..., or you can set custom data
        // and you must create custom checking method for that type
        constant(this, "dataType", options.dataType || "number");

        /*
            controller is object containing default methods for data validation, comparing, etc.,
            but you can override them with your custom methods
        */
        const fn = options[this.dataType] || validators[this.dataType];

        // set validator
        if (fn) {
            constant(this, "validator", fn);
        } else {
            throw `Missing validator for '${this
                .dataType}'. Choose from default data types (${defaultsDataTypes.join(
                ", "
            )}) or if you set your own.\nIf you set your own data type, you must create method with the same name, which will check if inserted data are of that type.`;
        }

        // set custom controllers
        validControllers.forEach(name => {
            const fn = options[name];

            if (fn && options.hasOwnProperty(name)) {
                constant(this, name, fn);
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
