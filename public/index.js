
let isScreenShared = false;
let isVideoShared = false;
let isAudioShared = false;

// let videoActive = false;
let camSwithc = true;

let isMuted=true;

let videoStream = null;
let audioStream = null;
let screenStream = null;

let cameraBtn = document.getElementById('camera-btn');
let audioBtn = document.getElementById('audio-btn');
let switchCam = document.getElementById('switch-cam');
let screenBtn = document.getElementById('screen-btn');
let speakerBtn = document.getElementById('speaker');
let clientVdoBtn= document.querySelector('.video i');



 function videoShare(){
  isVideoShared = !isVideoShared;
    // videoActive = !videoActive;
    let clientVideo = document.getElementById('client-video');
    
    if (isVideoShared) {
      
        navigator.mediaDevices.getUserMedia({ video:true })
            .then((stream) => {
              videoStream=stream;
                stream.getTracks().forEach(track => {
                  peerConnection.addTrack(track, videoStream);
              });
              clientVdoBtn.style.visibility='visible';
              switchCam.style.display='block';
              cameraBtn.classList = 'fa-solid fa-video red';
              cameraBtn.style.backgroundColor = 'rgb(69, 96, 214)';
              
              clientVideo.style.display='block'
              clientVideo.srcObject = stream;
              let uid =  sessionStorage.getItem('uid');
              let sid = sessionStorage.getItem('sid');
              initiateCall(sid,uid);
            })
            .catch(err => console.log(err));

    } else {
        let tracks = videoStream.getTracks();
        tracks.forEach(track => {
            track.stop();        
        });
        isVideoShared=false;
        switchCam.style.display='none';
        videoStream = null;
        clientVdoBtn.style.visibility='hidden';
        document.querySelector('.video i').classList='fa-solid fa-angle-up';
        clientVideo.style.display='none';

        cameraBtn.classList ='fa-solid fa-video-slash red';
        cameraBtn.style.backgroundColor = 'rgb(211, 7, 7)';
        
        videoPaused();

       if (isScreenShared){
        isScreenShared= false;
        screenShare();
       }

    }

}

 function webVideoShare(){
  let clientVideo = document.getElementById('client-video');
  let tracks = videoStream.getTracks();
      tracks.forEach(track => {
          track.stop();
      });
      videoStream = null;
      navigator.mediaDevices.getUserMedia({ video:{facingMode:"user"} })
          .then((stream) => {
            videoStream=stream;
              stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, videoStream);
            });
            clientVideo.srcObject = stream;
            let uid =  sessionStorage.getItem('uid');
            let sid = sessionStorage.getItem('sid');
            initiateCall(sid,uid);
          })
          .catch(err => console.log(err));

}

 function mobileVideoShare(){
  let clientVideo = document.getElementById('client-video');
  let tracks = videoStream.getTracks();
      tracks.forEach(track => {
          track.stop();
      });
      videoStream = null;
      navigator.mediaDevices.getUserMedia({ video:{facingMode:"environment"} })
          .then((stream) => {
            videoStream=stream;
              stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, videoStream);
            });
            clientVideo.srcObject = stream;
            let uid =  sessionStorage.getItem('uid');
            let sid = sessionStorage.getItem('sid');
            initiateCall(sid,uid);
          })
          .catch(err => console.log(err));

}

function audioShare() {
    
    isAudioShared = !isAudioShared;
    if (isAudioShared) {
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                audioStream = stream
                
                stream.getTracks().forEach(track => {
                  peerConnection.addTrack(track, audioStream);
              });
              audioBtn.style.backgroundColor = 'rgb(69, 96, 214)';
              audioBtn.classList = 'fa-solid fa-microphone red';

              let uid = sessionStorage.getItem('uid');
              let sid = sessionStorage.getItem('sid');
              initiateCall(sid,uid);
                
            })
            .catch(err => console.log(err))
    } else {
        
        let tracks = audioStream.getTracks();
        tracks.forEach(track => {
            track.stop();
        });
        audioBtn.style.backgroundColor = 'rgb(211, 7, 7)';
        audioBtn.classList = isClass= 'fa-solid fa-microphone-slash red';
        audioStream = null;
        audioPaused();

    }

}

function screenShare() {
  isScreenShared = !isScreenShared;
    let clientScreen = document.getElementById('client-screen')
    if (isScreenShared) {
        try {
          navigator.mediaDevices.getDisplayMedia({ video: true })
            .then((stream) => {
              screenStream = stream
                stream.getTracks().forEach(track => {
                  peerConnection.addTrack(track, screenStream);
              });
              
              screenBtn.style.backgroundColor = 'rgb(69, 96, 214)';
              clientScreen.style.display='block';
              clientScreen.srcObject = stream;
              let uid = sessionStorage.getItem('uid');
              let sid = sessionStorage.getItem('sid');
              initiateCall(sid,uid);
            })
            .catch(err =>console.log(err));
          
        } catch (error) {
          console.log(error);
          alert('Sorry! Your Browser not support screen sharing.');
        }
        

    } else {
        screenBtn.style.backgroundColor = 'rgb(211, 7, 7)';
        let tracks = screenStream.getTracks();
        tracks.forEach(track => {
            track.stop();
        });
        isScreenShared = false;
        screenStream = null;
        clientScreen.style.display='none';
        videoPaused();

        if(isVideoShared){
          isVideoShared=false;
          // videoActive=false;
          tracks.forEach(track => {
            track.stop();         
        });
          videoShare();
        }

    }


}

function switchCamera(){
    if(isVideoShared){
      
    camSwithc = !camSwithc;
    if(camSwithc){
      webVideoShare();
    }else{
      mobileVideoShare();
    }
  }
}

function hideClientVideo(){
  let clientVideo = document.getElementById('client-video');
  let toggleBtn = document.querySelector('.video i');
  let isVdoHide = toggleBtn.classList.contains('fa-angle-down');
  if(!isVdoHide){
    clientVideo.style.display='none';
    toggleBtn.classList= 'fa-solid fa-angle-down';
  }else if(isVdoHide){
    clientVideo.style.display='block';
    toggleBtn.classList='fa-solid fa-angle-up';
  }
}

const textarea = document.querySelector('#text-msg');
const parentMaxHeight = parseInt(window.getComputedStyle(textarea.parentElement).maxHeight);

function adjustTextareaHeight() {
    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;
    if (newHeight > parentMaxHeight) {
        textarea.style.overflowY = 'scroll';
        newHeight = parentMaxHeight;
    } else {
        textarea.style.overflowY = 'hidden';
    }
    textarea.style.height = `${newHeight}px`;
}






cameraBtn.addEventListener('click', videoShare);
audioBtn.addEventListener('click', audioShare);
screenBtn.addEventListener('click', screenShare);
switchCam.addEventListener('click',switchCamera);
speakerBtn.addEventListener('click',muteAudio);
textarea.addEventListener('input', adjustTextareaHeight);




 //  MODEL VIEW.
  
  document.querySelector('.close').addEventListener('click', function() {
    document.querySelector('.modal-content').classList.remove('popup');
    setTimeout(()=>{
      document.getElementById('myModal').style.display = 'none';
    },500)
    
  });
  
  window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('myModal')) {
      document.querySelector('.modal-content').classList.remove('popup');
      setTimeout(()=>{
        document.getElementById('myModal').style.display = 'none';
      },500)
    }
  });




  document.querySelector('.up').addEventListener('click', function() {
    document.querySelector('.modal-content-form').classList.remove('popup-form');
    setTimeout(()=>{
      document.getElementById('myModal').style.display = 'none';
    },500)
    
  });
  window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('myModal')) {
      document.querySelector('.modal-content-form').classList.remove('popup-form');
      setTimeout(()=>{
        document.getElementById('myModal').style.display = 'none';
      },500)
    }
  });




  document.querySelector('.down').addEventListener('click', function() {
    document.querySelector('.modal-content-new').classList.remove('popup-new');
    setTimeout(()=>{
      document.getElementById('myModal').style.display = 'none';
    },500)
    
  });
  window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('myModal')) {
      document.querySelector('.modal-content-new').classList.remove('popup-new');
      setTimeout(()=>{
        document.getElementById('myModal').style.display = 'none';
      },500)
    }
  });

let clientVdo = document.getElementById('client-video');
 let cvid =  document.querySelector('.video');
 let fullScreen = true;

 clientVdo.addEventListener('click',()=>{
  fullScreen= !fullScreen;
  if(fullScreen){
    cvid.style.display='contents';
  }else{
    cvid.style.display='block';
  }
 });

/////////////////////////////////////////////////////////////////////////////


const remoteVideo = document.getElementById('remote-video');
const remoteAudio =document.getElementById('remoteAudio');
const hangupButton = document.getElementById('hang-up');
const sendIdBtn = document.getElementById('send-id');



async function shareMeetId(){
  if(navigator.share){

  document.getElementById('myModal').style.display = 'block';
    setTimeout(()=>{
      document.querySelector('.modal-content-form').classList.add('popup-form');
        },500)


    
  }else{
    alert('your browser does not support shareing.');
  }
}

function openCreateMeet(){
  
  document.getElementById('myModal').style.display = 'block';
  setTimeout(()=>{
    document.querySelector('.modal-content-new').classList.add('popup-new');
      },500)
}


function submitNameToShare(){
  document.querySelector('.modal-content-form').classList.remove('popup-form');
  setTimeout(()=>{
    document.getElementById('myModal').style.display = 'none';
  },500);

  let paramid = window.location.search;
  let urlparams =new URLSearchParams(paramid);
  let id =urlparams.get('id');

  let clientName = document.getElementById('remote-name');
   let name = clientName.value;
   clientName.value="";
    name = name.split(" ");
    name = name[0];
  if (name ==null) return;
   navigator.share({
    title:'Join Request on SYI MeeT.',
    text:'Join me now on SYI MeeT click on the link :',
    url:`?name=${name}&id=${id}`
  })
  .catch((err)=>console.log(err));
  name.value = "";
  
}







function muteAudio(){
  isMuted= !isMuted;
  if(isMuted){
    remoteAudio.muted=true;
    document.getElementById('speaker').classList='fa-solid fa-volume-high';
  }else{
    remoteAudio.muted=false;
    document.getElementById('speaker').classList='fa-solid fa-volume-xmark';
  }


}



const socket = io();

let chatArea = document.getElementById('text');
let msgCount = 0;





function createMeet(){
  let clientName = document.getElementById('client-name');
  let name = clientName.value;
   clientName.value="";
    name = name.split(" ");
    name = name[0];
    var regex = /^[a-zA-Z]+$/;
  if( name=='')return;
  if (!regex.test(name))return;
  if(name.length<3)return;
  if (name =='admin'|| name == 'Admin')return;


  document.querySelector('.modal-content-new').classList.remove('popup-new');
  setTimeout(()=>{
    document.getElementById('myModal').style.display = 'none';
  },500)

    socket.emit('create-meet',{name:name});
  
}

socket.on('create-meet',({status,rid,name})=>{
    if(status){
      location.href=`/?name=${name}&id=${rid}`;
    }else alert('some error occurred while createing meet.');
    

})

socket.on('text',({from,message})=>{
  let chatBox = document.getElementById('chat-box');
  let isOpened = chatBox.classList.contains('textdoc-open');
  let hasPTag = chatArea.querySelector('p') !== null;
    
  if(!isOpened){
    if(!hasPTag){
      let unReadTag = document.createElement('p');
      unReadTag.classList.add('new-msg');
      unReadTag.innerHTML="Unread Messages";
      chatArea.appendChild(unReadTag);
    }
    msgCount++;
    let notifyBadge = document.querySelector('.msg-notification');
    notifyBadge.innerHTML = msgCount;
    notifyBadge.style.visibility='visible';
  }
  let pre = document.createElement('pre');
  pre.innerHTML=`${from} : ${message}`;
  chatArea.appendChild(pre);
  scrollDown();
})

function scrollDown(){
  let messageArea = document.getElementById('text');
  messageArea.scrollTop = messageArea.scrollHeight;
}

function chatToggle(){
  msgCount=0;
  document.querySelector('.msg-notification').style.visibility='hidden';
  let chatbox = document.getElementById('chat-box');
  chatbox.classList.toggle('textdoc-open');
  let chatInput = document.getElementById('msgInput');
  chatInput.classList.toggle('msg-input-open');
}

function sendMsg(){
  if(textarea.value!==""){
    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');
    let name =urlparams.get('name');
    socket.emit('text',{from:name ,to:id, message:textarea.value});
    textarea.value="";
    textarea.style.height='50px';
    let hasPTag = chatArea.querySelector('p');
    if(hasPTag !== null){
      hasPTag.remove();
    }
  }
}

function videoPaused(){
  let uid = sessionStorage.getItem('uid');
  socket.emit('video-paused',{to:uid});
}

socket.on('video-paused',(data)=>{
  if(data.paused){
    remoteVideo.style.display='none';
  }
});

function audioPaused(){
  let uid = sessionStorage.getItem('uid');
  socket.emit('audio-paused',{to:uid});
}

socket.on('audio-paused',(data)=>{
  if(data.paused){
    document.querySelector('.mic').style.display='none';
    speakerBtn.style.display='none';
  }
});

socket.on('connection-lost',(user)=>{
  if(user.disconnected){
    remoteVideo.style.display='none';
    speakerBtn.style.display='none';
    document.querySelector('.share-id').style.display='block';
  }
})

function joinMeeT(){
  let paramid = window.location.search;
  let urlparams =new URLSearchParams(paramid);
  let id =urlparams.get('id');
  let name =urlparams.get('name');
  if(id!==null && name!==null && id!=='' && name !==''){
    socket.emit('room',{roomId:id,userName:name});

  }
}

socket.on('room',(data)=>{
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
      document.getElementById('myModal').style.display = 'block';
      setTimeout(()=>{
        document.querySelector('.modal-content').classList.add('popup');
      },500);
      
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
    document.querySelector('.mic').style.display='inline-block';
    speakerBtn.style.display='block';
    remoteAudio.srcObject = event.streams[0];
    remoteAudio.play()
    .catch((err)=>{
      console.log(err);
    });
    }
}          
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('ice-candidate', { to: otherUserId, candidate: event.candidate });
  }
};

let otherUserId;



socket.on('update-user-list', ( users ) => {
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
    document.querySelector('.share-id').style.display='none';
    sessionStorage.setItem('uid',user.id);
    const userElement = document.createElement('li');
    let contentDiv = `<div></div><strong>${user.name}</strong><i class="fa-solid fa-microphone mic"></i>`;
    userElement.innerHTML = contentDiv;
    userElement.addEventListener('click', () =>{
     initiateCall(socket.id,user.id);
    });
    userList.appendChild(userElement);
  });
}

function initiateCall(fromId,toId) {
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
    // socket.emit('hangup', { });
    sessionStorage.clear();

    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');
    let name =urlparams.get('name')

    if(name=='admin'|| name =='Admin'){
      window.location.href=`/disconnect/${id}`;
    }else{
      window.location.href='/';
    }

    
});




window.onload=joinMeeT;