const utils = require("./utils")
// @ponicode
describe("utils.isUrl", () => {
    test("0", () => {
        let callFunction = () => {
            utils.isUrl("https://croplands.org/app/a/confirm?t=")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.isUrl("https://accounts.google.com/o/oauth2/revoke?token=%s")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.isUrl("https://api.telegram.org/bot")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.isUrl("Www.GooGle.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.isUrl("http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isUrl(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
