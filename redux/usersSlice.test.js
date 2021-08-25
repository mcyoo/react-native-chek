const usersSlice = require("./usersSlice")
// @ponicode
describe("usersSlice.userSave", () => {
    test("0", () => {
        let callFunction = () => {
            usersSlice.userSave("}")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            usersSlice.userSave("~@")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            usersSlice.userSave("%}")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            usersSlice.userSave("(")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            usersSlice.userSave("):")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            usersSlice.userSave(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
