const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelector("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

//set strength color to grey
setIndicator("#ccc");

//setPasswordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/ (max - min)) + "%100";

}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow= '0px 0px 12px 1px ${color}';
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCb.checked) hasUpper = true;
    if(lowercaseCb.checked) hasLower = true;
    if(numberCb.checked) hasNumber = true;
    if(symbolCb.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
        //to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shuffleArray(array) {
//fisher Yates method
    for (let i = array.length - 1; i > 0; i--) {
      // find out random j
      const j = Math.floor(Math.random() * (i + 1));
      // swap 2 numbers
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckBoxChange{
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{ 
        if(checkBox.checked){
            checkCount++;
        }});

        //special condition-> password-length should be >= selected no. of checkbox
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
})


inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});


copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
generateBtn.addEventListener('click',()=>{
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    console.log("Starting the journey");
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");

    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value=password;
    console.log("UI addition done");

    //calculate strength
    calcStrength();
});

