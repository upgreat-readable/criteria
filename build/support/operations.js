"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = void 0;
var Operations = /** @class */ (function () {
    function Operations() {
    }
    //хелпер суммы
    Operations.sum = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        var i;
        var sum = 0;
        for (i = 0; i < nums.length; i++) {
            sum = sum + nums[i];
        }
        return sum;
    };
    //хелпер разности
    Operations.diff = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        if (nums.length === 0) {
            return 0;
        }
        if (nums.length === 1) {
            return nums[0];
        }
        if (nums.length === 2) {
            return nums[0] - nums[1];
        }
        var i;
        var diff = nums[0] - nums[1];
        for (i = 2; i < nums.length; i++) {
            diff = diff - nums[i];
        }
        return diff;
    };
    //хелпер сравнения
    Operations.compare = function (arg1, arg2, operation) {
        if (eval(arg1 + operation + arg2)) {
            return 1;
        }
        return 0;
    };
    return Operations;
}());
exports.Operations = Operations;
