var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(9000);
var listSocket={};
var thread = {
  'id': {
    'socketA': {
      
    },
    'socketB': {
      
    },
    'message': [
      {
        'idAccount': 'adasdas',
        'message':"tinnhan",
        'time': ''
      },
       {
        'idAccount': 'adasdas',
        'message':"tinnhan"
      }  
    ]
  }
}

function handler (req, res) {
  
}
/**
  @mở connection 
*/
io.on('connection', function (socket) {

  // lstSocket.push(socket);
  
  // socket.emit('testSocketOn', 'hello')
  /**
    @KÊNH LOGIN 
  */
  socket.on('login',function(data){ //kenh login
    this.data = data;
    data.statusOnline = 1;
    // console.log(data.sothutu)
  	listSocket[data.sothutu] = {socket: socket, user: data}
    this.broadcast.emit("refresh", data) //gui du lieu nguoi vua online ve kenh refresh cua nhung nguoi khac
  })
  /**
    @KÊNH disconnect
  */
  socket.on('disconnect', function(data){ //su kien disconnect
  console.log('disconnect', this.data)
      if(this.data!=null) {
        this.data.statusOnline = 0
        this.broadcast.emit("refresh", this.data)
        // delete listSocket[socket.data.sothutu]
        delete listSocket[this.data.sothutu]
      }
      return
  })
  
  /**
    @kênh getListActive 
  */
  socket.on('getListActive', function(){ //get list user
    var list = {};
    for(var i in listSocket) {
      list[i]= listSocket[i].user
    }
    this.emit('getListActive', list)
    console.log('list')
    console.log(list)
  })

  /**
    @KÊNH tạo =inbox chat mới 
  */
  socket.on('newChat', function(data){
  // 	console.log(JSON.stringify(data))
  	 function zpad(n, len) {
     return 0..toFixed(len).slice(2,-n.toString().length)+n.toString(); //lay ra 6 ki tu, vi du 12 => 000012
  	}
  	var idThread = zpad(data.idAccount, 6) + zpad(data.idUser, 6)
  	var idThread2 = zpad(data.idUser, 6)+zpad(data.idAccount, 6) 
  // 	console.log(idThread)
  // if (thread[idThread]==undefined ) 
    if (thread[idThread2]!=undefined)  idThread = idThread2;
   
  	if(thread[idThread]==undefined) {
  // 	console.log(this.id.concat(data.idAccount+data.idUser))
    	thread[idThread] = { //new thread
    	  'socketA': listSocket[this.data.sothutu],
    	  'socketB': listSocket[data.idUser], //socket nguoi nhan
    	  'message': [/***/]
    	    /**/
    	}
  	}else{
  	  	thread[idThread].socketA =  listSocket[this.data.sothutu]
  	  		thread[idThread].socketB =   listSocket[data.idUser]
    	  
  	}
  	try{
    	this.emit('newChat', {
          idThread: idThread,
          message: thread[idThread].message,
        })
      thread[idThread].socketB.socket.emit('newChat', {
          idThread: idThread,
          message: thread[idThread].message,
      })
  	}catch(e) {
  	  console.log(e)
  	}
  })
  /**
    @KÊNH onchat 
  */
  socket.on('onChat', function(data) {
    // console.log('data')
    //   console.log(data)
    
    thread[data.idThread].message.push(
      {
        idAccount: this.data.sothutu,
        message: data.message,
        time: new Date()
      })
      // console.log(thread[data.idThread].socketA.socket)
      try{
        if(this.data.sothutu == thread[data.idThread].socketA.user.sothutu) { //neu dang la socketA
          console.log('socketA')
           thread[data.idThread].socketB.socket.emit('onChat', {idAccount: data.idAccount, time: new Date().toString(), message: data.message}) //gui ve cho B
        }else {
          console.log('socketB')
           thread[data.idThread].socketA.socket.emit('onChat', {idAccount: data.idAccount,time: new Date().toString(),message: data.message})
        }
      }catch(e) {
        console.log(e)
      }
      console.log('message')
      console.log(thread[data.idThread])
      
  })
  
});

// ##client

//   socket.emit('news',{"mess":,threadid:});
