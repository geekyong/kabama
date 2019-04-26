# KABAMA

这是一个非常无聊的弹幕游戏，链接请点击此处[https://github.com/zzh97228/kabama](https://github.com/zzh97228/kabama) ，整个游戏的目标就是打倒悬在空中的那只golang老鼠。整个游戏中这只地鼠具有两个阶段，地鼠的生命条每减10%就更换一个阶段，这两个阶段分别是正统的弹幕游戏和具有重力井干扰以及子弹自动寻路功能的阶段。整体上结合了简单的神经网络、简单的遗传算法和简单力学定律，通过代码来模拟自然界中的一些规律性事物。
![image](https://github.com/zzh97228/kabama/blob/master/src/assets/kb.png)
Kabama一词来源于某日吃到的[静安面包房](https://detail.youzan.com/show/goods?alias=1ygghv2ncj80l)中的一种叫kabama的曲奇饼干，着实十分好吃，实际与本交互游戏没有多大的关系。建议有兴趣的人可以一尝究竟。
![image](https://github.com/zzh97228/kabama/blob/master/src/assets/cookie.jpg)
## 目录

- [安装和初始化](#安装和初始化)
- [结构](#结构)
- [操作方法](#操作方法)
- [特点和创意点](#特点和创意点)
    1. [单层神经网络](#单层神经网络)
    2. [简单遗传算法](#简单遗传算法)
    3. [经典力学定律](#经典力学定律)
- [总结和截图](#总结和截图)
- [参考资料](#参考资料)

## 安装和初始化
```
npm install
```

#### 编译并在开发模式运行
```
npm run serve
```

#### 生产模式打包
```
npm run build
```
#### 运行koa服务端
```
npm run koa
```

#### 运行测试
```
npm run test
```

#### 打开浏览器输入如下地址试玩游戏
```markdown
http://localhost:8080
```

## 结构
本游戏使用了vue.js作为前端框架、vuetify样式框架和p5.js图形库相结合的方式，来为用户呈现最“优质”的游戏体验。同时使用koa.js作为简单的后端应用，将后台本地的脚本呈现在前端页面上作为参考。
![image](https://github.com/zzh97228/kabama/blob/master/src/assets/system.png)



## 操作方法
1. **WASD操控方向**
2. **"r"键重新开始游戏**
3. **当生命值低于20%时自动开启持续5秒的护盾防御一切物理碰撞**


## 特点和创意点

为了体现趣味性以及与普通弹幕游戏进行区分，本游戏通过提升对手的速度、伤害和智能等特性来给予游戏者最大的挫折感。
相比于一般的弹幕游戏中，通过增加弹幕进行攻击的样式来增加趣味，本游戏则着重于环境和子弹的智能性所带来的影响。
为了提升这种智能性，我引入了当下十分火爆的深度神经网络来训练子弹的加速度方向，使得子弹能学习到游戏者的位置并进行精确打击。
而在环境的影响层面，我引入了重力场的概念，使得游戏者往往会受到重力的影响，而无法如愿操控单位，同时我为重力井增加了一个简单的遗传算法，
当重力井失去作用力时，根据适应度函数计算适应值，并根据概率进行相应的变异操作，提升了整个游戏的随机性，并大大加大了难度。

由于前段时间沉迷于《只狼》游戏，并为游戏的高难度所折服，因此我也为用户设置了两次复活的机会，同时为了不至于游戏过难，在游戏者生命值低于20%时自动开启一个持续时间为3秒的屏障，来抵挡所有物理碰撞造成的伤害。


#### 单层神经网络

神经网络的概念来源于上世纪80年代，由于现代计算机算力的增加，以及传统人工智能算法渐渐淡出舞台，神经网络开始走向辉煌。

神经网络的基本目的就是经过每次训练修改训练权重和阈值，在完成训练后对学习事物进行测试。在本游戏中，我使用神经网络来训练子弹收到重力井产生的偏向力，通过不断矫正使得子弹能自动搜索到目标。

下面我使用图例来介绍我我构成的神经网络。

![image](https://github.com/zzh97228/kabama/blob/master/src/assets/nn.png)

#### 简单遗传算法

为了模仿自然规律中遗传和变异的特点，我为每一个重力井配置了一个DNA实例作为其特点，这个DNA实例决定了重力井的重力大小和存活时间，当重力井处于死亡状态时便会将自身的特点遗传至下一代，而下一代则根据概率决定是否变异。变异后的子代具有位置随机性、重力随机性和生命长度随机性。

![image](https://github.com/zzh97228/kabama/blob/master/src/assets/carbon.png)
#### 经典力学定律

在游戏阶段二时地图上会随机出现重力井对玩家进行力的束缚，使得玩家无法自如操控。而这种束缚形式来源于经典物理学中合力的概念，每一个重力井对玩家造成的力会随着距离的增大而衰减

除去重力井对玩家的影响，阶段二还有可以学习玩家轨迹的子弹，通过简单神经网络修改自身的偏转力，使得子弹的方向趋近玩家。不过为了使游戏不至于难度过高，我增大了其修正系数使得子弹无法准确到达玩家的位置，而在子弹群体现出了群聚性，非常奇特。


## 总结和截图

总之这是一个十分无聊的弹幕游戏，通过简单而又残酷的交互来体验双倍的快乐
![image](https://github.com/zzh97228/kabama/blob/master/capture/capture1.jpg)
![image](https://github.com/zzh97228/kabama/blob/master/capture/capture2.jpg)
![image](https://github.com/zzh97228/kabama/blob/master/capture/capture3.jpg)
![image](https://github.com/zzh97228/kabama/blob/master/capture/capture4.jpg)


## 参考资料
- [https://www.openprocessing.org/sketch/450082](https://www.openprocessing.org/sketch/450082)
- [https://www.openprocessing.org/sketch/605265](https://www.openprocessing.org/sketch/605265)
- [https://www.openprocessing.org/sketch/425051](https://www.openprocessing.org/sketch/425051)
