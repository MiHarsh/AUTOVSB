# <p align ="center" >AUTOVSB</p>
## <p align ="center" >AUTOVSB - AUTO Vaccine Slot Booker </p>
A script based on browser automation which continuously scraps COVID-19 vaccine slot data, alerts you and books it for you when it's available using cowin-public-v2 API for India.

## Table of Contents 📕

- [About the Project](#about-the-project)
  - [Description](#description)
  - [Features](#features)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

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
## About the project 

### Description  :
A script based on browser automation which continuously scraps COVID-19 vaccine slot data, alerts you and books it for you when it's available using cowin-public-v2 API for India.

### Features : 
-   A secure script for automatic vaccine slot booking.
-   Vizualisable and easy-to-use, browser automation.
-   Auto alert on slots availability.
-   Supports multiple pincodes, Increased chances of booking.
-   Automatic appointment slip downloading. 

### Build With : 
- [Puppeteer](https://pptr.dev/) - used for browser automation.

### Motivation:
I am a Bachelor's student, due to having irregular schedules, we often face many troubles. Booking a vaccine slot now stands on the top ;) Many of my friends were facing the same problem, sometimes looking for slots also hindered the efficiency of doing other tasks. Occasionally, we also kept an eye on the telegram groups. Getting fed up with this, we thought of finding a solution.

So, Who are we? We are programmers. What do we do? We write codes ;) Why not have one for this problem too? And here's the solution.

**I had recently learned puppeteer, a super cool browser automation library. So this project is mainly based on puppeteer.**
  
