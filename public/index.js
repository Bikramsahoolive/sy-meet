
let isScreenShared = false;
let isVideoShared = false;
let isAudioShared = false;

// let videoActive = false;
let camSwithc = true;
let fullScreen = false;
let isMuted=false;

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


const textarea = document.querySelector('#text-msg');
const inputType = document.getElementById('input-type');

let codeType = false;
inputType.addEventListener('click',()=>{
  codeType= !codeType;
  if(codeType){
    inputType.classList = 'fa-solid fa-comment input-type';
    textarea.placeholder = 'lang | code/command...';
  }else{
  inputType.classList = 'fa-solid fa-code input-type';
  textarea.placeholder = 'Type a message...';
  textarea.value = '';
  }
  textarea.focus();
})


let taggedMsgSet = false;
function createTaggedInput(div){
  
  document.getElementById('tagged-id').value = div.id;
  document.getElementById('sender-name').innerText = div.querySelector('h4').innerText;
  document.getElementById('tagged-in-msg').innerText = div.querySelector('.span-msg').innerText;
  document.querySelector('.tagged-input').style.display ='block';
  inputType.style.display = 'none';
  if(codeType){
    codeType = false;
    inputType.classList = 'fa-solid fa-code input-type';
    textarea.placeholder = 'Type a message...';
    textarea.value = '';
  }
  document.getElementById('file-btn').style.display='none';
  document.getElementById('send-btn').style.display='block';

  taggedMsgSet = true;
  textarea.focus();
}

function createTaggedInputBtn(btn){
  // alert(div.querySelector('h4').innerText);
  let targetDiv = btn.parentElement.parentElement;
  document.getElementById('tagged-id').value = targetDiv.id;
  document.getElementById('sender-name').innerText = targetDiv.querySelector('h4').innerText;
  document.getElementById('tagged-in-msg').innerText = targetDiv.querySelector('.span-msg').innerText;
  document.querySelector('.tagged-input').style.display ='block';
  inputType.style.display = 'none';
  if(codeType){
    codeType = false;
    inputType.classList = 'fa-solid fa-code input-type';
    textarea.placeholder = 'Type a message...';
    textarea.value = '';
  }
  taggedMsgSet = true;
  textarea.focus();
}
function closeTaggedInput()
{
  document.getElementById('tagged-file').style .display = 'none';
  document.querySelector('.tagged-input').style.display = 'none';
  document.getElementById('tagged-in-msg').innerHTML='';
  document.getElementById('tagged-id').value = "";
  document.getElementById('send-btn').style.display='none';
  document.getElementById('file-btn').style.display='block';
  dataUrlVal='';
  extnVal='';
  fileName='';
  fileType=false;
  inputType.style.display = 'block'
  taggedMsgSet = false;
}

function scrollToDiv(divid){
 let div = document.getElementById(divid);
  div.scrollIntoView({behavior:'smooth',block:'center'});
  div.parentElement.classList.add('scroll-effect');
  setTimeout(()=>{
    div.parentElement.classList.remove('scroll-effect');
  },6000)
}

let fileReader = document.getElementById('atch-file');

function sendFile(){
  fileReader.click();
}
function copytext(btn){
    let textbox = btn.parentElement.nextElementSibling.querySelector('pre');
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
function copyChat(btn){
  let textbox = btn.parentElement.parentElement.querySelector('.span-msg');
  let text = textbox.innerText;
  navigator.clipboard.writeText(text)
  .then(()=>{
    btn.querySelector('i').classList='fa-solid fa-check';
    btn.querySelector('small').innerText=' copied!';
    setTimeout(() => {
      btn.querySelector('i').classList='fa-regular fa-clipboard';
      btn.querySelector('small').innerText=' copy';
      
    }, 5000);
  })
  .catch((err)=>{
    console.log(err);
  })
}
let deleteDivId;
function deleteChat(divId){
        document.getElementById('smodal').style.display='block';
        deleteDivId=divId;
  let paramid = window.location.search;
      let urlparams =new URLSearchParams(paramid);
      let id =urlparams.get('id');
  // document.getElementById(divId).innerHTML=`<span class="dlt-msg"><i class="fa-solid fa-ban" onclick="clearChat('${divId}')"></i><h5>You deleted this msg.</h5></span>`;
  // socket.emit('delete-chat',{to:id,id:divId});
}
function deleteChatForMe(){
  document.getElementById(deleteDivId).innerHTML=`<span class="dlt-msg"><i class="fa-solid fa-ban" onclick="clearChat('${deleteDivId}')"></i><h5>You deleted this msg.</h5></span>`;
  deleteDivId = undefined;
  document.getElementById('smodal').style.display='none';
}

function deleteChatForEveryone(){
  document.getElementById(deleteDivId).innerHTML=`<span class="dlt-msg"><i class="fa-solid fa-ban" onclick="clearChat('${deleteDivId}')"></i><h5>You deleted this msg.</h5></span>`;
 
  let paramid = window.location.search;
  let urlparams =new URLSearchParams(paramid);
  let id =urlparams.get('id');
   socket.emit('delete-chat',{to:id,id:deleteDivId});
  deleteDivId = undefined;
  document.getElementById('smodal').style.display='none';
}
function clearChat(did){
 let deletedDiv = document.getElementById(did);
 deletedDiv.parentNode.removeChild(deletedDiv);
}
function taggedChat(did){
  // console.log(did);
}
function download(btn,filename,url){
  // console.log(btn,filename);
  btn.classList='fa-solid fa-check download';
  let link = document.createElement('a');
  link.href=url;
  link.download = filename;
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

const parentMaxHeight = parseInt(window.getComputedStyle(textarea.parentElement).maxHeight);
textarea.addEventListener('focus',()=>{
  document.querySelector('.emoji-picker').classList= 'emoji-picker';
})
// textarea.addEventListener('keyup', ()=>{
//   playSound('keypad');
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
      if(!taggedMsgSet){
        if(!fileType)inputType.style.display = 'block';
        document.querySelector('#file-btn').style.display='block';
        document.querySelector('#send-btn').style.display='none';
      }

    }
  
   
    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;
    if (newHeight > parentMaxHeight) {
        textarea.style.overflowY = 'scroll';
        newHeight = parentMaxHeight;
    } else {
        textarea.style.overflowY = 'hidden';
    }
    if(textarea.value ==""){
      // textarea.style.height='30px';
    }else{
      textarea.style.height = `${newHeight}px`;
    }
    
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
     title:'Join Request on SY MeeT.',
     text:`Join me now on SY MeeT with MeeT ID: ${id} | or click on the link  :`,
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
const emoji = document.getElementById('emoji');
emoji.addEventListener('click',()=>{
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
    document.getElementById('speaker').classList='fa-solid fa-volume-xmark';
  }else{
    remoteAudio.muted=false;
    document.getElementById('speaker').classList='fa-solid fa-volume-high';
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
  // let chatInput = document.getElementById('msgInput');
  // chatInput.classList.toggle('msg-input-open');
  // let isChatOpen = chatbox.classList.contains('textdoc-open');
  // if (isChatOpen){
  //   setTimeout(()=>{
  //     document.getElementById('text').style.display = 'block';
  //   },300)
    
  // }else{
  //   document.getElementById('text').style.display = 'none';

  // }
}


function checkInput (val){
  let currentDate  =new Date();
  let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
console.log(typeof minute);
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];
  if(val =='code|help' || val =='Code|help'){
    let message= `  input appropriate language the value as
     lang on textbox then a pipe ' | ' and write your code.
     
    "Markup" - markup, html, xml, svg, mathml, ssml, atom, rss
    "CSS" - css
    "C-like" - clike
    "JavaScript" - javascript, js
    "ABAP" - abap
    "ABNF" - abnf
    "ActionScript" - actionscript
    "Ada" - ada
    "Agda" - agda
    "AL" - al
    "ANTLR4" - antlr4, g4
    "Apache Configuration" - apacheconf
    "Apex" - apex
    "APL" - apl
    "AppleScript" - applescript
    "AQL" - aql
    "Arduino" - arduino, ino
    "ARFF" - arff
    "ARM Assembly" - armasm, arm-asm
    "Arturo" - arturo, art
    "AsciiDoc" - asciidoc, adoc
    "ASP.NET (C#)" - aspnet
    "6502 Assembly" - asm6502
    "Atmel AVR Assembly" - asmatmel
    "AutoHotkey" - autohotkey
    "AutoIt" - autoit
    "AviSynth" - avisynth, avs
    "Avro IDL" - avro-idl, avdl
    "AWK" - awk, gawk
    "Bash" - bash, sh, shell
    "BASIC" - basic
    "Batch" - batch
    "BBcode" - bbcode, shortcode
    "BBj" - bbj
    "Bicep" - bicep
    "Birb" - birb
    "Bison" - bison
    "BNF" - bnf, rbnf
    "BQN" - bqn
    "Brainfuck" - brainfuck
    "BrightScript" - brightscript
    "Bro" - bro
    "BSL (1C:Enterprise)" - bsl, oscript
    C - c
    C# - csharp, cs, dotnet
    C++ - cpp
    CFScript - cfscript, cfc
    ChaiScript - chaiscript
    CIL - cil
    Cilk/C - cilkc, cilk-c
    Cilk/C++ - cilkcpp, cilk-cpp, cilk
    Clojure - clojure
    CMake - cmake
    COBOL - cobol
    CoffeeScript - coffeescript, coffee
    Concurnas - concurnas, conc
    Content-Security-Policy - csp
    Cooklang - cooklang
    Coq - coq
    Crystal - crystal
    CSS Extras - css-extras
    CSV - csv
    CUE - cue
    Cypher - cypher
    D - d
    Dart - dart
    DataWeave - dataweave
    DAX - dax
    Dhall - dhall
    Diff - diff
    Django/Jinja2 - django, jinja2
    DNS zone file - dns-zone-file, dns-zone
    Docker - docker, dockerfile
    DOT (Graphviz) - dot, gv
    EBNF - ebnf
    EditorConfig - editorconfig
    Eiffel - eiffel
    EJS - ejs, eta
    Elixir - elixir
    Elm - elm
    Embedded Lua templating - etlua
    ERB - erb
    Erlang - erlang
    Excel Formula - excel-formula, xlsx, xls
    F# - fsharp
    Factor - factor
    False - false
    Firestore security rules - firestore-security-rules
    Flow - flow
    Fortran - fortran
    FreeMarker Template Language - ftl
    GameMaker Language - gml, gamemakerlanguage
    GAP (CAS) - gap
    G-code - gcode
    GDScript - gdscript
    GEDCOM - gedcom
    gettext - gettext, po
    Gherkin - gherkin
    Git - git
    GLSL - glsl
    GN - gn, gni
    GNU Linker Script - linker-script, ld
    Go - go
    Go module - go-module, go-mod
    Gradle - gradle
    GraphQL - graphql
    Groovy - groovy
    Haml - haml
    Handlebars - handlebars, hbs, mustache
    Haskell - haskell, hs
    Haxe - haxe
    HCL - hcl
    HLSL - hlsl
    Hoon - hoon
    HTTP - http
    HTTP Public-Key-Pins - hpkp
    HTTP Strict-Transport-Security - hsts
    IchigoJam - ichigojam
    Icon - icon
    ICU Message Format - icu-message-format
    Idris - idris, idr
    .ignore - ignore, gitignore, hgignore, npmignore
    Inform 7 - inform7
    Ini - ini
    Io - io
    J - j
    Java - java
    JavaDoc - javadoc
    JavaDoc-like - javadoclike
    Java stack trace - javastacktrace
    Jexl - jexl
    Jolie - jolie
    JQ - jq
    JSDoc - jsdoc
    JS Extras - js-extras
    JSON - json, webmanifest
    JSON5 - json5
    JSONP - jsonp
    JS stack trace - jsstacktrace
    JS Templates - js-templates
    Julia - julia
    "Keepalived Configure" - keepalived
    "Keyman" - keyman
    "Kotlin" - kotlin, kt, kts
    "KuMir (КуМир)" - kumir, kum
    "Kusto" - kusto
    "LaTeX" - latex, tex, context
    "Latte" - latte
    "Less" - less
    "LilyPond" - lilypond, ly
    "Liquid" - liquid
    "Lisp" - lisp, emacs, elisp, emacs-lisp
    "LiveScript" - livescript
    "LLVM IR" - llvm
    "Log file" - log
    "LOLCODE" - lolcode
    "Lua" - lua
    "Magma (CAS)" - magma
    "Makefile" - makefile
    "Markdown" - markdown, md
    "Markup templating" - markup-templating
    "Mata" - mata
    "MATLAB" - matlab
    "MAXScript" - maxscript
    "MEL" - mel
    "Mermaid" - mermaid
    "METAFONT" - metafont
    "Mizar" - mizar
    "MongoDB" - mongodb
    "Monkey" - monkey
    "MoonScript" - moonscript, moon
    "N1QL" - n1ql
    "N4JS" - n4js, n4jsd
    "Nand To Tetris HDL" - nand2tetris-hdl
    "Naninovel Script" - naniscript, nani
    "NASM" - nasm
    "NEON" - neon
    "Nevod" - nevod
    "nginx" - nginx
    "Nim" - nim
    "Nix" - nix
    "NSIS" - nsis
    "Objective-C" - objectivec, objc
    "OCaml" - ocaml
    "Odin" - odin
    "OpenCL" - opencl
    "OpenQasm" - openqasm, qasm
    "Oz" - oz
    "PARI/GP" - parigp
    "Parser" - parser
    "Pascal" - pascal, objectpascal
    "Pascaligo" - pascaligo
    "PATROL Scripting Language" - psl
    "PC-Axis" - pcaxis, px
    "PeopleCode" - peoplecode, pcode
    "Perl" - perl
    "PHP" - php
    "PHPDoc" - phpdoc
    "PHP Extras" - php-extras
    "PlantUML" - plant-uml, plantuml
    "PL/SQL" - plsql
    "PowerQuery" - powerquery, pq, mscript
    "PowerShell" - powershell
    "Processing" - processing
    "Prolog" - prolog
    "PromQL" - promql
    ".properties" - properties
    "Protocol" Buffers - protobuf
    "Pug" - pug
    "Puppet" - puppet
    "Pure" - pure
    "PureBasic" - purebasic, pbfasm
    "PureScript" - purescript, purs
    "Python" - python, py
    "Q#" - qsharp, qs
    "Q" (kdb+ database) - q
    "QML" - qml
    "Qore" - qore
    "R" - r
    "Racket" - racket, rkt
    "Razor C#" - cshtml, razor
    "React JSX" - jsx
    "React TSX" - tsx
    "Reason" - reason
    "Regex" - regex
    "Rego" - rego
    "Ren'py" - renpy, rpy
    "ReScript" - rescript, res
    "reST (reStructuredText)" - rest
    "Rip" - rip
    "Roboconf" - roboconf
    "Robot" Framework - robotframework, robot
    "Ruby" - ruby, rb
    "Rust" - rust
    "SAS" - sas
    "Sass (Sass)" - sass
    "Sass (SCSS)" - scss
    "Scala" - scala
    "Scheme" - scheme
    "Shell session" - shell-session, sh-session, shellsession
    "Smali" - smali
    "Smalltalk" - smalltalk
    "Smarty" - smarty
    "SML" - sml, smlnj
    "Solidity (Ethereum)" - solidity, sol
    "Solution file" - solution-file, sln
    "Soy (Closure Template)" - soy
    "SPARQL" - sparql, rq
    "Splunk SPL" - splunk-spl
    "SQF: Status Quo Function (Arma 3)" - sqf
    "SQL" - sql
    "Squirrel" - squirrel
    "Stan" - stan
    "Stata Ado" - stata
    "Structured Text (IEC 61131-3)" - iecst
    "Stylus" - stylus
    "SuperCollider" - supercollider, sclang
    "Swift" - swift
    "Systemd configuration file" - systemd
    "T4 templating" - t4-templating
    "T4 Text Templates (C#)" - t4-cs, t4
    "T4 Text Templates (VB)" - t4-vb
    "TAP" - tap
    "Tcl "- tcl
    "Template Toolkit 2" - tt2
    "Textile" - textile
    "TOML" - toml
    "Tremor" - tremor, trickle, troy
    "Turtle" - turtle, trig
    "Twig" - twig
    "TypeScript" - typescript, ts
    "TypoScript" - typoscript, tsconfig
    "UnrealScript" - unrealscript, uscript, uc
    "UO Razor Script" - uorazor
    "URI" - uri, url
    "V" - v
    "Vala" - vala
    "VB.Net" - vbnet
    "Velocity" - velocity
    "Verilog" - verilog
    "VHDL" - vhdl
    "vim" - vim
    "Visual Basic" - visual-basic, vb, vba
    "WarpScript" - warpscript
    "WebAssembly" - wasm
    "Web IDL" - web-idl, webidl
    "WGSL" - wgsl
    "Wiki markup" - wiki
    "Wolfram" language - wolfram, mathematica, nb, wl
    "Wren" - wren
    "Xeora" - xeora, xeoracube
    "XML doc (.net)" - xml-doc
    "Xojo (REALbasic) "- xojo
    "XQuery" - xquery
    "YAML" - yaml, yml
    "YANG" - yang
    "Zig" - zig`
    let chatArea = document.getElementById('text');
    let div = document.createElement('div');
    div.classList='msg-div';
    let div2 = document.createElement('div');
    div2.classList = 'overflow-control';
    let h4 = `<h4>Bikram (Dev)</h4>`;
  
    let pre = document.createElement('pre');
    pre.classList = "line-numbers";
    let code = document.createElement('code');
    code.textContent = message;
    let pLang = (message).split('|')[0];
    code.classList=`language-basic`;
    pre.appendChild(code);
    div2.appendChild(pre);
    Prism.highlightElement(code);
  
    div.innerHTML=h4;
    let small = document.createElement('small');
    small.classList='time-w';
    small.innerHTML=`${hour}:${minute} ${meridiem}`;
    div2.appendChild(small);
    div.appendChild(div2);
    chatArea.appendChild(div);
    playSound('new-message');
    scrollDown();
  

    return false;
  }
  return true;
}




////////////////////////////////////////////////////////////////////////////////
          //  in test 
////////////////////////////////////////////////////////////////////////////////

const video = document.getElementById('remote-video');



 // Check for browser support
  // if (typeof document.hidden !== "undefined") { // Chrome, Firefox, Opera, Safari
  //   var hidden = "hidden";
  //   var visibilityChange = "visibilitychange";
  // } else if (typeof document.msHidden !== "undefined") { // IE 10+
  //   var hidden = "msHidden";
  //   var visibilityChange = "msvisibilitychange";
  // } else if (typeof document.webkitHidden !== "undefined") { // Chrome, Safari, Edge
  //   var hidden = "webkitHidden";
  //   var visibilityChange = "webkitvisibilitychange";
  // }

  // Function to handle visibility change
  // async function handleVisibilityChange() {
  //   if (document[hidden]) {
  //     console.log("Tab is now hidden");
  //     if (!document.pictureInPictureElement) {
  //       // If not already in Picture-in-Picture mode, request it
  //       await video.requestPictureInPicture();
  //     } else {
  //       // If already in Picture-in-Picture mode, exit it
  //       await document.exitPictureInPicture();
  //     }
  //     // Add your code here to handle when the tab becomes hidden
  //   } else {
  //     console.log("Tab is now visible");
  //     if (!document.pictureInPictureElement) {
  //       // If not already in Picture-in-Picture mode, request it
  //       await video.requestPictureInPicture();
  //     } else {
  //       // If already in Picture-in-Picture mode, exit it
  //       await document.exitPictureInPicture();
  //     }
  //     // Add your code here to handle when the tab becomes visible
  //   }
  // }

  // Add event listener for visibility change
  // document.addEventListener(visibilityChange, handleVisibilityChange, false);




  // // Check if Picture-in-Picture is supported
if ('pictureInPictureEnabled' in document) {
  // Add event listener for when the browser window is minimized
  window.addEventListener('resize', () => {
    // Check if the video is in Picture-in-Picture mode
    if (document.pictureInPictureElement && document.hidden) {
      // If the video is in Picture-in-Picture mode and the browser window is minimized,
      // exit Picture-in-Picture mode to prevent it from being hidden
      document.exitPictureInPicture();
    }
  });
}
// Function to toggle Picture-in-Picture mode
async function togglePictureInPicture() {
  try {
    if (!document.pictureInPictureElement) {
      // If not already in Picture-in-Picture mode, request it
      await video.requestPictureInPicture();
    } else {
      // If already in Picture-in-Picture mode, exit it
      await document.exitPictureInPicture();
    }
  } catch(error) {
    console.error('Error entering/exiting Picture-in-Picture mode:', error);
  }
}

// // Add click event listener to the video element to toggle Picture-in-Picture mode
video.addEventListener('click', togglePictureInPicture);

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

document.getElementById('text-msg').addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMsg();
}})