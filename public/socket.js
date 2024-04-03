const socket = io();

let chatArea = document.getElementById('text');
let msgCount = 0;

function openCreateMeet(){

    let name = localStorage.getItem("name");
   
   if(name=="" || name==null){
     document.getElementById('myModal').style.display = 'block';
     setTimeout(()=>{
       document.querySelector('.modal-content-new').classList.add('popup-new');
         },500)
   }else{
     socket.emit('create-meet',{name:name});
   }
   }

socket.on('create-meet',({status,rid})=>{
    if(status){
      location.href=`/?id=${rid}`;
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
  let div = document.createElement('div');
  div.classList='msg-div';
  let div2 = document.createElement('div');
  div2.classList = 'overflow-control';
  let h4 = `<h4>${from}</h4><div class="clipboard" onclick='copytext(this)'><i class="fa-regular fa-clipboard"></i> <small>copy</small></div>`;
  let pre = document.createElement('pre');
  pre.innerHTML=message;
  div.innerHTML=h4;
  div2.appendChild(pre);
  div.appendChild(div2);
  chatArea.appendChild(div);
  playSound('new-message');
  scrollDown();
})

function sendMsg(){
    if(textarea.value!==""){
      let paramid = window.location.search;
      let urlparams =new URLSearchParams(paramid);
      let id =urlparams.get('id');
      let name =localStorage.getItem("name");
      let sendDiv = document.createElement('div');
      sendDiv.classList='send-div';
      let div = document.createElement('div');
      div.classList='msg-div';
      let div2 = document.createElement('div');
      div2.classList = 'overflow-control';
      let h4 = `<h4>${name}</h4><div class="clipboard" onclick='copytext(this)'><i class="fa-regular fa-clipboard"></i> <small>copy</small></div>`;
      let pre = document.createElement('pre');
      pre.innerHTML=textarea.value;
      div.innerHTML=h4;
      div2.appendChild(pre);
      div.appendChild(div2);
      sendDiv.appendChild(div)
      chatArea.appendChild(sendDiv);
      scrollDown();
      socket.emit('text',{from:name ,to:id, message:textarea.value});
      playSound('message-sent');
      textarea.value="";
      document.querySelector('#file-btn').style.display='block';
      document.querySelector('#send-btn').style.display='none';
      textarea.style.height='40px';
      let hasPTag = chatArea.querySelector('p');
      if(hasPTag !== null){
        hasPTag.remove();
      }
    }
  }

  socket.on('image',({from,file})=>{
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
    let div = document.createElement('div');
    div.classList='msg-div';
    let h4 = `<h4>${from}</h4> <i class="fa-solid fa-download download" onclick="download(this,'${Date.now()}','${file}')"></i>`;
    let img = document.createElement('img');
    img.src=file;
    div.innerHTML=h4;
    div.appendChild(img);
    chatArea.appendChild(div);
    playSound('new-message');
    scrollDown();
  })

let dataUrlVal;
let extnVal;
  function showFile(){
    let file = fileReader.files[0];
    let size = file.size;
    let extnAr = file.name.split('.');
    let elength = extnAr.length;
    extn=extnAr[elength-1];
    if(size < 16777216){
      let reader = new FileReader();
    reader.addEventListener('load',()=>{
      let dataURL = reader.result;
        dataUrlVal=dataURL;
        extnVal=extn;
      document.getElementById('smodal').style.display='block';
      fileReader.value="";

    });
    reader.readAsDataURL(file);
    }else{
      alert("Max 1MB Allowed.");
      fileReader.value="";
    }
  }


  socket.on('file',({from,file,extn})=>{
    // console.log(from,file);
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
    let div = document.createElement('div');
    div.classList='msg-div';
    let h4 = `<h4>${from}</h4> <i class="fa-solid fa-download download" onclick="download(this,'${Date.now()}','${file}')"></i>`;
    let h5 = document.createElement('h5');
    h5.innerHTML=`Received new ${extn} file.`;
    div.innerHTML=h4;
    div.appendChild(h5);
    chatArea.appendChild(div);
    playSound('new-message');
    scrollDown();
  });

  function sendFileConf(){
    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');
    let name =localStorage.getItem("name");

    if(extnVal=='jpg'||extnVal=='png'||extnVal=='jpeg'||extnVal=='webp'){
      let sendDiv = document.createElement('div');
      sendDiv.classList='send-div';
      let div = document.createElement('div');
      div.classList='msg-div';
      let h4 = `<h4>${name}</h4>`;
      let img = document.createElement('img');
      let imageSrc=dataUrlVal;
      img.src=imageSrc;
      div.innerHTML=h4;
      div.appendChild(img);
      sendDiv.appendChild(div);
      chatArea.appendChild(sendDiv);
      scrollDown();
      socket.emit('image',{from:name,to:id,file:dataUrlVal});
      playSound('message-sent');
    }else{
      let sendDiv = document.createElement('div');
      sendDiv.classList='send-div';
      let div = document.createElement('div');
      div.classList='msg-div';
      let h4 = `<h4>${name}</h4>`;
      let h5 = document.createElement('h5');
      h5.innerHTML=`Send new ${extnVal} file.`;
      div.innerHTML=h4;
      div.appendChild(h5);
      sendDiv.appendChild(div);
      chatArea.appendChild(sendDiv);
      scrollDown();
      socket.emit('file',{from:name,to:id,file:dataUrlVal,extn:extnVal});
      playSound('message-sent');
    }
    dataUrlVal='';
    extnVal='';
    document.getElementById('smodal').style.display='none';
  }

  function cancelFileConf(){
    dataUrlVal='';
    extnVal='';
    document.getElementById('smodal').style.display='none';
  }


  
  function videoPaused(){
    let uid = sessionStorage.getItem('uid');
    socket.emit('video-paused',{to:uid});
  }
  
  socket.on('video-paused',(data)=>{
    if(data.paused){
      remoteVideo.style.display='none';
      remoteVdoBtn.style.display='none';
      if (document.fullscreenElement) {
        document.exitFullscreen();
         }
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
      playSound('leave');
      remoteVideo.style.display='none';
      speakerBtn.style.display='none';
      remoteVdoBtn.style.display='none';
      document.querySelector('.share-id').style.display='block';
      if (document.fullscreenElement) {
        document.exitFullscreen();
         }
    }
  })
  
  function joinMeeT(){
    let name = localStorage.getItem("name");
    if(name==""|| name==null || name==undefined){
        document.getElementById('myModal').style.display = 'block';
    setTimeout(()=>{
      document.querySelector('.modal-content-new').classList.add('popup-new');
        },500)
        return;
    }
  
    document.getElementById('username').innerHTML=name;
    // document.getElementById('join-name').value=name;
    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');
    // let name =urlparams.get('name');
    if(id!==null && id!==''){
      socket.emit('room',{roomId:id,userName:name});
  
    }
  }
  
  socket.on('room',(data)=>{
      if (data.status){
        let paramid = window.location.search;
        let urlparams =new URLSearchParams(paramid);
        let id =urlparams.get('id');
        let name = localStorage.getItem("name");
  
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
        playSound('alert');
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
      remoteVdoBtn.style.display='block';
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
      // console.log("connection established");
  
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
      playSound('join');
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

  window.onload=joinMeeT;