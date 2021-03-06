Kahoots Web App and Kahoots Web Klipper
========================================

Kahoots Web App and the chrome extension Kahoots Klipper were developed as part of a 10 week internship at Talis. The purpose of this project was to build a simple tool that allowed students to capture content from the web and then organise and share then content for their personal study goals, or share that content with their study groups.

Install Prerequisites
---------------------
Before installing Kahoots, you will need to set up your dev environment.
Instructions can be found here (Step 1 only):

    http://yeoman.io/codelab/setup.html

Install Kahoots Web App
----------------

To install, grab a copy of the repository:

    git clone https://github.com/talis/kahoots.git

Install all of the dependencies:

    npm install
    bower install

The app requires mongo.
For mongo, you may need to create db directory:

    sudo mkdir /data/db

Make sure mongo is running:

    mongod
    mongo

for more information on installing mongo, visit:

    http://docs.mongodb.org/manual/installation/

For this project you will also need have your own babel server,
information on how to install this can be found here:
(This is a private repository, only available to developers in the Talis organisation)

    https://github.com/talis/babel-server

To being the application, use the grunt command:
    
    cd kahoots/kahootsApp
    grunt serve

Adding Kahoots Klipper to Chrome Browser
-----------------------------------------

1. On your chrome browser, click menu.
2. Select More tools > Extensions.
3. Click on the button Load unpacked extension...
4. Select kahoots/kahootsKlipper/app and click open.
5. You should see a little jigsaw puzzle icon in the top right corner of your browser, click this to start the Klipper.

Running tests for the we application
------------------------------------

To begin the tests, use the grunt command:

    cd kahoots/kahootsApp  
    grunt test:server

