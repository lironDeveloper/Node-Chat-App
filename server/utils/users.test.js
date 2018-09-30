const expect = require('expect');

const {Users} = require('./users');



describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Liron',
            room: 'Node'
        }, {
            id: '2',
            name: 'Adam',
            room: 'React'
        }, {
            id: '3',
            name: 'Elinor',
            room: 'Node'
        }];
    });

    it('Should add new user', () => {
        var users = new Users();
        var id = 123;
        var name = 'Liron';
        var room = 'Node';
        var user = {id, name, room};
        var resUser = users.addUser(id, name, room);
    
        expect(users.users).toEqual([user]);
        expect(resUser.id).toEqual(id);
        expect(resUser.name).toEqual(name);
        expect(resUser.room).toEqual(room);    
    });

    it('Should remove a user', () => {
        var userRemoved = users.removeUser('1'); 
        expect(userRemoved).toEqual({
            id: '1',
            name: 'Liron',
            room: 'Node'
        });
        expect(users.users).toHaveLength(2);
    });

    it('Should not remove a user', () => {
        var userRemoved = users.removeUser('12313213'); 
        expect(userRemoved).toBeFalsy();
        expect(users.users).toEqual([{
            id: '1',
            name: 'Liron',
            room: 'Node'
        }, {
            id: '2',
            name: 'Adam',
            room: 'React'
        }, {
            id: '3',
            name: 'Elinor',
            room: 'Node'
        }]);
    });

    it('Should find user', () => {
        var foundUser = users.getUser('1'); 
        expect(foundUser).toEqual({
            id: '1',
            name: 'Liron',
            room: 'Node'
        });
    });

    it('Should not find user', () => {
        var foundUser = users.getUser('123123'); 
        expect(foundUser).toBeFalsy();
        expect(users.users).toEqual([{
            id: '1',
            name: 'Liron',
            room: 'Node'
        }, {
            id: '2',
            name: 'Adam',
            room: 'React'
        }, {
            id: '3',
            name: 'Elinor',
            room: 'Node'
        }]);
    });

    it('Should return names for node course', () => {
        var userList = users.getUserList('Node');
        expect(userList).toEqual(['Liron', 'Elinor']);
    });

    it('Should return names for react course', () => {
        var userList = users.getUserList('React');
        expect(userList).toEqual(['Adam']);
    });
});