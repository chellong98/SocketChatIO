// import User from './User';
const User = require("./User")
const ThreadManager = require("./ThreadManager")
class socketmanager {
    constructor(io) {
        this.list = [];
        io.on('connection',  (socket)=> {
            var user = new User(socket,this,this.thread);
            this.list.push(user)
        })
        this.thread = new ThreadManager();
    }
    
    findUser(idUser){
        for( var i in this.list) {
            if(this.list[i].data==null) continue;
            if(idUser==this.list[i].data.sothutu) {
                return this.list[i];
            }
        }
    }
}
module.exports = socketmanager;