const loginPageButton = document.querySelector("#loginPage")
const mainContainer = document.querySelector("#main")
const baseURL = 'https://kaamelott.jeremyduc.com/api/'
let token = null
loginPageButton.addEventListener("click", displayLoginPage)
function clearMainContainer(){
    mainContainer.innerHTML= ""
}

function display(content){
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit

    mainContainer.innerHTML=content
}
function login(){
    let url = `${baseURL}login_check`
    let body = {
        username : usernameLogin.value,
        password : passwordLogin.value
    }

    let bodySerialise = JSON.stringify(body)
    let fetchParams = {
        headers:{"Content-Type":"application/json"},
        method : "POST",
        body: bodySerialise
    }
    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=> {

            if(data.token){
                console.log(data)
                token = data.token
                console.log('OK')
                displayQuotesPage()
            }else{
                console.log('error')
            }
        })
}

function getQuoteTemplate(quote){
    let template = `
        <div class="border border-dark m-3 p-3">
            <p>Par : ${quote[0].character}</p>
            <div class="quoteContent">
                <p><strong>${quote[0].content}</strong></p>
            </div>
        </div>
        `
    return template
}

function getLoginTemplate(){
    let template = `    
    <div class="d-flex justify-content-center flex-column align-items-center ">
        <div class="loginPage text-center p-4">
            <h2>Se connecter</h2>
            <div class="group mt-3">
                <label>Nom d'utilisateur</label>
                <input class="form-control" type="text" id="usernameLogin">
            </div>
            <div class="group mt-3">
                <label>Mot de passe</label>
                <input class="form-control" type="password" id="passwordLogin">
            </div>
            <button class="btn btn-primary mt-3" id="loginButton">VALIDER</button>
        </div>
    </div>
    `
    return template
}

function getQuotesTemplate(quotes){

    let quotesTemplate = ""

    quotes.forEach(quote=>{

        quotesTemplate+=  getQuoteTemplate(quote)
    })

    return quotesTemplate

}

async function getQuotesFromApi(){

    let url = `${baseURL}quotes`

    let fetchParams = {
        method : 'GET',
        headers : {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    }

    return await fetch(url, fetchParams)
        .then(response=>response.json())
        .then(quotes=>{
            console.log(quotes)
            return quotes

        })
}

async function displayQuotesPage(){
        let messagesAndMessageField = ""
        getQuotesFromApi().then(quotes=>{
            messagesAndMessageField+=getQuotesTemplate(quotes)
            display(messagesAndMessageField)

        })
}

function displayLoginPage(){
    display(getLoginTemplate())
    const usernameLogin = document.querySelector('#usernameLogin')
    const passwordLogin = document.querySelector('#passwordLogin')
    const loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener("click", ()=>{
        login()
    })
}
