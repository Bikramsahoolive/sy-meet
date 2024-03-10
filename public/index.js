
let isScreenShared = false;
let isVideoShared = false;
let isAudioShared = false;

let videoStream = null;
let audioStream = null;
let screenStream = null;

let cameraBtn = document.getElementById('camera-btn');
let audioBtn = document.getElementById('audio-btn');
let screenBtn = document.getElementById('screen-btn');



async function videoShare() {
    let isClass = cameraBtn.classList.contains('fa-video-slash');
    cameraBtn.classList = isClass ? 'fa-solid fa-video red' : 'fa-solid fa-video-slash red'
    isVideoShared = !isVideoShared;
    let clientVideo = document.getElementById('client-video');
    if (isVideoShared) {
        cameraBtn.style.backgroundColor = 'rgb(69, 96, 214)';
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              videoStream=stream;
                stream.getTracks().forEach(track => {
                  peerConnection.addTrack(track, videoStream);
              });
              clientVideo.style.display='block'
              clientVideo.srcObject = stream;
              let uid =  sessionStorage.getItem('uid');
              let sid = sessionStorage.getItem('sid');
              initiateCall(sid,uid);
            })
            .catch(err => console.log(err));

    } else {
        cameraBtn.style.backgroundColor = 'rgb(211, 7, 7)';
        let tracks = videoStream.getTracks();
        tracks.forEach(track => {
            track.stop();
        });
        videoStream = null;
        clientVideo.style.display='none';
        videoPaused();

        

    }


}

function audioShare() {
    let isClass = audioBtn.classList.contains('fa-microphone-slash');
    audioBtn.classList = isClass ? 'fa-solid fa-microphone red' : 'fa-solid fa-microphone-slash red'
    isAudioShared = !isAudioShared;
    // let clientAudio = document.getElementById('client-audio');
    if (isAudioShared) {
        audioBtn.style.backgroundColor = 'rgb(69, 96, 214)';
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                audioStream = stream
                
                stream.getTracks().forEach(track => {
                  peerConnection.addTrack(track, audioStream);
              });

              let uid = sessionStorage.getItem('uid');
              let sid = sessionStorage.getItem('sid');
              initiateCall(sid,uid);
                
            })
            .catch(err => console.log(err))
    } else {
        audioBtn.style.backgroundColor = 'rgb(211, 7, 7)';
        let tracks = audioStream.getTracks();
        tracks.forEach(track => {
            track.stop();
        });
        audioStream = null;
    }



}

function screenShare() {
    isScreenShared = !isScreenShared;
    let clientScreen = document.getElementById('client-screen')

    if (isScreenShared) {
        screenBtn.style.backgroundColor = 'rgb(69, 96, 214)';
        navigator.mediaDevices.getDisplayMedia({ video: true })
            .then((stream) => {
              screenStream = stream
                stream.getTracks().forEach(track => {
                  peerConnection.addTrack(track, screenStream);
              });
              clientScreen.style.display='block';
              clientScreen.srcObject = stream;
              let uid = sessionStorage.getItem('uid');
              let sid = sessionStorage.getItem('sid');
              initiateCall(sid,uid);

            })
            .catch(err => console.log(err))

    } else {
        screenBtn.style.backgroundColor = 'rgb(211, 7, 7)';
        let tracks = screenStream.getTracks();
        tracks.forEach(track => {
            track.stop();
        });
        screenStream = null;
        clientScreen.style.display='none';
        videoPaused();

    }


}
cameraBtn.addEventListener('click', videoShare);
audioBtn.addEventListener('click', audioShare);
screenBtn.addEventListener('click', screenShare);


/////////////////////////////////////////////////////////////////////////////


// const remoteScreen = document.getElementById('remote-screen');
const remoteVideo = document.getElementById('remote-video');
const remoteAudio =document.getElementById('remote-audio');

const hangupButton = document.getElementById('hang-up');



const socket = io();



socket.on('text',({from,message})=>{
  let pre = document.createElement('pre');
  pre.innerHTML=`${from} : ${message}`;
  document.getElementById('text').appendChild(pre);
  scrollDown();
})

function scrollDown(){
  let messageArea = document.getElementById('text');
  messageArea.scrollTop = messageArea.scrollHeight;
}

function chatToggle(){
  let chatbox = document.getElementById('chat-box');
  chatbox.classList.toggle('textdoc-open');
  let chatInput = document.getElementById('msgInput');
  chatInput.classList.toggle('msg-input-open');
}

function sendMsg(){
  let msgVal = document.getElementById('text-msg');
  if(msgVal.value!==""){
    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');
    let name =urlparams.get('name');
    socket.emit('text',{from:name ,to:id, message:msgVal.value});
    msgVal.value=""
  }
}

function videoPaused(){
  let uid = sessionStorage.getItem('uid');
  socket.emit('paused',{to:uid});
}

socket.on('paused',(data)=>{
  console.log('video paused');
  if(data.paused){
    
    remoteVideo.style.display='none';
  }
})

function joinroom(){
  let paramid = window.location.search;
  let urlparams =new URLSearchParams(paramid);
  let id =urlparams.get('id');
  let name =urlparams.get('name');
  if(id!==null && name!==null && id!=='' && name !==''){
    socket.emit('room',{roomId:id,userName:name});
  }
}

socket.on('room',(data)=>{
  // console.log(data);
    if (data.status){
      let paramid = window.location.search;
      let urlparams =new URLSearchParams(paramid);
      let id =urlparams.get('id');
      let name =urlparams.get('name');

      document.getElementById('name').innerHTML=name;
      document.getElementById('room-id').innerHTML=id;

      document.querySelector('.user-details').style.display='flex';
      document.querySelector('.join').style.display='none';
      document.querySelector('.main').style.display='block';
    }else{
      let err = document.querySelector('.container h5');
      err.style.visibility = 'visible';
      document.getElementById('err').innerHTML=data.message;
      setTimeout(()=>{
        err.style.visibility = 'hidden';
      },5000)
    }
})



  
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
});
       
peerConnection.ontrack = (event) => {
  // console.log(`ontrack ${event.track.kind}`);
  if (event.track.kind === 'video') {
    remoteVideo.style.display='block';
        remoteVideo.srcObject = event.streams[0];
    
} else if (event.track.kind === 'audio') {
  
    // if (!remoteVideoElement.srcObject.getAudioTracks().length) {
    //     remoteVideoElement.srcObject.addTrack(event.track);
    remoteAudio.srcObject = event.streams[0];
    remoteAudio.play();
    }
}          
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('ice-candidate', { to: otherUserId, candidate: event.candidate });
  }
};

let otherUserId;



socket.on('update-user-list', ( users ) => {
  // console.log(users.users[0]);
  displayUsers(users.users);
});

socket.on('offer', (data) => {
  otherUserId = data.from;
  const remoteOffer = data.sdp;
  // const stat = confirm('new join Request');
    peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer))
    .then(() => peerConnection.createAnswer())
    .then((answer) => peerConnection.setLocalDescription(answer))
    .then(() => socket.emit('answer', { to: data.from, sdp: peerConnection.localDescription }))
    .catch(error => console.error('Error setting remote description:', error));  
});

socket.on('answer', (data) => {
  // console.log(data);
  const remoteAnswer = data.sdp;
  peerConnection.setRemoteDescription(new RTCSessionDescription(remoteAnswer))
  .then(()=>{
    console.log("connection established");

})
  .catch(error => console.error('Error setting remote description:', error));
});

socket.on('ice-candidate', (data) => {
  peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
});

function displayUsers(users) {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  sessionStorage.setItem('sid',socket.id);
  users.forEach(user => {
    if (user.id === socket.id) return;
    sessionStorage.setItem('uid',user.id);
    const userElement = document.createElement('li');
    let contentDiv = `<div></div><strong>${user.name}</strong>`;
    userElement.innerHTML = contentDiv;
    userElement.addEventListener('click', () =>{
    // console.log("clicked");
     initiateCall(socket.id,user.id);
    });
    userList.appendChild(userElement);
  });
}

function initiateCall(fromId,toId) {
  // console.log(fromId,toId);
  peerConnection.createOffer()
    .then((offer) => peerConnection.setLocalDescription(offer))
    .then(() => socket.emit('offer', { from:fromId,to: toId, sdp: peerConnection.localDescription }))
    .catch(error => console.error('Error creating offer:', error));
}

hangupButton.addEventListener('click', () => {
  console.log("hangup");
    
    if (peerConnection) {
        peerConnection.close();
    }

    // socket.emit('hangup', { /* details if needed */ });

    window.location.href='/';
});




window.onload=joinroom;