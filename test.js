const puppeteer = require('puppeteer');
let testingPage = null;


async function boot(){
    browser = await puppeteer.launch({
          headless: false, // extension are allowed only in head-full mode
          args: [
             `--no-sandbox`,
             `--allow-running-insecure-content`
          ],
          pipe: true
        });
    testingPage = await browser.newPage(); };
    

async function start(){
    // Test feature
    let newUrl = "https://selfregistration.cowin.gov.in/";

    const age = 18 ;

    let pincode = '229408';

    await testingPage.goto(newUrl);
    var flag = 1;

    await testingPage.waitForTimeout(30000);

    // GOTO dashboard
    await testingPage.goto("https://selfregistration.cowin.gov.in/dashboard")
    await testingPage.waitForTimeout(5000);

    // Select element to schedule booking 

    await testingPage.evaluate(() => {

        let elements = document.getElementsByClassName("m-lablename");
        const len = elements.length;
        var i=0;

        while(i<(len-1)){
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

        if(elements[i].innerText === "Schedule"){
            elements[i].click();
        }
        else{
            alert("Sorry Nothing to Schedule !!");
        }

    });

    // Now Enter the Pincode Page ------>

    await testingPage.waitForTimeout(5000);
    await testingPage.waitForSelector('input#mat-input-0'); // <-- wait until it exists
    await testingPage.focus("input#mat-input-0");

    await testingPage.keyboard.type(pincode, {delay: 1000});

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
            await testingPage.waitForTimeout(10000);
        }
    }


    // Now we have time slot lists;
    await testingPage.evaluate(()=>{
        let avail_vac = document.querySelector("a[href='/appointment'][class='accessibility-plugin-ac ng-star-inserted']");
        
        avail_vac.click(); 
    });

 

    
    await testingPage.waitForTimeout(5000);

    await testingPage.evaluate(()=>{
        let slots = document.querySelectorAll("[class='time-slot accessibility-plugin-ac ng-star-inserted md button button-solid ion-activatable ion-focusable hydrated']");
        
        slots[0].click(); // time 10-12 am
    });

    await testingPage.evaluate(()=>{
        let btn = document.querySelectorAll("[class='covid-button-desktop ion-text-end book-btn button-container__right']");
       
        btn[0].children[0].click() ; // time 10-12 am
    });

  
    await testingPage.waitForTimeout(6000);

    await testingPage.evaluate(()=>{
        let btn = document.querySelector("[class='print-icon accessibility-plugin-ac']");
        btn.click();
    });

    await testingPage.waitForTimeout(6000);

    await testingPage.close();
    
    }

async function boot_start(){
    await boot();
    await start();
    };

boot_start();

