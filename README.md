# Northcoders News API

This read me is assisted as part of the Northcoders bootcamp:

This portfolio project was created as part of a Digital Skills boot camp in Software Engineering provided by [Northcoders](https://northcoders.com/)

## Appendix

The work here is largely of my own, returning custom error handling, tests, controller and model files, using knowledge i have picked up so far, and experiment. I am aware there is some work to go, alas, it feels good to get my first project out of the way and getting a proper understanding of what's going on.

I'm also taking to time to note the appreciation I have for all Northcoders staff who helped me along this journey with feedback, showing where my improvements can be made, alongside praise for where i did a good job. I'd also like to thank my fellow LG-D cohort, no matter how great or small their assistance was, every bit helped me get to the finish line of the project and learn with the full week of practice with the two weeks of theory we picked up along the way.

## Table of contents

- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Purpose](#purpose)
- [Error Handling](#error-handling)
- [Tests](#tests)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Testing**: Jest, Supertest
- **Hosting**: Render (backend), Supabase (database)
- **Other Tools**: dotenv for environment configuration

## Setup and live content

The requirements to run this project are as follows:

1. clone the repo here: https://github.com/Fandasuba/-news-room-project
2. npm install
3. Once all requirement are installed, feel free to connect to relevant databases, such as:
   3.1. nc_news_test - test server where you can test any necessary requirements or appendages.
4. create .env.development and .env.test files as they are git ignored. place the test server in the test file for example.
5. npm run setup-dbs
6. npm run seed
7. npm test
8. npm start (if you're local hosting)
   8.1 adjust listen file to a local host port at 8000 or 9090 for local hosting testing.

If you want to find a live version, feel free to run the program via https://news-room-project.onrender.com/

**Note that the link will 404. Insert /api when the link spins up and runs to get started.**

Be mindful of the spin up time. It is operating on a free version of render and SUPABASE. Therefore, expect some slow spin up if now queries have come in recently.

---

## Purpose

The purpose of this backend project is to simulate what a live and test server is like for future learning and practical implementation. I is themed around a news aggregation board, such as real world examples such as Reddit, alongside an old website i personally used to work on when i was a digital journalist, Gamer Guides. It is largely an experiment of what is to come when learning front end, alongside the custom project at the end of the boot camp.

In terms of what you'll find, you will be able to get a glimpse of a backend server dealin with information requests. The data is fairly primitive, containing a range of SQL queries, featuring a range of table joins, categories, sort by filters and more. You can find a range of valid endpoints as follows:

- /api
- /api/topics
- /api/articles
- /api/articles/_insert number here_
- /api/articles/articles/_insert number here_/comments
- /api/users

the endpoints bring you to various get, patch post and delete options.

Most of the GET endpoints also take a range of modifiers, Feel free to add any sort by, asc or desc from available categories to find.

## Error Handling

If you encounter any errors with the live server, keep in mind there are deliberate error handlings based on express, Postgresql, and my own custom error comments. The most comment errors you'll find are:
400 - bad requests. It typically means that you have inputted a invalid criteria, such as an invalid number.
404 - bad end point request.
500 - something i may have overlooked.

Typically if you encounter a 404 or 400, then you will then get a custom error message, typically detailing what you did wrong. If you are still unsure what yo did wrong, feel free to provide feedback and i'll see what custom errors i can add to ensure correct pathing to your desired endpoint.

## Tests

The test folder is quite numerous, however, it still shows my current junior understanding of test environment. I'll admit i have some work to improve on with the tests, which is also reflected with the feedback i received during the backend project with tutor feedback.

The timeline of the tests are largely showcasing my learning throughout the week. At times you'll see where i learned of something i needed to test for, where I realised I probably don't need to 404 test every endpoint and use a app.all catch instead. Moreso, you'll see where i wtn back to old tasks and test describe blocks to learn where all the functionality gets added in. This is where i grew to improve the error handling to better advise users how to manage functionality, and more importantly refactor code as the basic architecture and framework was built.
