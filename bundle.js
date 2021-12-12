'use strict';

var version = "1.0.0";

// src/foo.js
var foo = 'hello world!';

// src/main.js
function main () {
  console.log(foo);
  console.log('version=>', version);
}

module.exports = main;
