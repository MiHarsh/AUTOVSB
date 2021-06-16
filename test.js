// ##################### LOAD REQUIRED STUFFS #################
const puppeteer = require('puppeteer');
var creds       = require('./credentials.json');
var player      = require('play-sound')(opts = {})
let testingPage = null;
// ############################ LOADED #################


// ##################### FUNCTION TO LAUNCH THE BROWSER ################
async function boot(){
    browser = await puppeteer.launch({
          headless: !creds["functionality_visibility"], 
          args: [
             `--no-sandbox`,
             `--allow-running-insecure-content`,
              `--start-maximized`
          ],
          pipe: true
        });
    console.log("Welcome @user :) , now sit back and go on resume your work \n");
    testingPage = await browser.newPage();
    await testingPage.setViewport({ width: 1366, height: 768});
    };

// #######################################################################
    

// ######################### START AUTOMATION #########################
async function start(){


    const age = creds['age'] ;
    let mobile_number = creds['mobile_number'];
    let hash_number = creds['hash_number'];
    let zipcode= creds['zipcodes']   //list of pincodes
    var preferred_slot = Number(creds['preferred_slot']);

    let curr_date = new Date(); //current date
    let checkdate = [curr_date.getDate(), curr_date.getMonth()+1, curr_date.getFullYear()].join('-')//date in required format

    // ###################################################
    /* PIN HAVING MAXIMUM SLOT
        IF NONE HAVE SLOTS, 0 IS RETURNED
        ONCE A SESSION WITH SLOTS IS LOCATED,
        IT GRABS THE PIN AND STORES IN getSlotPIN
    */

    getSlotPIN = 0
    while(!getSlotPIN){
        getSlotPIN = await checkSlot({zipcode,checkdate,age});
        if(!getSlotPIN){
            await testingPage.waitForTimeout(40000);
        }
    }
    // ###################################################
    // Notify user about availability of vaccine 
    player.play('notifyme.wav', function(err){
        if (err) throw err
    });
    
    let pincode = String(getSlotPIN) ;
    console.log("Vaccine is available at pincode " + pincode); // if user wants to book himself...
    // ###################################################

    let newUrl = "https://selfregistration.cowin.gov.in/";
    await testingPage.goto(newUrl);
    await testingPage.waitForTimeout(5000);

    // ################## SITE IS LOADED ######################

    console.log("Entering mobile Number ");
    // ###################### ENTER THE MOBILE NUMBER AND CLICK NEXT #################################
    await testingPage.waitForSelector('input#mat-input-0'); // <-- wait until it exists
    await testingPage.focus("input#mat-input-0");
    await testingPage.keyboard.type(String(mobile_number), {delay: 800});

    await testingPage.evaluate(()=>{
        document.querySelector("[class='covid-button-desktop ion-text-center']").children[0].click();
    });

    // ##########################################################################################
    
    await testingPage.waitForTimeout(5000);
    console.log("Waiting to auto detect OTP ");
    var otp = await retrieveOTP(mobile_number,hash_number);
    
    console.log("OTP detected, Entering the OTP ");

    // ###################### ENTER THE OTP VERIFICATION CODE AND CLICK NEXT #####################

    await testingPage.waitForSelector('input#mat-input-1'); // <-- wait until it exists
    await testingPage.focus("input#mat-input-1");
    await testingPage.keyboard.type(otp, {delay: 800});
    await testingPage.evaluate(()=>{
        document.querySelector("[class='covid-button-desktop ion-text-center']").children[0].click();
    });

    // ##########################################################################################
    console.log("OTP successfully Entered ");
    await testingPage.waitForTimeout(5000);

    // ##########################################################################################
    /* For now, this is only concerned for booking of first dose, will implement further later*/
    console.log("Searching for appointments to schedule for Dose 1.. ");
    let sch = await testingPage.evaluate(() => {

        let elements = document.getElementsByClassName("m-lablename");
        const len = elements.length;
        var i=0;

        while(i<len){
            if(elements[i].innerText === "Schedule"){
                break;
            }
            else if(elements[i].innerText === "Certificate"){
                i+=2;
            }
            else{
                i++;
            }
        };

        if(i>=len){
            return 0; 
        }

        if(elements[i].innerText === "Schedule"){
            elements[i].click();
            return 1;
            
        }
    }); 


    if( sch === 0 )
    {
        console.log("Nothing to Schedule for Dose 1");
        await browser.close();
        process.exit(1);
        
    }

    // ####################################################################################
    console.log("Search Complete ... ");
    await testingPage.waitForTimeout(5000);
    
    console.log("Entering the PinCode: " + pincode);
    // ###################### ENTER THE PIN CODE  #################################
    await testingPage.waitForSelector('input#mat-input-2'); // <-- wait until it exists
    await testingPage.focus("input#mat-input-2");
    await testingPage.keyboard.type(pincode, {delay: 800});
    
    // ####################################################################################
    console.log("Selecting a slot....");
    // ###################### SELECT FREE AND CATEGORY OPTIONS  #################################
    /* I have implemented in loop because, may be due to some network issues, if page is not loaded full,
    it should give another try */

    var flag = 1;
    while(flag){

        await testingPage.evaluate(({age})=>{

            elements = document.getElementsByClassName("button")[0];
            elements.click();

            if(age === 18){
                document.getElementById("c1").click(); // select 18+ criteria
            }
            else{
                document.getElementById("c2").click();
            }

            document.getElementById("c7").click(); // to select free vaccination

        },({age}));

        await testingPage.waitForTimeout(3000);

        flag = await testingPage.evaluate(()=>{
            avail_vac = document.querySelectorAll("a[href='/appointment'][class='accessibility-plugin-ac ng-star-inserted']");
           
            if(avail_vac.length !=0 ){
                return 0;
            }
            return 1;});

        if(flag===1){
            await testingPage.waitForTimeout(50000);
        }
    }

    // ####################################################################################
    
    // ###################### CLICK ON THE AVAILABLE SLOT LIST  #################################
    /* Many slots may be available, but as we are monitoring from start, 
    we can safely go with just the very first slot instead of looping on and on. */
    await testingPage.evaluate(()=>{
        let avail_vac = document.querySelector("a[href='/appointment'][class='accessibility-plugin-ac ng-star-inserted']");
        avail_vac.click(); 
    });

    // ####################################################################################
    await testingPage.waitForTimeout(5000);
    console.log("Selecting Preferred Slot ....");
    // ###################### SELECT PREFERRED SLOT TIMING  #################################    
    await testingPage.evaluate(({preferred_slot})=>{
        let slots = document.querySelectorAll("[class='time-slot accessibility-plugin-ac ng-star-inserted md button button-solid ion-activatable ion-focusable hydrated']");
       
        slots[preferred_slot].click();
    },{preferred_slot});

    // ####################################################################################
    console.log("Confirming the Booking ....");
    // ###################### CONFIRM BOOKING  #################################  
    await testingPage.evaluate(()=>{
        let btn = document.querySelectorAll("[class='covid-button-desktop ion-text-end book-btn button-container__right']");
        btn[0].children[0].click() ; 
    });
    console.log("Booking Confirmed, Congrats ....");
    // ####################################################################################
    await testingPage.waitForTimeout(6000);
    console.log("Downloading the Appointment Slip ....");
    // ###################################### DOWNLOAD  #################################  
    await testingPage.evaluate(()=>{
        let btn = document.querySelector("[class='print-icon accessibility-plugin-ac']");
        btn.click();
    });
    // ####################################################################################

    await testingPage.waitForTimeout(5000);
    await testingPage.close();
    process.exit(0);
    }

// ########################################################################################


async function checkSlot({zipcode,checkdate,age}){
    let final_pincode = 0;// default value of pincode
    let total_dose = 0;// default value of total dose at a pincode

    for (var k = 0; k < zipcode.length; k++)//for loop to iterate through list of pincode 
    {   
        let pin = zipcode[k];
        
        response = await testingPage.evaluate(({pin,checkdate})=>{
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pin+"&date="+ checkdate, false);
            xhttp.send();
            return xhttp.response;
        },{pin,checkdate});

        var data = JSON.parse(response);
   
        var centre_avail=data.centers.length;//number of centers available at a pincode
        let i=0;
        let dose_availble=0;//dose available at a pincode
        
        while(i<centre_avail)//if center available at the pincode
        {
            if(data.centers[i].fee_type==="Free")//if vaccine is free
            {
                let j=0; 
                while(j<data.centers[i].sessions.length) //iteration through all sessions 
                {
                    if(data.centers[i].sessions[j].min_age_limit===age && data.centers[i].sessions[j].available_capacity_dose1!==0)//checking age limit and availbility
                        {
                            dose_availble=dose_availble+data.centers[i].sessions[j].available_capacity_dose1;
                        }
                    j++;
                }
            }
            i++;
        }
        //if total dose availabel at any pincode for week is greater than the total dose or not
        if(total_dose<dose_availble)
        {
            total_dose=dose_availble;
            final_pincode=pin;
        }

    }
    return final_pincode;
}


async function fetchFromFirebase(mobile_number,hash_number){

    response = await testingPage.evaluate(({mobile_number,hash_number})=>{
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "https://miharsh.pythonanywhere.com/" + String(mobile_number) + "/" + String(hash_number), false);
        xhttp.send();
        return xhttp.response;
    },{mobile_number,hash_number});

    return JSON.parse(response);
}

void async function resendOTP(){
    await testingPage.evaluate(()=>{
        document.querySelector("[class='ion-text-center']").children[0].children[1].click();
    })
    await testingPage.waitForTimeout(3000);
}

async function retrieveOTP(mobile_number,hash_number){
    let flag = 0;
    let tn = Date.now();
    
    let response = await fetchFromFirebase(mobile_number,hash_number);
    
    let tf = response['ts'];
    let otp = response['otp'];


    while(!flag){

        if( (Date.now() - tf) < 170000 ){
            flag = 1;
            return otp;
        }
        else {
            if(Date.now() - tn > 210000){
                await resendOTP();
                tn = Date.now();
            }
            response = await fetchFromFirebase(mobile_number,hash_number);
            tf = response['ts'];
            otp = response['otp'];
        }
    }
}

async function boot_start(){
    await boot();
    await start();
    };

boot_start();
