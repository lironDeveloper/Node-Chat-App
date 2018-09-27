const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage()', () => {
    it('Should generate the correct message object', () => {
        var from = "Liron";
        var text = "Hello lovely test!";
        var res = generateMessage(from, text);
        expect(res.text).toEqual(text);
        expect(res.from).toEqual(from);
        expect(typeof(res.createdAt)).toBe('number');        
    })
})