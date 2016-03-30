﻿正则表达式：

^ 匹配一个输入或一行的开头，/^a/匹配"an A"，而不匹配"An a" 

$ 匹配一个输入或一行的结尾，/a$/匹配"An a"，而不匹配"an A" 

* 匹配前面元字符0次或多次，/ba*/将匹配b,ba,baa,baaa 

+ 匹配前面元字符1次或多次，/ba*/将匹配ba,baa,baaa 

? 匹配前面元字符0次或1次，/ba*/将匹配b,ba 

(x) 匹配x保存x在名为$1...$9的变量中 

x|y 匹配x或y 

{n} 精确匹配n次 

{n,} 匹配n次以上 

{n,m} 匹配n-m次 

[xyz] 字符集(character set)，匹配这个集合中的任一一个字符(或元字符) 

[^xyz] 不匹配这个集合中的任何一个字符 

[\b] 匹配一个退格符 

\b 匹配一个单词的边界 

\B 匹配一个单词的非边界 

\cX 这儿，X是一个控制符，/\cM/匹配Ctrl-M 

\d 匹配一个字数字符，/\d/ = /[0-9]/ 

\D 匹配一个非字数字符，/\D/ = /[^0-9]/ 

\n 匹配一个换行符 

\r 匹配一个回车符 

\s 匹配一个空白字符，包括\n,\r,\f,\t,\v等 

\S 匹配一个非空白字符，等于/[^\n\f\r\t\v]/ 

\t 匹配一个制表符 

\v 匹配一个重直制表符 

\w 匹配一个可以组成单词的字符(alphanumeric，这是我的意译，含数字)，包括下划线，如[\w]匹配"$5.98"中的5，等于[a-zA-Z0-9] 

\W 匹配一个不可以组成单词的字符，如[\W]匹配"$5.98"中的$，等于[^a-zA-Z0-9]。

正则表达式的直接量字符

字符 匹配 
________________________________
字母数字字符 自身 

\ f 换页符 

\ n 换行符 

\ r 回车 

\ t 制表符 

\ v 垂直制表符 

\ / 一个 / 直接量 

\ \ 一个 \ 直接量 

\ . 一个 . 直接量 

\ * 一个 * 直接量 

\ + 一个 + 直接量 

\ ? 一个 ? 直接量 

\ | 一个 | 直接量 

\ ( 一个 ( 直接量 

\ ) 一个 ) 直接量 

\ [ 一个 [ 直接量 

\ ] 一个 ] 直接量 

\ { 一个 { 直接量 

\ } 一个 } 直接量 

\ XXX 由十进制数 XXX 指 定的ASCII码字符 

\ Xnn 由十六进制数 nn 指定的ASCII码字符 

\ cX 控制字符^X. 例如, \cI等价于 \t, \cJ等价于 \n

正则表灰式的字符类

字符 匹配 
____________________________________________________
[...] 位于括号之内的任意字符 

[^...] 不在括号之中的任意字符 

. 除了换行符之外的任意字符,等价于[^\n] 

\w 任何单字字符, 等价于[a-zA-Z0-9] 

\W 任何非单字字符,等价于[^a-zA-Z0-9] 

\s 任何空白符,等价于[\ t \ n \ r \ f \ v] 

\S 任何非空白符,等价于[^\ t \ n \ r \ f \ v] 

\d 任何数字,等价于[0-9] 

\D 除了数字之外的任何字符,等价于[^0-9] 

[\b] 一个退格直接量(特例) 

正则表达式的复制字符

字符 含义 
__________________________________________________________________
{n, m} 匹配前一项至少n次,但是不能超过m次 

{n, } 匹配前一项n次,或者多次 

{n} 匹配前一项恰好n次 

? 匹配前一项0次或1次,也就是说前一项是可选的. 等价于 {0, 1} 

+ 匹配前一项1次或多次,等价于{1,} 

* 匹配前一项0次或多次.等价于{0,} 

正则表达式的选择、分组和引用字符:

字符 含义 
____________________________________________________________________
| 选择.匹配的要么是该符号左边的子表达式,要么它右边的子表达式 

(...) 分组.将几个项目分为一个单元.这个单元可由 *、+、？和|等符号使用,而且还可以记住和这个组匹配的字符以供此后引
用使用 

\n 和第n个分组所匹配的字符相匹配.分组是括号中的子表达式(可能是嵌套的).分组号是从左到右计数的左括号数 

正则表达式的锚字符:

字符 含义 
____________________________________________________________________
^ 匹配的是字符的开头,在多行检索中,匹配的是一行的开头 

$ 匹配的是字符的结尾,在多行检索中,匹配的是一行的结尾 

\b 匹配的是一个词语的边界.简而言之就是位于字符\w 和 \w之间的位置(注意:[\b]匹配的是退格符) 

\B 匹配的是非词语的边界的字符 

正则表达式的属性:

字符 含义 
_________________________________________
i 执行大小写不敏感的匹配 

g 执行一个全局的匹配,简而言之,就是找到所有的匹配,而不是在找到第一个之后就停止了 

正则表达式对象的属性及方法

预定义的正则表达式拥有有以下静态属性：input, multiline, lastMatch, lastParen, leftContext, rightContext和$1到$9。其中input和multiline可以预设置。其他属性的值在执行过exec或test方法后被根据不同条件赋以不同的值。许多属性同时拥有长和短(perl风格)的两个名字，并且，这两个名字指向同一个值。(JavaScript模拟perl的正则表达式)

正则表达式对象的属性

属性 含义 

$1...$9 如果它(们)存在，是匹配到的子串 

$_ 参见input 

$* 参见multiline 

$& 参见lastMatch 

$+ 参见lastParen 

$` 参见leftContext 

$'' 参见rightContext 

constructor 创建一个对象的一个特殊的函数原型 

global 是否在整个串中匹配(bool型) 

ignoreCase 匹配时是否忽略大小写(bool型) 

input 被匹配的串 

lastIndex 最后一次匹配的索引 

lastParen 最后一个括号括起来的子串 

leftContext 最近一次匹配以左的子串 

multiline 是否进行多行匹配(bool型) 

prototype 允许附加属性给对象 

rightContext 最近一次匹配以右的子串 

source 正则表达式模式 

lastIndex 最后一次匹配的索引 
 
正则表达式对象的方法 

方法 含义 

compile 正则表达式比较 

exec 执行查找 

test 进行匹配 

toSource 返回特定对象的定义(literal representing)，其值可用来创建一个新的对象。重载Object.toSource方法得到的。 

toString 返回特定对象的串。重载Object.toString方法得到的。 

valueOf 返回特定对象的原始值。重载Object.valueOf方法得到 

more：http://www.jb51.net/article/43190.htm