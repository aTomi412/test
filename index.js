//定数定義
const partsname = document.getElementById("name");
const partsimg = document.getElementById("partsimg");
const checkfield = document.getElementById("check");
const codesfield = document.getElementsByClassName("codecontainer");
const startbutton = document.getElementById("startbutton");
const timer = document.getElementById("timer");
const questions = partslist.length;
//変数定義
let codes;
let randomquestion;
let answerTime =0
let passedtime = 0;
let intID;

//関数定義

const starttimer = function() {
    let start = new Date();
    intID = setInterval(function() {
        const now = new Date();
        passedtime += now - start;
        const hour = Math.floor(passedtime/3600000);
        const minute = Math.floor((passedtime- 3600000 * hour) / 60000);
        const hh = ('00' + hour).slice(-2);
        const mm = ('00' + minute).slice(-2);
        const ms = ('00000' + (passedtime % 60000)).slice(-5);
        const time = `${hh}:${mm}:${ms.slice(0,2)}.${ms.slice(2,3)}`;
        start = now;
        timer.textContent=time;
    },100)
}

const init = function(){
    codes = document.querySelectorAll(".code");
    randomquestion = partslist.sort(()=>Math.random()-0.5);
    answerTime=0;
    codes[3].addEventListener("input",reset);
    codes[3].addEventListener("input",check);
    codes[3].addEventListener("input",renew);
    codes.forEach((c,i) => {
        c.addEventListener("keydown", e => {
            if(0<=e.key && e.key<=9 && i!=codes.length-1){
                setTimeout(()=>codes[i+1].focus(),10)
            }
            else if (e.key==="Backspace" && i!=0){
                codes[i-1].value=""
                setTimeout(()=> codes[i-1].focus(),10)
            }
        })}
    )
    setTimeout(()=>codes[0].focus(),100)
    renew();
}

const start = function(){
    starttimer();
    for (let i=0; i<4; i++){
        const codenords = document.createElement("input");
        codenords.type="number";
        codenords.classList.add("code");
        codenords.min=0;
        codenords.max=9;
        codesfield[0].appendChild(codenords);
    }
    startbutton.remove();
    init();
}

const reset = function() {
    setTimeout(function(){
        let codes = document.querySelectorAll(".code");
        codes.forEach(x=>x.value="")
        codes[0].focus();
        },10);  
}

const renew = function() {
    try{
        if (randomquestion.length==0) {
        viewResult();
        }
        else {
        const quesitonparts = randomquestion[0];
        const questionname = quesitonparts.name;
        const questioncode = quesitonparts.code;
        const questionimg = quesitonparts.img;
        partsname.textContent = questionname;
        partsimg.src = questionimg;
        }
    }
    catch(e) {
        console.log(e);
    }
}

const check = function() {
    const trueanswer = partslist.find( c => c.name==partsname.textContent)
    let answer ="";
    codes.forEach(v => answer+=v.value)
    if (trueanswer.code == answer){
        deleteCircle(createCircle);
        randomquestion.splice(0,1);
        answerTime++;
    }
    else {
        deleteCircle(createX);
        answerTime++;
    }
}

const createCircle = function(){
    return new Promise(resolve=> {
    const circle = document.createElement("img");
    circle.id = "circle";
    circle.src="circle.png";
    checkfield.appendChild(circle);
    setTimeout(resolve,200);   
    })  
}

const createX = function(){
    return new Promise(resolve=> {
        const circle = document.createElement("img");
        circle.id = "circle";
        circle.src="x.png";
        checkfield.appendChild(circle);
        setTimeout(resolve,200);   
        })  
}

const deleteCircle = async function(fnc){
    await fnc();
    const checker = document.getElementById("circle");
    checker.remove();
}

const viewResult = function() {
    const rightPercent = Math.floor((questions/answerTime)*100);
    for (let i=0; i<4; i++) {
    codesfield[0].removeChild(codes[i]);
    }
    partsname.textContent=`正答率：${rightPercent}%`;
    clearInterval(intID);
}

//処理
startbutton.addEventListener("mousedown",start);
startbutton.addEventListener("mouseup",init);