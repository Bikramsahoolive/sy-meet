
// //    1

// const socket = io();

// const localVideo = document.getElementById('client-video');
// const remoteVideo = document.getElementById('client-screen');
// const hangupButton = document.getElementById('hang-up');

  
// const peerConnection = new RTCPeerConnection({
//   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
// });

// //         
// let localStream = null;

// navigator.mediaDevices.getUserMedia({ video: true,audio:true })
//   .then((stream) => {
//     localStream = stream;
//     localVideo.srcObject = stream;
//     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//   })
//   .catch((error) => console.error('getUserMedia error:', error));

//   //         
// peerConnection.ontrack = (event) => {
//   remoteVideo.srcObject = event.streams[0];
// };
// //           
// peerConnection.onicecandidate = (event) => {
//   if (event.candidate) {
//     socket.emit('ice-candidate', { to: otherUserId, candidate: event.candidate });
//   }
// };

// let otherUserId;


// //          5
// socket.on('update-user-list', ({ users }) => {
//   displayUsers(users);
// });
// //     9
// socket.on('offer', (data) => {
//   console.log(data.from);
//   otherUserId = data.from;
//   const remoteOffer = data.sdp;
//   const stat = confirm('new join Request');
//   if (stat){
//     console.log("Confirmed.");
//     peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer))
//     .then(() => peerConnection.createAnswer())
//     .then((answer) => peerConnection.setLocalDescription(answer))
//     .then(() => socket.emit('answer', { to: data.from, sdp: peerConnection.localDescription }))
//     .catch(error => console.error('Error setting remote description:', error));

//   }
  
// });
// //     11
// socket.on('answer', (data) => {
//   console.log(data);
//   const remoteAnswer = data.sdp;
//   peerConnection.setRemoteDescription(new RTCSessionDescription(remoteAnswer))
//   .then(()=>{
//     console.log("connection established");
//     // hangupButton.disabled=false;

// })
//   .catch(error => console.error('Error setting remote description:', error));
// });

// //        
// socket.on('ice-candidate', (data) => {
//   peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
// });
// //  6
// function displayUsers(users) {
//   const userList = document.getElementById('userList');
//   userList.innerHTML = '';
//   users.forEach(userId => {
//     if (userId === socket.id) return;
//     const userElement = document.createElement('li');
//     userElement.textContent = `User: ${userId}`;
//     userElement.addEventListener('click', () =>{
//     console.log("clicked");
//      initiateCall(socket.id,userId);
//     });
//     userList.appendChild(userElement);
//   });
// }
// //     7
// function initiateCall(fromId,toId) {
//   // console.log(userId);
//   // otherUserId = userId;
//   peerConnection.createOffer()
//     .then((offer) => peerConnection.setLocalDescription(offer))
//     .then(() => socket.emit('offer', { from:fromId,to: toId, sdp: peerConnection.localDescription }))
//     .catch(error => console.error('Error creating offer:', error));
// }




// hangupButton.addEventListener('click', () => {
//   console.log("hangup");
    
//     if (peerConnection) {
//         peerConnection.close();
//         peerConnection = null;
//     }

  
//     if (localStream) {
//         localStream.getTracks().forEach(track => {
//             track.stop();
//         });
//     }

  
//     if (remoteStream) {
//         remoteStream.getTracks().forEach(track => {
//             track.stop();
//         });
//     }
//     socket.emit('hangup', { /* details if needed */ });
// });