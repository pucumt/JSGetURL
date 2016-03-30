（一） 编译好的文件
　　简单说就是解压后，在bin文件夹中已经存在node以及npm，如果你进入到对应文件的中执行命令行一点问题都没有，不过不是全局的，所以将这个设置为全局就好了。
　　cd node-v0.10.28-linux-x64/bin
　　ls
　　./node -v
　　这就妥妥的了，node文件夹具体放在哪，叫什么名字随你怎么定。然后设置全局：
　　ln -s /home/kun/mysofltware/node-v0.10.28-linux-x64/bin/node /usr/local/bin/node
　　ln -s /home/kun/mysofltware/node-v0.10.28-linux-x64/bin/npm /usr/local/bin/npm
　　这里/home/kun/mysofltware/这个路径是你自己放的，你将node文件解压到哪里就是哪里。
　　（二）通过源码编译
　　这种方式你下载的文件是Source code，较为麻烦。
　　# tar xvf node-v0.10.28.tar.gz
　　# cd node-v0.10.28
　　# 。/configure
　　# make
　　# make install
　　# cp /usr/local/bin/node /usr/sbin/
　　查看当前安装的Node的版本
　　# node -v
　　v0.10.28
　　（三）apt-get
　　还有一种就是shell提示的apt-get方式，强烈不推荐。
　　sudo apt-get install nodejs
　　sudo apt-get install npm
　　上面就是Linux安装Nodejs的方法介绍了，三种方法都能够安装Nodejs，使用源码安装是最简单的方法，而后面两种较为麻烦，不是很推荐。

ln -s /root/node-v5.5.0-linux-x64/bin/node /usr/local/bin/node

ln -s /root/node-v5.5.0-linux-x64/bin/npm /usr/local/bin/npm


website: /root/WPWebSite


pm2 比 forever更好用

