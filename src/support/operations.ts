export class Operations {

    //хелпер суммы
    static sum(...nums: number[]) {
        var i
        var sum: number = 0

        for (i = 0; i < nums.length; i++) {
            sum = sum + nums[i]
        }

        return sum
    }

    //хелпер разности
    static diff(...nums: number[]) {
        if (nums.length === 0) {
            return 0
        }

        if (nums.length === 1) {
            return nums[0]
        }

        if (nums.length === 2) {
            return nums[0] - nums[1]
        }

        let i
        let diff: number = nums[0] - nums[1]

        for (i = 2; i < nums.length; i++) {
            diff = diff - nums[i]
        }

        return diff
    }

    //хелпер сравнения
    static compare(arg1: number, arg2: number, operation: string): number {
        if (eval(arg1 + operation + arg2)) {
            return 1
        }
        return 0
    }
}
