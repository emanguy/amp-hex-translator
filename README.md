# amp-hex-translator
[![Build Status](https://travis-ci.org/emanguy/amp-hex-translator.svg?branch=master)](https://travis-ci.org/emanguy/amp-hex-translator)

A static webpage which translates AMP hexadecimal messages into a human-readable format.

![image](https://cloud.githubusercontent.com/assets/6354401/21083274/cac9769c-bfba-11e6-9d86-3659465ebceb.png)

#Installation

Simply install [bower](https://bower.io/) through [NPM](https://nodejs.org). Download the latest version of the code from our [releases](https://github.com/emanguy/amp-hex-translator/releases) page and run `bower install --production` to install dependencies for the webpage. Serve with your favorite web server.

#Usage

Enter an [Asynchronous Messaging Protocol](https://tools.ietf.org/html/draft-birrane-dtn-amp-03) message into the text box at the top of the page and click "go". This will start the parsing process, then the page will render the contents of the hex in plain-english format or tell you that parsing failed and what went wrong.

#Documentation

You can see documentation on the JSON object format for objects passed throughout the page and other design details on the [wiki](https://github.com/emanguy/amp-hex-translator/wiki). We will also have documentation for our [polymer custom elements](https://www.polymer-project.org/1.0/docs/devguide/feature-overview) on the related github pages website.
