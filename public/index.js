
let isScreenShared = false;
let isVideoShared = false;
let isAudioShared = false;

// let videoActive = false;
let camSwithc = true;
let fullScreen = false;
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
let remoteVdoBtn= document.querySelector('#zoom-remote-video');

//prevent back button
history.pushState(null,null,location.href);
window.onpopstate = function(event){
  history.go(1);
  let chatbox = document.getElementById('chat-box');
  chatbox.classList='textdoc';
  let chatInput = document.getElementById('msgInput');
  chatInput.classList = 'msg-input';
}

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
        fullScreen=false
        isVideoShared=false;
        switchCam.style.display='none';
        videoStream = null;
        document.querySelector('.video').style.display='block';
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
            clientVideo.style.transform='scaleX(-1)';
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
            clientVideo.style.transform='scaleX(1)';
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


let fileReader = document.getElementById('atch-file');

function sendFile(){
  fileReader.click();
}
function copytext(btn){
    let textbox = btn.nextElementSibling.querySelector('pre');
    let text = textbox.innerText;
    navigator.clipboard.writeText(text)
    .then(()=>{
      btn.querySelector('i').classList='fa-solid fa-check';
      btn.querySelector('small').innerText='copied!';
      setTimeout(() => {
        btn.querySelector('i').classList='fa-regular fa-clipboard';
        btn.querySelector('small').innerText='copy';
        
      }, 5000);
    })
    .catch((err)=>{
      console.log(err);
    })
}
function download(btn,extname,url){
  btn.classList='fa-solid fa-check download';
  let link = document.createElement('a');
  link.href=url;
  link.download = `meet_file_${extname}`;
  link.click();
  
  // setTimeout(() => {
  //   btn.classList='fa-solid fa-download download';
  // }, 10000);
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
// const backspace = document.getElementById('backspace');
const textarea = document.querySelector('#text-msg');
const inputType = document.getElementById('input-type');
let codeType = false;
inputType.addEventListener('click',()=>{
  codeType= !codeType;
  if(codeType){
    inputType.classList = 'fa-solid fa-comment input-type';
    textarea.placeholder = 'Type a code...';
  }else{
  inputType.classList = 'fa-solid fa-code input-type';
  textarea.placeholder = 'Type a message...';
  }
})

const parentMaxHeight = parseInt(window.getComputedStyle(textarea.parentElement).maxHeight);
// backspace.addEventListener('click',()=>{
//   let vl = textarea.value;
//   let emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/;
//   if(emojiRegex.test(vl)){
//     textarea.value = vl.substring(0,vl.length - 2);
//   }else{
//     textarea.value = vl.substring(0,vl.length - 1);
//   }

//   // if(textarea.length < 0){
//   //   backspace.style.display = 'none';
//   // }
  
// })
textarea.addEventListener('focus',()=>{
  document.querySelector('.emoji-picker').classList= 'emoji-picker';
})
// textarea.addEventListener('keyup', ()=>{
//   // playSound('keypad');
// });
function adjustTextareaHeight() {
  let name =localStorage.getItem("name");
  let paramid = window.location.search;
  let urlparams =new URLSearchParams(paramid);
  let id =urlparams.get('id');
  socket.emit('typing',{name:name,to:id});
    if((textarea.value).length > 0){
      inputType.style.display = 'none';
      document.querySelector('#file-btn').style.display='none';
      document.querySelector('#send-btn').style.display='block';
    }else{
      inputType.style.display = 'block';
      document.querySelector('#file-btn').style.display='block';
      document.querySelector('#send-btn').style.display='none';
    }
  
   
    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;
    if (newHeight > parentMaxHeight) {
        textarea.style.overflowY = 'scroll';
        newHeight = parentMaxHeight;
    } else {
        textarea.style.overflowY = 'hidden';
    }
    console.log(newHeight,parentMaxHeight,textarea.scrollHeight);
    textarea.style.height = `${newHeight-20}px`;
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
 

 clientVdo.addEventListener('click',()=>{
  fullScreen = !fullScreen;
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

    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');

    navigator.share({
     title:'Join Request on SYI MeeT.',
     text:`Join me now on SYI MeeT with MeeT ID: ${id} | click on the link :`,
     url:`?id=${id}`
   })
   .catch((err)=>console.log(err));


    
  }else{
    alert('your browser does not support shareing.');
  }
}

function changeName(){

  document.getElementById('myModal').style.display = 'block';
  setTimeout(()=>{
    document.querySelector('.modal-content-new').classList.add('popup-new');
      },500);
}

function zoomRemoreVideo(){
  const video = document.getElementById('remote-video');
  if (!document.fullscreenElement) {
    video.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
    video.controls = false;
} else {
    document.exitFullscreen();
}

}

document.getElementById('emoji').addEventListener('click',()=>{
  document.querySelector('.emoji-picker').classList.toggle('emoji-picker-open');
})
document.querySelector('emoji-picker')
  .addEventListener('emoji-click', (event) =>{
    //  console.log(event.detail)
     let val = textarea.value;
    //  if(val.length==0){textarea.value =`${event.detail.unicode}`;}
    //  else{
     textarea.value =`${val}${event.detail.unicode}`;
    //  }
     adjustTextareaHeight();

  });
  
function playSound(soundFor){
  let audio =  document.createElement('audio');
  if(soundFor=='keypad'){
    audio.src = 'sounds/keypad.mp3';
    audio.currentTime= 0;
    audio.play();
  } else if(soundFor=='leave'){
    audio.src = 'sounds/leave.mp3';
    audio.play();
  }else if(soundFor=='new-message'){
    audio.src = 'sounds/message.mp3';
    audio.play();
  }else if(soundFor=='alert'){
    audio.src = 'sounds/alert.mp3';
    audio.play();
  }else if(soundFor=='message-sent'){
    audio.src = 'sounds/message_sent.mp3';
    audio.play();
  }else if (soundFor=='join'){
    audio.src = 'sounds/join.mp3';
    audio.play();
  }
};
 




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

function createMeet(){
  let clientName = document.getElementById('client-name');
  let name = clientName.value;
   clientName.value="";
    name = name.split(" ");
    name = name[0];
    var regex = /^[a-zA-Z]+$/;
  if( name==''){
    playSound('alert');
    return
  };
  if (!regex.test(name)){
    playSound('alert');
    return;
  };
  if(name.length<3){
    playSound('alert');
    return;
  };

  document.querySelector('.modal-content-new').classList.remove('popup-new');
  setTimeout(()=>{
    document.getElementById('myModal').style.display = 'none';
  },500)

  localStorage.setItem("name",name);
  location.reload();
    
  
}

let scrollableDiv = document.getElementById('text');
let scrollBtn = document.getElementById('scroll-down');
let lastScrollTop = 0;
scrollableDiv.addEventListener('scroll',()=>{
  if(scrollableDiv.scrollTop > lastScrollTop){
    scrollBtn.style.display='none';
  }else{
    scrollBtn.style.display='block';
  }
  if(scrollableDiv.scrollTop + scrollableDiv.clientHeight >= scrollableDiv.scrollHeight){
    scrollBtn.style.display='none';
  }

   lastScrollTop = scrollableDiv.scrollTop;
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



hangupButton.addEventListener('click', () => {
    
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