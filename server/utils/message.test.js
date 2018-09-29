const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage()', () => {
    it('Should generate the correct message object', () => {
        var from = "Liron";
        var text = "Hello lovely test!";
        var res = generateMessage(from, text);
        expect(res.text).toEqual(text);
        expect(res.from).toEqual(from);
        expect(typeof(res.createdAt)).toBe('number');        
    });
});

describe('generateLocationMessage', () => {
    it('Should generate correct location object', () => {
        var from = "Liron";
        var lat = 32.304033;
        var lng = 34.880526;
        var res = generateLocationMessage(from, lat, lng);
        expect(res.from).toEqual(from);
        expect(res.url).toEqual(`https://www.google.com/maps/?q=${lat},${lng}`);
        expect(typeof(res.createdAt)).toBe('number');  
    })
})