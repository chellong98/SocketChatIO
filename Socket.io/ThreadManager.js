var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


class ThreadManager {

    constructor() {
        this.list ={ 
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
        this.db =null;
        this.connectionDB();
        
    }
    
    connectionDB() {
        MongoClient.connect(url, (err, db)=> {
        
          if (err) throw err;
          var dbo = db.db("chatRealTimeReactNative");
        this.db = dbo;
        });
    }
    
    zpad(n, len) {
         return 0..toFixed(len).slice(2,-n.toString().length)+n.toString(); //lay ra 6 ki tu, vi du 12 => 000012
     }
    Add(UserA, UserB, data)
    {
        var id = this.zpad(data.idAccount, 6) + this.zpad(data.idUser, 6)
      	var idThread = this.zpad(data.idUser, 6)+this.zpad(data.idAccount, 6) 
      // 	console.log(idThread)
      // if (thread[idThread]==undefined ) 
        if (this.list[idThread]!=undefined)  id = idThread;
       
      	if(this.list[id]==undefined) {
      // 	console.log(this.id.concat(data.idAccount+data.idUser))
        	this.list[id] = { //new thread
        	  'socketA': UserA,
        	  'socketB': UserB, //socket nguoi nhan
        	  'message': [/***/]
        	    /**/
        	}
      	}else{
      	  	this.list[id].socketA =  UserA
      	  		this.list[id].socketB =  UserB
        	  
      	}
      	try{
        	UserA.socket.emit('newChat', {
              idThread: id,
              message: this.list[id].message,
            })
          UserB.socket.emit('newChat', {
              idThread: id,
              message: this.list[id].message,
          })
      	}catch(e) {
      	  console.log(e)
      	}
    }
    
    Send(data) {
        this.list[data.idThread].message.push({
            idAccount: data.idAccount,
            message: data.message,
            time: new Date()
        })
      // console.log(thread[data.idThread].socketA.socket)
      try{
        if(data.idAccount == this.list[data.idThread].socketA.data.sothutu) { //neu dang la socketA
            console.log('thread')
            console.log(this.list[data.idThread])
            console.log('socketA')
           this.list[data.idThread].socketB.socket.emit('onChat', {idAccount: data.idAccount, time: new Date().toString(), message: data.message}) //gui ve cho B
        }else {
          console.log('socketB')
           this.list[data.idThread].socketA.socket.emit('onChat', {idAccount: data.idAccount,time: new Date().toString(),message: data.message})
        }
      }catch(e) {
        console.log(e)
      }
      console.log('message')
      console.log(this.list[data.idThread])
      
          var message = {
                  idThread:data.idThread ,
                   idAccount: data.idAccount,
                    message: data.message,
                    time: new Date()
          }
          this.cacheDataToDB(message)
      }
    
    cacheDataToDB(message) {
        console.log(message)
        if(this.db==null) return;

        this.db.collection("messages").insertOne(message, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        
         });
    }
    
    deleteAllDataToDB() {
        this.db
          .collection('messages')
          .deleteMany({})
          .then(function(result) {
            
          });
    }
}

module.exports = ThreadManager;