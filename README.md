# <p align ="center" >AUTOVSB</p>
## <p align ="center" >AUTOVSB - AUTO Vaccine Slot Booker </p>
A script based on browser automation which continuously scraps COVID-19 vaccine slot data, alerts you and books it for you when it's available using browser automation.


[![Demo AUTOVSB](https://i.imgur.com/ooTyjKP.gif)](https://www.youtube.com/watch?v=_4PlaRtGYQ0)


## Table of Contents 📕

- [About the Project](#about-the-project)
  - [Why AUTOVSB?](#why-autovsb-over-other-scripts--)
  - [Features](#features-)
  - [Built With](#built-with-)
- [Getting Started](#getting-started-)
  - [Prerequisites](#prerequisites-)
  - [Installation](#installation)
  - [How it Works?](#how-it-works)
- [Motivation](#motivation)


## About the project 

### <p align="center">Why AUTOVSB over other scripts ? </p>
There has been an overwhelming response to the automation of booking. Cowin has provided some APIs that could be used for several tasks, from scraping slot data to OTP verification, downloading certificates, and many more. [ [1](https://apisetu.gov.in/public/api/cowin/cowin-public-v2) ]

But eventually, there has been an increase in the use of these public APIs, which resulted in server load, the site being slow, and other issues. More details can be found here. [ [2](https://www.indiatoday.in/technology/news/story/changes-in-cowin-app-govt-restricts-vaccine-slot-info-to-fight-bots-and-alert-services-1799827-2021-05-07) ]

<p align="center"><img src="https://imgur.com/B0pXS6O.jpg" alt="india-today-news" width="512"/></p>

Hence, there have been many restrictions applied to the public APIs. So using scripts that run on those APIs might get a lot of issues in the future. AUTOVSB, on the other hand, uses browser automation. It functions as if a regular user logs in, checks for slots, if available, books it. Hence, it is also more reliable ;)

### Features : 
-   A secure script for automatic vaccine slot booking.
-   Browser automation, hence no load of restrictions on Public APIs.
-   Vizualisable and easy-to-use.
-   Auto alert on slots availability.
-   Supports multiple pincodes, Increased chances of booking.
-   Automatic appointment slip downloading. 

### Built With : 
- [Puppeteer](https://pptr.dev/) - used for browser automation.




## Getting Started ✅

To get a local copy up and running, follow these simple steps.

### Prerequisites 📖

These are the prerequisites required to run this application:

- npm
- android app - AUTOVSB

### Installation

1. ##### Clone the AUTOVSB repository form github 

```sh
  git clone https://github.com/MiHarsh/AUTOVSB.git
  cd AUTOVSB
```
2. ##### Install Dependencies

```sh
  npm install
```
3. ##### Update credentials.json

```sh
{
	"mobile_number": 1234567890,  # type --> int
	"hash_number" : 111111111,    # type --> int [provided by the app]
	"age":18,                     # type --> int values = 18, 45
	"zipcodes":[                  # type --> array of strings
		        "230001",       
		        "210001",
		        "221007"
               ],
	"preferred_slot":0,              # type --> int values = 0,1,2,3
	"functionality_visibility":true  # type --> bool
}
```


4. ##### To run the application

```sh
  npm test
```

**Note** : If your network connectivity is good, you can reduce the time(in milliseconds) in the timeouts. The values given now, works fine for an average user. Please feel free to play with it according to your connection speed.

```js
await testingPage.waitForTimeout(<time in miliseconds>);
```

**Note** : Since we have not tested on a large scale, there might be a lot of issues encountered. Feel free to raise issues, even send PRs if you can handle them. The main aim is to benefit our whole community, so even a small step could help others.

Also, we might be updating scripts based on the user's experience, and it would be great if you could keep a `watch` on this repo. Also, pull the latest commits before running the script. To git pull just write,
```sh
git pull
```


### How it works?
Once you run the script, it will check for slot availability on the user's ZIP code and, if available, return the **ZIP code** that has the **maximum** number of slots from the date entered. After that, it will **log in** with the user's mobile number, **auto-detect** the OTP from the user's phone, and will **schedule** the slot for the members looking for the **first dose** in the user's account, as per the user's **preferred time slot**, and **download** the appointment slip.

**Note** - Users will have to add member manually before running the script.

### Motivation:
I am a Bachelor's student, due to having irregular schedules, we often face many troubles. Booking a vaccine slot now stands on the top ;) Many of my friends were facing the same problem, sometimes looking for slots also hindered the efficiency of doing other tasks. Occasionally, we also kept an eye on the telegram groups. Getting fed up with this, we thought of finding a solution.

So, Who are we? We are programmers. What do we do? We write codes ;) Why not have one for this problem too? And here's the solution.

**I had recently learned puppeteer, a super cool browser automation library. So this project is mainly based on puppeteer.**
  
