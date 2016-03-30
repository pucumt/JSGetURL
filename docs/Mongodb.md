Mongodb的开启

启动:
--dbpath
$ ./mongod --dbpath /mongodb/
把数据存储位置指向一个自己的目录/mongodb/

修改默认端口：

--port
$ ./mongdb --port 20111
把服务端口修改为20111，这个一方面是为了安全，使用默认端口容易被一些恶意的人发现做手脚

启动后台服务:

--fork
在后台开启Mongdb服务
在使用这个方式启动的时候要注意两点：
1、该功能只在1.1之后的版本才可以使用。
2、另外通过这个方式在后台启动，如果在启动的时候像--dbpath 那样使用 --logpath 输出日志时候日志输出目录也要自己创建。
如：
$ ./mongod --fork --logpath /var/log/mongodb.log --logappend
解析最后--logappend,以追加的方式创建日志防止把之前的日志删除了


Mongodb的关闭:

前台运行:

如果没有使用--fork，直接可以前台退出终端关闭。通过这种方式，Mongodb将会自己做清理退出，把没有写好的数据写完成，并最终关闭数据文件。要注意的是这个过程会持续到所有操作都完成。

后台运行:

如果使用--fork在后台运行mongdb服务，那么就要通过向服务器发送shutdownServer()消息来关闭。

1、普通命令：
$ ./mongod
> use admin
> db.shutdownServer()

要注意的是，这个命令只允许在本地，或是一个经过认证的客户端。

2、如果这是一个主从式的复制集群，在1.9.1版本后将按下面的步骤来关闭
检查从Mongodb的数据更新时间
如果所有的从Mongodb和主的时间差都超过10，这个时候不会关闭mongodb（在这种情况下面，我们可以通过配置timeoutSecs的方式来让从Mongodb完成数据的更新）
如果其中有一个从Mongodb与主服务时间差在10秒内，那么主服务器将会关闭，并且等待从Mongodb更新完成并关闭。
3、如果没有up-to-date 从Mongodb且你想强制关闭服务，可以通过添加force:true;命令如下：
> db.adminCommand({shutdown : 1, force : true})
> //or
> db.shutdownServer({force : true})

4、指定特定超时时间的关闭服务器，命令同上，另外加上一个timeoutsec:参数
> db.adminCommand(shutdown : 1, force : true, timeoutsec : 5)
> //or
> db.shutdownServer({force : true, timeoutsec : 5})

Mongodb开机启动

在/etc/rc.local文件末尾添加下面的代码
#add mongodb service
rm -rf /data/mongodb_data/* && /usr/local/mongodb/bin/mongod --dbpath=/data/mongdb_data/ --logpath=/data/mongdb_log/mongodb.log --logappend &



成功启动MongoDB后，再打开一个命令行窗口输入mongo，就可以进行数据库的一些操作。

输入help可以看到基本操作命令：

show dbs:显示数据库列表 
show collections：显示当前数据库中的集合（类似关系数据库中的表） 
show users：显示用户

use <db name>：切换当前数据库，这和MS-SQL里面的意思一样 
db.help()：显示数据库操作命令，里面有很多的命令 
db.foo.help()：显示集合操作命令，同样有很多的命令，foo指的是当前数据库下，一个叫foo的集合，并非真正意义上的命令 
db.foo.find()：对于当前数据库中的foo集合进行数据查找（由于没有条件，会列出所有数据） 
db.foo.find( { a : 1 } )：对于当前数据库中的foo集合进行查找，条件是数据中有一个属性叫a，且a的值为1

MongoDB没有创建数据库的命令，但有类似的命令。

如：如果你想创建一个“myTest”的数据库，先运行use myTest命令，之后就做一些操作（如：db.createCollection('user')）,这样就可以创建一个名叫“myTest”的数据库。

数据库常用命令

1、Help查看命令提示

 help

  db.help();

  db.yourColl.help();

  db.youColl.find().help();

  rs.help();

2、切换/创建数据库

 use yourDB;  当创建一个集合(table)的时候会自动创建当前数据库

3、查询所有数据库

 show dbs;

4、删除当前使用数据库

 db.dropDatabase();

5、从指定主机上克隆数据库

 db.cloneDatabase(“127.0.0.1”); 将指定机器上的数据库的数据克隆到当前数据库

6、从指定的机器上复制指定数据库数据到某个数据库

 db.copyDatabase("mydb", "temp", "127.0.0.1");将本机的mydb的数据复制到temp数据库中

7、修复当前数据库

 db.repairDatabase();

8、查看当前使用的数据库

 db.getName();

 db; db和getName方法是一样的效果，都可以查询当前使用的数据库

9、显示当前db状态

 db.stats();

10、当前db版本

 db.version();

11、查看当前db的链接机器地址

 db.getMongo();

Collection聚集集合

1、创建一个聚集集合（table）

 db.createCollection(“collName”, {size: 20, capped: 5, max: 100});

2、得到指定名称的聚集集合（table）

 db.getCollection("account");

3、得到当前db的所有聚集集合

 db.getCollectionNames();

4、显示当前db所有聚集索引的状态

 db.printCollectionStats();

 用户相关

1、添加一个用户

 db.addUser("name");

 db.addUser("userName", "pwd123", true); 添加用户、设置密码、是否只读

2、数据库认证、安全模式

 db.auth("userName", "123123");

3、显示当前所有用户

 show users;

4、删除用户

 db.removeUser("userName");

其他
1、查询之前的错误信息
 db.getPrevError();
2、清除错误记录
 db.resetError();
 
查看聚集集合基本信息
1、查看帮助  db.yourColl.help();
2、查询当前集合的数据条数  db.yourColl.count();
3、查看数据空间大小 db.userInfo.dataSize();
4、得到当前聚集集合所在的db db.userInfo.getDB();
5、得到当前聚集的状态 db.userInfo.stats();
6、得到聚集集合总大小 db.userInfo.totalSize();
7、聚集集合储存空间大小 db.userInfo.storageSize();
8、Shard版本信息  db.userInfo.getShardVersion()
9、聚集集合重命名 db.userInfo.renameCollection("users"); 将userInfo重命名为users
10、删除当前聚集集合 db.userInfo.drop();
聚集集合查询

1、查询所有记录
db.userInfo.find();
相当于：select* from userInfo;
默认每页显示20条记录，当显示不下的情况下，可以用it迭代命令查询下一页数据。注意：键入it命令不能带“；”
但是你可以设置每页显示数据的大小，用DBQuery.shellBatchSize= 50;这样每页就显示50条记录了。
 
2、查询去掉后的当前聚集集合中的某列的重复数据
db.userInfo.distinct("name");
会过滤掉name中的相同数据
相当于：select distict name from userInfo;
 
3、查询age = 22的记录
db.userInfo.find({"age": 22});
相当于： select * from userInfo where age = 22;
 
4、查询age > 22的记录
db.userInfo.find({age: {$gt: 22}});
相当于：select * from userInfo where age >22;
 
5、查询age < 22的记录
db.userInfo.find({age: {$lt: 22}});
相当于：select * from userInfo where age <22;
 
6、查询age >= 25的记录
db.userInfo.find({age: {$gte: 25}});
相当于：select * from userInfo where age >= 25;
 
7、查询age <= 25的记录
db.userInfo.find({age: {$lte: 25}});
 
8、查询age >= 23 并且 age <= 26
db.userInfo.find({age: {$gte: 23, $lte: 26}});
 
9、查询name中包含 mongo的数据
db.userInfo.find({name: /mongo/});
//相当于%%
select * from userInfo where name like ‘%mongo%’;
 
10、查询name中以mongo开头的
db.userInfo.find({name: /^mongo/});
select * from userInfo where name like ‘mongo%’;
 
11、查询指定列name、age数据
db.userInfo.find({}, {name: 1, age: 1});
相当于：select name, age from userInfo;
当然name也可以用true或false,当用ture的情况下河name:1效果一样，如果用false就是排除name，显示name以外的列信息。
 
12、查询指定列name、age数据, age > 25
db.userInfo.find({age: {$gt: 25}}, {name: 1, age: 1});
相当于：select name, age from userInfo where age >25;
 
13、按照年龄排序
升序：db.userInfo.find().sort({age: 1});
降序：db.userInfo.find().sort({age: -1});
 
14、查询name = zhangsan, age = 22的数据
db.userInfo.find({name: 'zhangsan', age: 22});
相当于：select * from userInfo where name = ‘zhangsan’ and age = ‘22’;
 
15、查询前5条数据
db.userInfo.find().limit(5);
相当于：selecttop 5 * from userInfo;
 
16、查询10条以后的数据
db.userInfo.find().skip(10);
相当于：select * from userInfo where id not in (
selecttop 10 * from userInfo
);
 
17、查询在5-10之间的数据
db.userInfo.find().limit(10).skip(5);
可用于分页，limit是pageSize，skip是第几页*pageSize
 
18、or与 查询
db.userInfo.find({$or: [{age: 22}, {age: 25}]});
相当于：select * from userInfo where age = 22 or age = 25;
 
19、查询第一条数据
db.userInfo.findOne();
相当于：selecttop 1 * from userInfo;
db.userInfo.find().limit(1);
 
20、查询某个结果集的记录条数
db.userInfo.find({age: {$gte: 25}}).count();
相当于：select count(*) from userInfo where age >= 20;
 
21、按照某列进行排序
db.userInfo.find({sex: {$exists: true}}).count();
相当于：select count(sex) from userInfo;
索引

1、创建索引
db.userInfo.ensureIndex({name: 1});
db.userInfo.ensureIndex({name: 1, ts: -1});
 
2、查询当前聚集集合所有索引
db.userInfo.getIndexes();
 
3、查看总索引记录大小
db.userInfo.totalIndexSize();
 
4、读取当前集合的所有index信息
db.users.reIndex();
 
5、删除指定索引
db.users.dropIndex("name_1");
 
6、删除所有索引索引
db.users.dropIndexes();
 修改、添加、删除集合数据

1、添加
db.users.save({name: ‘zhangsan’, age: 25, sex: true});
添加的数据的数据列，没有固定，根据添加的数据为准
 
2、修改
db.users.update({age: 25}, {$set: {name: 'changeName'}}, false, true);
相当于：update users set name = ‘changeName’ where age = 25;
 
db.users.update({name: 'Lisi'}, {$inc: {age: 50}}, false, true);
相当于：update users set age = age + 50 where name = ‘Lisi’;
 
db.users.update({name: 'Lisi'}, {$inc: {age: 50}, $set: {name: 'hoho'}}, false, true);
相当于：update users set age = age + 50, name = ‘hoho’ where name = ‘Lisi’;
 
3、删除
db.users.remove({age: 132});
 
4、查询修改删除
db.users.findAndModify({
    query: {age: {$gte: 25}}, 
    sort: {age: -1}, 
    update: {$set: {name: 'a2'}, $inc: {age: 2}},
    remove: true
});
 
db.runCommand({ findandmodify : "users", 
    query: {age: {$gte: 25}}, 
    sort: {age: -1}, 
    update: {$set: {name: 'a2'}, $inc: {age: 2}},
    remove: true
});

More>>http://www.cnblogs.com/xusir/archive/2012/12/24/2830957.html


一. 在Ubuntu下最傻瓜的步骤（以下都在root用户下进行操作）：

1.运行"apt-get install mongodb"



如果遇到找不到安装包的话运行"apt-get update"



2.这时装好以后应该会自动运行mongodb程序，通过"pgrep mongo -l "查看进程是否已经启动



3.在终端输入"mongo"，然后回车进入数据库



 （Over）

下面说下如何自己启动mongodb的程序。

二. 重启系统以后mongo程序要自己重新手动启动，步骤如下：

1.运行“locate mongo”命令查看系统默认把mongo装到了哪里，这里主要关注三个东西.

（1）一个是名为“mongod”的程序的位置(他相当于mongo数据库的Server，需要一直在后台运行，我的路径：/usr/bin/mongod);

（2）一个是mongo 数据库log日志文件的位置（log日志文件要查看到具体的文件名,具体用法在后面有介绍,我的路径：/var/log/mongodb/mongodb.log）;

（3）一个是mongo的log日志的位置（我的路径：/var/log/mongodb/mongodb.log）。





2.先进入mongod所在的目录（/usr/bin/mongod），然后运行“./mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongodb.log --logappend &”

--dbpath：指定mongo的数据库文件在哪个文件夹

--logpath：指定mongo的log日志是哪个，这里log一定要指定到具体的文件名

--logappend：表示log的写入是采用附加的方式，默认的是覆盖之前的文件

&：表示程序在后台运行



注意：如果是系统非正常关闭，这样启动会报错，由于mongodb自动被锁上了，这是需要进入mongodb数据库文件所在的目录（/var/lib/mongodb/）,删除目录中的mongodb.lock文件,然后再进行上述操作。



安装好以后就可以通过编写C++程序进行相应的数据库操作了，编写简单的连接mongo的C++程序以及如果解决mongo动态库链接失败的情况在另一篇文章中介绍。