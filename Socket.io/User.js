class User {
    constructor(socket, manager, thread)
    {
        this.manager = manager
        this.socket = socket
        this.thread = thread;
        this.data = null;
        this.initEvent();
        this.index = this.manager.list.length; //new User truoc khi push phan tu cuoi cung = length truoc khi push
     }
     
     initEvent()
     {
        this.socket.on('login', this.login.bind(this))
        
        this.socket.on('disconnect', this.disconnect.bind(this))
        
        this.socket.on('getListActive', this.getListActive.bind(this))
        
        this.socket.on('newChat', this.newChat.bind(this))
        
        this.socket.on('onChat', this.onChat.bind(this))
     }
     
    login(data) {
       
        this.data= data;
        this.data.statusOnline = 1;
        this.socket.broadcast.emit("refresh", this.data) //gui du lieu nguoi vua online ve kenh refresh cua nhung nguoi khac
    }
     
    disconnect(data) {
        console.log('disconnect', this.data)
        if(this.data!=null) {
        this.data.statusOnline = 0
        this.socket.broadcast.emit("refresh", this.data)
        // delete listSocket[socket.data.sothutu]
        this.manager.list.splice(this.index, 1);
        }
    }
    
    getListActive() {
        var list = {};
        for(var i in this.manager.list) {
            if(this.manager.list[i].data!=null) {
                list[this.manager.list[i].data.sothutu]= this.manager.list[i].data
            }
        }
        this.socket.emit('getListActive', list)
        console.log('list')
        console.log(list)
    }
    
    /**
    @KÊNH tạo =inbox chat mới 
    */
 
    newChat(data) {
        
      	this.thread.Add(this, this.manager.findUser(data.idUser), data);

    }
    
    onChat(data) {
        this.thread.Send(data);
    }
    


}
module.exports =  User;