const express =require('express');
const socketIo= require('socket.io');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname,'public')));




// const https = require('https');
// const fs = require('fs');
// const options = {
//   key:fs.readFileSync(path.join(__dirname,'sslCert/localhost.key')),
//   cert:fs.readFileSync(path.join(__dirname,'sslCert/localhost.crt'))
// }
// const server = https.createServer(options,app);





const http = require('http');
const server =http.createServer(app);


let roomUsers = {};
let roomIds=[];
let defultRoomIds= ['123456'];
const constDefultRoomIds = ['123456'];




const io = socketIo(server,{
  maxHttpBufferSize: 2e7,
  pingTimeout:1800000,
  // pingInterval:25000
});

io.on('connection', (socket) => {

    socket.on('create-meet',({})=>{
      // if(name=='admin'|| name=='Admin')return;
      let id = Math.floor(Math.random()*1000000+100000);
      roomIds.push(id);
      socket.emit('create-meet',{status:true,rid:id});
    });

    socket.on('room', ({roomId,userName}) => {

      if (roomId=='' || userName=='' || roomId==null || userName == null) {
        socket.emit('room', {message:'Enter a valid input.',status:false});
        return;
        }

        defultRoomIds.forEach((id)=>{
          if(roomId==id){
            roomIds.push(roomId);
          }
        });
        

        let roomAvail = roomIds.filter((id)=>{
              if(id==roomId){
                return id;
              }
        });

        if(roomAvail.length==0){
          socket.emit('room', {message:'Meet ID was closed or invalid',status:false});
          return;
        }
        

      if (!roomUsers[roomId]) {
        roomUsers[roomId] = { users: {}, userCount: 0, maxUsers: 2 };
        }

    if (roomUsers[roomId].userCount >= roomUsers[roomId].maxUsers) {
        socket.emit('room', {message:'sorry! this room is full.',status:false});
        return;
    }


      socket.join(roomId);

       roomUsers[roomId].users[socket.id] ={ id: socket.id, name: userName };
        roomUsers[roomId].userCount++;
        socket.emit('room',{status:true,message:"Room Joined."});
        
        if (!roomUsers[roomId]) {
          roomUsers[roomId] = new Set();
          }

      io.to(roomId).emit('update-user-list', { users: Object.values(roomUsers[roomId].users) });

        
          
      socket.on('text',({from,to,message})=>{
        io.to(to).emit('text',{from,message});
      });

      socket.on('image',({from,to,file})=>{
      
          io.to(to).emit('image',{from,file});
        
      });

      // socket.on('video',({from,to,file})=>{
      //   io.to(to).emit('video',{from,file});
      // });

      // socket.on('pdf',({from,to,file})=>{
      //   io.to(to).emit('pdf',{from,file});
      // });

      socket.on('file',({from,to,file,message})=>{
        io.to(to).emit('file',{from,file,message});
      });

            
            socket.on('disconnect', () => {
              
              Object.keys(roomUsers).forEach((roomId) => {
                if (roomUsers[roomId].users[socket.id]) {
                  
                  Object.keys(roomUsers).forEach((roomId) => {
                    if (roomUsers[roomId].users[socket.id]) {
                        roomIds.pop(roomId);
                        
                    }


                    });

                    delete roomUsers[roomId].users[socket.id];
                    roomUsers[roomId].userCount--;
                    io.to(roomId).emit('update-user-list', { users: Object.values(roomUsers[roomId].users) });
                    io.to(roomId).emit('connection-lost',{disconnected:true});
                }
            });
         });
    });

//////////////////////////////////////
//////////  SIGNALING  ///////////////
//////////////////////////////////////
              //////
              //////
              //////
              //////
        /////////////////
         ///////////////
          ////////////
           /////////
            ///////
             ////
              //
              

socket.on('video-paused',(data)=>{
  socket.to(data.to).emit('video-paused',{paused:true});
});

socket.on('audio-paused',(data)=>{
  socket.to(data.to).emit('audio-paused',{paused:true});
});
        
    socket.on('ice-candidate', (data) => {
      // console.log(data);
      socket.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: data.from });
    });
  
    socket.on('offer', (data) => {
      socket.to(data.to).emit('offer', { sdp: data.sdp, from: data.from });
    });

    socket.on('answer', (data) => {
      // console.log(data.from,data.to);
      socket.to(data.to).emit('answer', { sdp: data.sdp, from: data.from });
    });
  });

  function deleteMeetId(idb){

    defultRoomIds.forEach((id)=>{
      if (id==idb){
        defultRoomIds.pop(id);
      }
    })
  }

  app.get('/',(req,res)=>{
    res.send({file:'index.html'});
  })
  
  app.get('/connect/:id',(req,res)=>{
    let id= req.params.id;
    constDefultRoomIds.forEach((ids)=>{
      if(ids!==id)defultRoomIds.push(id);
    })
    res.redirect(`/?name=Admin&id=${id}`);
     setTimeout(()=>deleteMeetId(id),1800000);
  });
  
  app.get('/disconnect/:id',(req,res)=>{
    let id= req.params.id;
    deleteMeetId(id);
    res.redirect('https://syi.onrender.com/reg-data');
  })

server.listen(PORT,()=>console.log(`https://localhost:${PORT}`));