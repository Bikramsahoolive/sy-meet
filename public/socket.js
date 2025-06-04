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
 //        to establish continiue connection with socket.
setInterval(()=>{
  if(isAudioShared || isScreenShared || isVideoShared){
    let paramid = window.location.search;
    let urlparams =new URLSearchParams(paramid);
    let id =urlparams.get('id');
    socket.emit('client-active',{to:id});
  }else{
  }
},900000);

socket.on('client-active',()=>{
  console.log('remote user is still active...');
});

socket.on('text',({from,DivId,message})=>{
  let typDiv = document.getElementById('typing');
  if(typDiv !== null){
   typDiv.parentNode.removeChild(typDiv);
  }

  let currentDate  =new Date();
  let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];

  let chatBox = document.getElementById('chat-box');
  let isOpened = chatBox.classList.contains('textdoc-open');
  let hasPTag = chatArea.querySelector('.unread') !== null;
  if(!isOpened){
    if(!hasPTag){
      let unReadTag = document.createElement('p');
      unReadTag.classList='unread';
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
  div.id = DivId;
  let div2 = document.createElement('div');
  div2.classList = 'overflow-control';
  let h4 = `<h4>${from}</h4><div class="clipboard" onclick='copytext(this)'><i class="fa-regular fa-clipboard"></i> <small>copy</small></div>`;

  let pre = document.createElement('pre');
  pre.classList = "line-numbers";
  let code = document.createElement('code');
  code.textContent = message;
  let pLang = (message).split('|')[0];
  code.classList=`language-${pLang}`;
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
  setTimeout(()=>scrollDown(),500)
  
});

socket.on('chat',({from,DivId,message})=>{
  let typDiv = document.getElementById('typing');
  if(typDiv !== null){
   typDiv.parentNode.removeChild(typDiv);
  }

  let currentDate  =new Date();
  let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];


  let chatBox = document.getElementById('chat-box');
  let isOpened = chatBox.classList.contains('textdoc-open');
  let hasPTag = chatArea.querySelector('.unread') !== null;
  if(!isOpened){
    if(!hasPTag){
      let unReadTag = document.createElement('p');
      unReadTag.classList='unread';
      unReadTag.classList.add('new-msg');
      unReadTag.innerHTML="Unread Messages";
      chatArea.appendChild(unReadTag);
    }
    msgCount++;
    let notifyBadge = document.querySelector('.msg-notification');
    notifyBadge.innerHTML = msgCount;
    notifyBadge.style.visibility='visible';
  }
  let receiveDiv = document.createElement('div');
  receiveDiv.classList='receive-div';
  let div = document.createElement('div');
  div.classList='msg-div';
  div.id = DivId;

  div.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
});

div.addEventListener('touchmove', function(event) {
    touchEndX = event.touches[0].clientX;
});

div.addEventListener('touchend', function(event) {
    if (touchEndX < touchStartX) {
        // Left swipe detected
        // alert("Left swipe detected!");
         touchStartX = 0;
         touchEndX = 0;
        return;
    }
    
    if (touchEndX - touchStartX > 150) {
        // Right swipe detected
        // alert("Right swipe detected!");

        createTaggedInput(this);

         touchStartX = 0;
         touchEndX = 0;
        // Your action for right swipe here
    }
});

  let h4 = `<h4>${from}</h4>
                         <div class="opt" >
                            <i class="fa-solid fa-share" onclick="createTaggedInputBtn(this)"></i>
                            <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
                        </div>`;
  let span = document.createElement('span');
  span.classList = 'span-msg';
  let small = document.createElement('small');
  small.classList='time';
  small.innerHTML=`${hour}:${minute} ${meridiem}`;
  span.innerHTML=message;

  let alphanumericSpecialWhitespaceRegex  = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?\/\\~\s-]+$/;
  let isLeters = alphanumericSpecialWhitespaceRegex .test(message);
  if (!isLeters){
    if( message.length==2 || message.length==3|| message.length==4 ||message.length==5 ||message.length==7 ){
      span.setAttribute('style','font-size:100px;text-align:center;');
    }
  }

  div.innerHTML=h4;
  div.appendChild(span);
  div.appendChild(small);
  receiveDiv.appendChild(div);
  chatArea.appendChild(receiveDiv);
  playSound('new-message');
  scrollDown();
})


socket.on('tagged-chat',({from,DivId,message,taggedId})=>{
  let typDiv = document.getElementById('typing');
  if(typDiv !== null){
   typDiv.parentNode.removeChild(typDiv);
  }

  let currentDate  =new Date();
  let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];


  let chatBox = document.getElementById('chat-box');
  let isOpened = chatBox.classList.contains('textdoc-open');
  let hasPTag = chatArea.querySelector('.unread') !== null;
  if(!isOpened){
    if(!hasPTag){
      let unReadTag = document.createElement('p');
      unReadTag.classList='unread';
      unReadTag.classList.add('new-msg');
      unReadTag.innerHTML="Unread Messages";
      chatArea.appendChild(unReadTag);
    }
    msgCount++;
    let notifyBadge = document.querySelector('.msg-notification');
    notifyBadge.innerHTML = msgCount;
    notifyBadge.style.visibility='visible';
  }
  let receiveDiv = document.createElement('div');
  receiveDiv.classList='receive-div';
  let div = document.createElement('div');
  div.classList='msg-div';
  div.id = DivId;

  div.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
});

div.addEventListener('touchmove', function(event) {
    touchEndX = event.touches[0].clientX;
});

div.addEventListener('touchend', function(event) {
    if (touchEndX < touchStartX) {
        // Left swipe detected
        // alert("Left swipe detected!");
         touchStartX = 0;
         touchEndX = 0;
        return;
    }
    
    if (touchEndX - touchStartX > 150) {
        // Right swipe detected
        // alert("Right swipe detected!");

        createTaggedInput(this);

         touchStartX = 0;
         touchEndX = 0;
        // Your action for right swipe here
    }
});

  let h4 = `<h4>${from}</h4>
                         <div class="opt" >
                            <i class="fa-solid fa-share" onclick="createTaggedInputBtn(this)"></i>
                            <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
                        </div>`;




                        let taggedSpan = document.createElement('span');
                        taggedSpan.classList = 'tagged-msg';
                        let taggedMainDiv = document.getElementById(taggedId);
                        let taggedName = taggedMainDiv.querySelector('h4').innerText;
                        taggedSpan.innerHTML=`<strong>${taggedName}</strong> ${taggedMainDiv.querySelector('.span-msg').innerText}`;
                        taggedSpan.setAttribute('onclick',`scrollToDiv(${taggedId})`);

  let span = document.createElement('span');
  span.classList = 'span-msg';
  let small = document.createElement('small');
  small.classList='time';
  small.innerHTML=`${hour}:${minute} ${meridiem}`;
  span.innerHTML=message;
  div.innerHTML=h4;
  div.appendChild(taggedSpan);
  div.appendChild(span);
  div.appendChild(small);
  receiveDiv.appendChild(div);
  chatArea.appendChild(receiveDiv);
  playSound('new-message');
  scrollDown();
})




const inputTypeBtn = document.getElementById('input-type');
let touchStartX = 0;
let touchEndX = 0;
function sendMsg(){

  let currentDate  =new Date();
  let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];

let paramid = window.location.search;
let urlparams =new URLSearchParams(paramid);
let id =urlparams.get('id');
let name =localStorage.getItem("name");




  if(fileType){
    let msgVal = textarea.value;
    if(extnVal=='jpg'||extnVal=='png'||extnVal=='jpeg'||extnVal=='webp'||extnVal=='gif'){
      
      let sendDiv = document.createElement('div');
      sendDiv.classList='send-div';
      let div = document.createElement('div');
      div.classList='send-msg';
      let divId = Date.now();
      div.id= divId

      div.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchmove', function(event) {
        touchEndX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchend', function(event) {
        if (touchEndX < touchStartX) {
            // Left swipe detected
            // alert("Left swipe detected!");
             touchStartX = 0;
             touchEndX = 0;
            return;
        }
        
        if (touchEndX - touchStartX > 150) {
            // Right swipe detected
            alert("Right swipe detected!");
    
            // createTaggedInput(this);
    
             touchStartX = 0;
             touchEndX = 0;
        }
    });

      if(msgVal.length > 0){
   

        let h4 = `<h4>${name}</h4>
        <div class="opt" >
            <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
            <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
        </div>`;
        let img = document.createElement('img');
        let imageSrc=dataUrlVal;
        img.src=imageSrc;
        div.innerHTML=h4;
        let small = document.createElement('small');
        small.classList='time';
        small.innerHTML = `${hr}:${minute} ${meridiem}`
        div.appendChild(img);
        div.appendChild(small);
        let span = document.createElement('span');
        span.classList = 'span-msg';
        span.innerText = msgVal;
        div.appendChild(span);
        textarea.value="";
        sendDiv.appendChild(div);
        chatArea.appendChild(sendDiv);
        socket.emit('image',{from:name,to:id,file:dataUrlVal,divId:divId,msg:msgVal});
      }else{
        let h4 = `<h4>${name}</h4>
        <div class="opt" >
            <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
        </div>`;
        let img = document.createElement('img');
        let imageSrc=dataUrlVal;
        img.src=imageSrc;
        div.innerHTML=h4;
        let small = document.createElement('small');
        small.classList='time';
        small.innerHTML = `${hr}:${minute} ${meridiem}`
        div.appendChild(img);
        div.appendChild(small);
        sendDiv.appendChild(div);
        chatArea.appendChild(sendDiv);
        socket.emit('image',{from:name,to:id,file:dataUrlVal,divId:divId});
      }

    }else{
      let sendDiv = document.createElement('div');
      sendDiv.classList='send-div';
      let div = document.createElement('div');
      div.classList='send-msg';
      let divId = Date.now();
      div.id= divId;
      if (msgVal.length > 0){
        let h4 =`<h4>${name}</h4>
        <div class="opt" >
            <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
            <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
        </div>`;
        div.innerHTML=h4;
      }else{

      let h4 =`<h4>${name}</h4>
      <div class="opt" >
          <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
      </div>`;
      div.innerHTML=h4;
      }


      div.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchmove', function(event) {
        touchEndX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchend', function(event) {
        if (touchEndX < touchStartX) {
            // Left swipe detected
            // alert("Left swipe detected!");
             touchStartX = 0;
             touchEndX = 0;
            return;
        }
        
        if (touchEndX - touchStartX > 150) {
            // Right swipe detected
            alert("Right swipe detected!");
    
            // createTaggedInput(this);
    
             touchStartX = 0;
             touchEndX = 0;
        }
    });

      let fileSpan = document.createElement('span');
      let fileDtls = document.createElement('p');
      let fileImg = document.createElement('img');
      fileSpan.classList = 'send-file';
      fileDtls.classList ='file-desc' ;
      fileImg.classList = 'file-image';

      if(extn=='pdf'){
        fileImg.src="images/SVGfile/file-type-standard-drawing-pdf-document.svg";
      }else if(extn=='mp3'|| extn=='wav'|| extn=='aac'||extn=='m4a'){
        fileImg.src="images/SVGfile/file-type-standard-drawing-sound-file.svg";
      }else if(extn=='doc' || extn=='docx'){
        fileImg.src="images/SVGfile/file-type-standard-drawing-word-document.svg";
      }else if(extn=='txt'){
        fileImg.src="images/SVGfile/document-type-standard-drawing-notepad.svg";
      }else if(extn=='xls'||extn=='xlsx'||extn=='xlsm'||extn=='xlsb'){
        fileImg.src="images/SVGfile/document-type-standard-drawing-worksheet.svg";
      }else if(extn=='zip'||extn=='rar'){
        fileImg.src="images/SVGfile/file-type-standard-drawing-compressed-file.svg";
      }else if(extn=='mp4'||extn=='3gp'){
        fileImg.src="images/SVGfile/file-type-standard-drawing-video-file.svg";
      }else if(extn=='pptx'){
        fileImg.src="images/SVGfile/document-type-standard-drawing-slide.svg";
      }else if(extn=='json'){
        fileImg.src="images/SVGfile/json-5.svg";
      }else{
        fileImg.src="images/SVGfile/file-type-standard-drawing-unknown-file.svg";
      }
      let small = document.createElement('small');
      small.classList='time';
      small.innerHTML = `${hr}:${minute} ${meridiem}`;

      fileDtls.innerHTML = fileName;
      fileSpan.appendChild(fileImg);
      fileSpan.appendChild(fileDtls);
      fileSpan.appendChild(small);
      div.appendChild(fileSpan)

      if (msgVal.length > 0){
        let msgSpan = document.createElement('span');
        msgSpan.classList = 'span-msg';
        msgSpan.innerHTML = msgVal;
        textarea.value="";
        div.appendChild(msgSpan);
      }

      sendDiv.appendChild(div);
      chatArea.appendChild(sendDiv);
      
      if (msgVal.length > 0){
        socket.emit('file',{from:name,to:id,file:dataUrlVal,divId:divId,extn:extnVal,filename:fileName,msgVal:msgVal});
      }else{
        socket.emit('file',{from:name,to:id,file:dataUrlVal,divId:divId,extn:extnVal,filename:fileName});
      }
    }
    playSound('message-sent');
    scrollDown();
    inputType.style.display='block';
    document.getElementById('file-btn').style.display = 'block';
    document.getElementById('send-btn').style.display = 'none';
    document.querySelector('.tagged-input').style.display = 'none';
    document.getElementById('tagged-file').style .display = 'none';
    document.querySelector('.emoji-picker').classList='emoji-picker';
    fileType = false;
    return;
  }




    if(textarea.value!==""){
      if(codeType){
        let notCommand = checkInput(textarea.value);
        if(notCommand){

      let sendDiv = document.createElement('div');
      sendDiv.classList='send-div';
      let div = document.createElement('div');
      div.classList='send-msg';
      let divId = Date.now();
      div.id= divId
      let div2 = document.createElement('div');
      div2.classList = 'overflow-control';
      let h4 = `<h4>${name}</h4>
                        <div class="opt" >
                            <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
                            <div onclick="copytext(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
                        </div>`;
      let small = document.createElement('small');
      small.classList='time-w';
      small.innerHTML=`${hour}:${minute} ${meridiem}`;

      let pre = document.createElement('pre');
      pre.classList = "line-numbers";
      let code = document.createElement('code');
      code.textContent=textarea.value;
      let pLang = (textarea.value).split('|')[0];
      code.classList=`language-${pLang}`;
      pre.appendChild(code);
      div2.appendChild(pre);
      Prism.highlightElement(code);

      div.innerHTML=h4;
      div2.appendChild(small);
      div.appendChild(div2);
      sendDiv.appendChild(div)
      chatArea.appendChild(sendDiv);
      socket.emit('text',{from:name ,to:id, DivId:divId,message:textarea.value});


        }
      
      }else{
        if(!taggedMsgSet){
          // let paramid = window.location.search;
          // let urlparams =new URLSearchParams(paramid);
          // let id =urlparams.get('id');
          // let name =localStorage.getItem("name");
          let sendDiv = document.createElement('div');
          sendDiv.classList='send-div';
          let div = document.createElement('div');
          div.classList='send-msg';
          let divId = Date.now();
          div.id = divId;
          
          div.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchmove', function(event) {
        touchEndX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchend', function(event) {
        if (touchEndX < touchStartX) {
            // Left swipe detected
            // alert("Left swipe detected!");
             touchStartX = 0;
             touchEndX = 0;
            return;
        }
        
        if (touchEndX - touchStartX > 150) {
            // Right swipe detected
            // alert("Right swipe detected!");
    
            createTaggedInput(this);
    
             touchStartX = 0;
             touchEndX = 0;
            // Your action for right swipe here
        }
    });
    
          let h4 = `<h4>${name}</h4>
                            <div class="opt" >
                            <i class="fa-solid fa-share" onclick="createTaggedInputBtn(this)"></i>
                                <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
                                <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
                            </div>`;
          let span = document.createElement('pre');
          span.classList = 'span-msg';
          span.innerHTML=textarea.value;

          let alphanumericSpecialWhitespaceRegex  = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?\/\\~\s-]+$/;
          let isLeters = alphanumericSpecialWhitespaceRegex .test(textarea.value);
          if (!isLeters){
            if( textarea.value.length==2 || textarea.value.length==3|| textarea.value.length==4 ||textarea.value.length==5 ||textarea.value.length==7 ){
              span.setAttribute('style','font-size:100px;text-align:center;');
            }
          }

          let small = document.createElement('small');
          small.classList='time';
          small.innerHTML=`${hour}:${minute} ${meridiem}`;
          div.innerHTML=h4;
          div.appendChild(span);
          div.appendChild(small);
          sendDiv.appendChild(div)
          chatArea.appendChild(sendDiv);
          socket.emit('chat',{from:name ,to:id,DivId:divId ,message:textarea.value});
        }else {
          ///////////////////////////////////////Tagged chat//////////////////////////////////////////////////////
          let sendDiv = document.createElement('div');
          sendDiv.classList='send-div';
          let div = document.createElement('div');
          div.classList='send-msg';
          let divId = Date.now();
          div.id = divId;
          
          div.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchmove', function(event) {
        touchEndX = event.touches[0].clientX;
    });
    
    div.addEventListener('touchend', function(event) {
        if (touchEndX < touchStartX) {
            // Left swipe detected
            // alert("Left swipe detected!");
             touchStartX = 0;
             touchEndX = 0;
            return;
        }
        
        if (touchEndX - touchStartX > 150) {
            // Right swipe detected
            // alert("Right swipe detected!");
    
            createTaggedInput(this);
    
             touchStartX = 0;
             touchEndX = 0;
        }
    });
    
          let h4 = `<h4>${name}</h4>
                            <div class="opt" >
                            <i class="fa-solid fa-share" onclick="createTaggedInputBtn(this)"></i>
                                <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
                                <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
                            </div>`;

           let taggedSpan = document.createElement('span');
           taggedSpan.classList = 'tagged-msg';
           let taggedContentId = document.getElementById('tagged-id');
           let taggedMainDiv = document.getElementById(taggedContentId.value);
           let taggedName = taggedMainDiv.querySelector('h4').innerText;
           taggedSpan.innerHTML=`<strong>${taggedName}</strong> ${taggedMainDiv.querySelector('.span-msg').innerText}`;
           taggedSpan.setAttribute('onclick',`scrollToDiv(${taggedContentId.value})`);


          let span = document.createElement('span');
          span.classList = 'span-msg';
          span.innerHTML=textarea.value;
          let small = document.createElement('small');
          small.classList='time';
          small.innerHTML=`${hour}:${minute} ${meridiem}`;
          div.innerHTML=h4;
          div.appendChild(taggedSpan);
          div.appendChild(span);
          div.appendChild(small);
          sendDiv.appendChild(div);
          chatArea.appendChild(sendDiv);
          socket.emit('tagged-chat',{from:name,to:id,DivId:divId,message:textarea.value,taggedId:taggedContentId.value});
          taggedContentId.value = "";
          closeTaggedInput();
        }
       
      }

    }

    playSound('message-sent');
    textarea.value="";
    scrollDown();
    document.querySelector('#file-btn').style.display='block';
    document.querySelector('#send-btn').style.display='none';
    textarea.style.height='25px';
    textarea.focus();
    let hasPTag = chatArea.querySelector('.unread');
    if(hasPTag !== null){
      hasPTag.remove(); //bug
    }

    document.querySelector('.emoji-picker').classList='emoji-picker';
    inputTypeBtn.style.display='block';
  }

  socket.on('delete-chat',({id})=>{
    let targetDiv = document.getElementById(id);
    if(targetDiv !==null ){
      targetDiv.innerHTML=`<span class="dlt-msg"><i class="fa-solid fa-ban" onclick="clearChat('${id}')"></i><h5>This msg is deleted.</h5></span>`;
    }
    
  })

  let typetime ;
  socket.on('typing',({name})=>{
    // document.getElementById('typing').innerHTML=`${name} is typing...`;
    let notypingDiv = chatArea.querySelector('.typing-div') == null;
    if(notypingDiv){
    let div = document.createElement('div');
    div.classList='typing-div';
    div.id = 'typing';
    // let h4 = `<h4>${name}</h4>`;
    let img = document.createElement('img');
    img.classList='typing';
    img.src="images/typing.gif";
    // div.innerHTML=h4;
    div.appendChild(img);
    chatArea.appendChild(div);
    scrollDown();
    }
    
    clearTimeout(typetime);
    typetime = setTimeout(()=>{
     let typDiv = document.getElementById('typing');
     if(typDiv !== null){
      typDiv.parentNode.removeChild(typDiv);
     }
    },5000)
  })

  socket.on('image',(data)=>{
    let currentDate  =new Date();
    let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];

    let chatBox = document.getElementById('chat-box');
    let isOpened = chatBox.classList.contains('textdoc-open');
    let hasPTag = chatArea.querySelector('.unread') !== null;
      
    if(!isOpened){
      if(!hasPTag){
        let unReadTag = document.createElement('p');
        unReadTag.classList='unread';
        unReadTag.classList.add('new-msg');
        unReadTag.innerHTML="Unread Messages";
        chatArea.appendChild(unReadTag);
      }
      msgCount++;
      let notifyBadge = document.querySelector('.msg-notification');
      notifyBadge.innerHTML = msgCount;
      notifyBadge.style.visibility='visible';
    }
    if(data.msg == null){
      let receiveDiv = document.createElement('div');
      receiveDiv.classList = 'receive-div';
      let div = document.createElement('div');
    div.classList='msg-div';
    div.id = data.divId;
    let h4 = `<h4>${data.from}</h4> 
    <div class="opt" >
    <div> <i class="fa-solid fa-share"></i></div>
    <div> <i class="fa-solid fa-download download" onclick="download(this,'${Date.now()}','${data.file}')"></i> </div>
    </div>`;
    let img = document.createElement('img');
    img.src=data.file;
    div.innerHTML=h4;
    let small =document.createElement('small');
    small.classList = 'time';
    small.innerHTML=`${hr}:${minute} ${meridiem}`;
    div.appendChild(img);
    div.appendChild(small);
    receiveDiv.appendChild(div);
    chatArea.appendChild(receiveDiv);
    }else {
      let receiveDiv = document.createElement('div');
      receiveDiv.classList = 'receive-div'
      let div = document.createElement('div');
      div.classList='msg-div';
      div.id = data.divId;
      let h4 = `<h4>${data.from}</h4>
      <div class="opt" >
          <div> <i class="fa-solid fa-share"></i></div>
          <div><i class="fa-solid fa-download" onclick="download(this,'${Date.now()}','${data.file}')"></i></div>
          <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
      </div>`;
      let img = document.createElement('img');
      img.src=data.file;
      div.innerHTML=h4;
      let small = document.createElement('small');
      small.classList='time';
      small.innerHTML = `${hr}:${minute} ${meridiem}`
      div.appendChild(img);
      div.appendChild(small);
      let span = document.createElement('span');
      span.classList = 'span-msg';
      span.innerText = data.msg;
      div.appendChild(span);
      textarea.value="";
      receiveDiv.appendChild(div);
      chatArea.appendChild(receiveDiv);
    }
    playSound('new-message');
    setTimeout(()=>{
      scrollDown();
    },500);
  })

let dataUrlVal;
let extnVal;
let fileName;
  function showFile(){
    inputType.style.display='none';
    codeType = false;
    inputType.classList = 'fa-solid fa-code input-type';
    textarea.placeholder = 'Type a message...';
    document.getElementById('sender-name').innerHTML="";
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
        fileName= file.name;

      sendFileConf();
      fileReader.value="";

    });
    reader.readAsDataURL(file);
    }else{
      alert("Max 16MB Allowed.");
      fileReader.value="";
    }
  }


  socket.on('file',({from,file,divId,filename,extn,msgVal=undefined})=>{

    let typDiv = document.getElementById('typing');
    if(typDiv !== null){
     typDiv.parentNode.removeChild(typDiv);
    }
    let currentDate  =new Date();
    let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];

    let chatBox = document.getElementById('chat-box');
    let isOpened = chatBox.classList.contains('textdoc-open');
    let hasPTag = chatArea.querySelector('.unread') !== null;
      
    if(!isOpened){
      if(!hasPTag){
        let unReadTag = document.createElement('p');
        unReadTag.classList='unread';
        unReadTag.classList.add('new-msg');
        unReadTag.innerHTML="Unread Messages";
        chatArea.appendChild(unReadTag);
      }
      msgCount++;
      let notifyBadge = document.querySelector('.msg-notification');
      notifyBadge.innerHTML = msgCount;
      notifyBadge.style.visibility='visible';
    }
    let sendDiv = document.createElement('div');
    sendDiv.classList='receive-div';
    let div = document.createElement('div');
    div.classList='msg-div';
    div.id= divId;
      if(msgVal !== undefined){
      let h4 =`<h4>${from}</h4>
      <div class="opt" >
          <div onclick="copyChat(this)"><i class="fa-regular fa-clipboard"></i> <small> copy</small></div>
      </div>`;
      div.innerHTML=h4;
    }else{

    let h4 =`<h4>${from}</h4>
    <div class="opt" >
    </div>`;
    // <div><i class="fa-solid fa-trash-can" onclick="deleteChat('${divId}')"></i></div>
    div.innerHTML=h4;
    }


    div.addEventListener('touchstart', function(event) {
      touchStartX = event.touches[0].clientX;
  });
  
  div.addEventListener('touchmove', function(event) {
      touchEndX = event.touches[0].clientX;
  });
  
  div.addEventListener('touchend', function(event) {
      if (touchEndX < touchStartX) {
          // Left swipe detected
          // alert("Left swipe detected!");
           touchStartX = 0;
           touchEndX = 0;
          return;
      }
      
      if (touchEndX - touchStartX > 150) {
          // Right swipe detected
          alert("Right swipe detected!");
  
          // createTaggedInput(this);
  
           touchStartX = 0;
           touchEndX = 0;
      }
  });

    let fileSpan = document.createElement('span');
    let fileDtls = document.createElement('p');
    let fileDownload = document.createElement('i');
    let fileImg = document.createElement('img');
    fileSpan.classList = 'send-file';
    fileDtls.classList ='file-desc' ;
    fileImg.classList = 'file-image';
    fileDownload.classList = 'fa-regular fa-circle-down download-btn download';
    fileDownload.setAttribute('onclick',`download(this,'${filename}','${file}')`);
    if(extn=='pdf'){
      fileImg.src="images/SVGfile/file-type-standard-drawing-pdf-document.svg";
    }else if(extn=='mp3'|| extn=='wav'|| extn=='aac'||extn=='m4a'){
      fileImg.src="images/SVGfile/file-type-standard-drawing-sound-file.svg";
    }else if(extn=='doc' || extn=='docx'){
      fileImg.src="images/SVGfile/file-type-standard-drawing-word-document.svg";
    }else if(extn=='txt'){
      fileImg.src="images/SVGfile/document-type-standard-drawing-notepad.svg";
    }else if(extn=='xls'||extn=='xlsx'||extn=='xlsm'||extn=='xlsb'){
      fileImg.src="images/SVGfile/document-type-standard-drawing-worksheet.svg";
    }else if(extn=='zip'||extn=='rar'){
      fileImg.src="images/SVGfile/file-type-standard-drawing-compressed-file.svg";
    }else if(extn=='mp4'||extn=='3gp'){
      fileImg.src="images/SVGfile/file-type-standard-drawing-video-file.svg";
    }else if(extn=='pptx'){
      fileImg.src="images/SVGfile/document-type-standard-drawing-slide.svg";
    }else if(extn=='json'){
      fileImg.src="images/SVGfile/json-5.svg";
    }else{
      fileImg.src="images/SVGfile/file-type-standard-drawing-unknown-file.svg";
    }
    let small = document.createElement('small');
    small.classList='time';
    small.innerHTML = `${hr}:${minute} ${meridiem}`;

    fileDtls.innerHTML = filename;
    fileSpan.appendChild(fileImg);
    fileSpan.appendChild(fileDtls);
    fileSpan.appendChild(fileDownload);
    fileSpan.appendChild(small);
    div.appendChild(fileSpan)

    if (msgVal !== undefined){
      let msgSpan = document.createElement('span');
      msgSpan.classList = 'span-msg';
      msgSpan.innerHTML = msgVal;
      textarea.value="";
      div.appendChild(msgSpan);
    }

    sendDiv.appendChild(div);
    chatArea.appendChild(sendDiv);
    playSound('new-message');
    setTimeout(()=>{
      scrollDown();
    },500);
  });


  let fileType = false;
  function sendFileConf(){
                document.querySelector('.tagged-input').style.display = 'block';
                document.getElementById('tagged-file').style .display = 'flex';
let fileImage = document.getElementById('tagged img');
let fileDescription = document.getElementById('tagged-desc');

    if(extnVal=='jpg'||extnVal=='png'||extnVal=='jpeg'||extnVal=='webp'||extnVal=='gif'){
     
      fileImage.src = dataUrlVal;
      
    }else{

      if(extn=='pdf'){
        fileImage.src="images/SVGfile/file-type-standard-drawing-pdf-document.svg";
      }else if(extn=='mp3'|| extn=='wav'|| extn=='aac'||extn=='m4a'){
        fileImage.src="images/SVGfile/file-type-standard-drawing-sound-file.svg";
      }else if(extn=='doc' || extn=='docx'){
        fileImage.src="images/SVGfile/file-type-standard-drawing-word-document.svg";
      }else if(extn=='txt'){
        fileImage.src="images/SVGfile/document-type-standard-drawing-notepad.svg";
      }else if(extn=='xls'||extn=='xlsx'||extn=='xlsm'||extn=='xlsb'){
        fileImage.src="images/SVGfile/document-type-standard-drawing-worksheet.svg";
      }else if(extn=='zip'||extn=='rar'){
        fileImage.src="images/SVGfile/file-type-standard-drawing-compressed-file.svg";
      }else if(extn=='mp4'||extn=='3gp'){
        fileImage.src="images/SVGfile/file-type-standard-drawing-video-file.svg";
      }else if(extn=='pptx'){
        fileImage.src="images/SVGfile/document-type-standard-drawing-slide.svg";
      }else if(extn=='json'){
        fileImage.src="images/SVGfile/json-5.svg";
      }else{
        fileImage.src="images/SVGfile/file-type-standard-drawing-unknown-file.svg";
      }

    }
    fileDescription.innerHTML = fileName;
    fileType = true;
    
    document.getElementById('smodal').style.display='none';
    document.getElementById('file-btn').style.display = 'none';
    document.getElementById('send-btn').style.display = 'block';
  }

  function cancelDeleteConf(){
    deleteDivId = undefined;
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
    let currentDate  =new Date();
    let ISTOptions = {timeZone: 'Asia/Kolkata'};
let currentISTTime = currentDate.toLocaleString('en-IN', ISTOptions);
let [date,time] = currentISTTime.split(',');
let [hour, minute, sec] = time.split(':');
let hr = hour.trim().padStart(2 ,"0");
let meridiem = sec.split(' ')[1];
let devMsg = document.getElementById('dev-msg');
devMsg.innerHTML = `Hi ${name}! welcome to MeeT. This is a system generated message for all users.If you facing any error/ complaint take a screen shot and send 📧mail to  <a href="mailto:bikramsahoo@live.in">bikramsahoo@live.in</a> .
    For programming help send command [ code-help ] on code input box .<br> Thanking You 🙏🏼 | Happy MeeTing 😊
    <small class="time">${hr}:${minute} ${meridiem}</small>`;
    setTimeout(()=>{
      document.querySelector('.dev-msg').style.display='flex';
      let chatBox = document.getElementById('chat-box');
      let isOpened = chatBox.classList.contains('textdoc-open');
      if(!isOpened){
         msgCount++;
      let notifyBadge = document.querySelector('.msg-notification');
    notifyBadge.innerHTML = msgCount;
    notifyBadge.style.visibility='visible';
      }
     
    },5000)

  }

  socket.on('joined-data',({})=>{
    if(isVideoShared || isAudioShared || isScreenShared){
      let uid =  sessionStorage.getItem('uid');
      let sid = sessionStorage.getItem('sid');
      initiateCall(sid,uid);
    }
  })
  
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

      let paramid = window.location.search;
      let urlparams =new URLSearchParams(paramid);
      let mid =urlparams.get('id');
      socket.emit('joined-data',{pid:mid});

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