const express =require('express');
const https = require('https');
// const http = require('http');
const fs = require('fs');
const socketIo= require('socket.io');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname,'public')));





const options = {
  key:fs.readFileSync(path.join(__dirname,'sslCert/localhost.key')),
  cert:fs.readFileSync(path.join(__dirname,'sslCert/localhost.crt'))
}





const server = https.createServer(options,app);
// const server =http.createServer(app);
const io = socketIo(server);

let roomUsers = {};
io.on('connection', (socket) => {

    socket.on('room', ({roomId,userName}) => {

      if (roomId=='' || userName=='' || roomId==null || userName == null) {
        socket.emit('room', {message:'Enter a valid input.',status:false});
        return;
        }


      if (!roomUsers[roomId]) {
        roomUsers[roomId] = { users: {}, userCount: 0, maxUsers: 2 };
        }

    // Check if the room is full
    if (roomUsers[roomId].userCount >= roomUsers[roomId].maxUsers) {
        socket.emit('room', {message:'Sorry, this room is full.',status:false});
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
      })

            
            socket.on('disconnect', () => {
              Object.keys(roomUsers).forEach((roomId) => {
                if (roomUsers[roomId].users[socket.id]) {
                    delete roomUsers[roomId].users[socket.id];
                    roomUsers[roomId].userCount--;
                    io.to(roomId).emit('update-user-list', { users: Object.values(roomUsers[roomId].users) });
                }
            });
         });
    });

//////////////////////////////////////

socket.on('paused',(data)=>{
  socket.to(data.to).emit('paused',{paused:true});
})
        
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

  app.get('/',(req,res)=>{
    res.send({file:'index.html'});
})

server.listen(PORT,()=>console.log(`https://localhost:${PORT}`))