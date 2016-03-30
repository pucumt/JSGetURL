# WPWebSite
--2015-12-28
Learn nodejs with a website

Demos from https://github.com/nswbmw/N-blog/wiki/%E7%AC%AC1%E7%AB%A0--%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E5%8D%9A%E5%AE%A2

#Mongos iisue:

1. Failed to load c++ bson extension, using pure JS version

A: npm install bson

When you installed the mongoose module by npm, it hasn’t build bson module within it’s forlder. see the file ‘node_modules/mongoose/node_modules/mongodb/node_modules/bson/ext/index.js’

bson = require(’…/build/Release/bson’);

So just change it to bson = require(‘bson’);

and install bson module by npm.

2. req.body is undefined

A: remember the sequence of use, the route should be after bodyparse

3. flash 是做什么的

A: flash 是一次性的内存，阅后即焚。




#Need to do:
1. when code change, need manual restart "npm start"

2. about generator: http://www.cnblogs.com/fsjohnhuang/p/4166267.html





