## 1. Vue工程化

> 📚 **本项目联动**：工程化配置可以直接对照下方源码阅读。

前面我们在介绍Vue的时候，我们讲到Vue是一款用于构建用户界面的渐进式JavaScript框架 。（官方：https://cn.vuejs.org/）

<img src="assets/image-20231215142214177.png" alt="image-20231215142214177" style="zoom:80%;" /> 

那在前面的课程中，我们已经学习了Vue的基本语法、表达式、指令，并基于Vue的核心包，完成了Vue的案例。 那今天呢，我们要来讲解的基于Vue进行整站开发。

---

<details>
<summary>🔍 <strong>本站源码对照：工程化配置文件一览</strong>（点击展开）</summary>

**📄 vite.config.ts** - Vite 构建配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],          // 使用 Vue 插件
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))  // 路径别名
    }
  },
  base: './',                // GitHub Pages 相对路径
  build: {
    outDir: 'dist',          // 输出目录
    assetsDir: 'assets',     // 静态资源目录
    emptyOutDir: true
  }
})
```

**📄 package.json** - 项目依赖与脚本

```json
{
  "name": "sakura-notes",
  "version": "1.2.1",
  "type": "module",
  "scripts": {
    "dev": "vite",                           // 开发服务器
    "build": "npm run gen-tree && ... && vite build",  // 构建流程
    "preview": "vite preview"                // 预览构建结果
  },
  "dependencies": {
    "vue": "^3.5.13",         // Vue 3 核心
    "pinia": "^3.0.0",        // 状态管理
    "marked": "^12.0.2",      // Markdown 解析
    "shiki": "^1.22.0"        // 代码高亮
  },
  "devDependencies": {
    "typescript": "^5.4.0",   // TypeScript
    "vite": "^4.4.5",         // Vite 构建工具
    "@vitejs/plugin-vue": "^4.2.3"
  }
}
```

**📄 tsconfig.json** - TypeScript 编译配置

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,                    // 严格模式
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }        // 路径映射
  },
  "include": ["**/*.ts", "**/*.vue"]   // 包含 Vue 文件
}
```

**📄 types.ts** - 全局类型定义

```typescript
export enum NodeType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export interface FileNode {
  name: string;
  path: string;           // 如 "notes/tech/vue.md"
  type: NodeType;
  children?: FileNode[];  // 子节点（目录）
  content?: string;       // 文件内容
  wordCount?: number;     // 字数统计
  lastModified?: string;  // 修改时间
}
```

</details>

---



### 1.1 介绍

在前面的课程中，我们学习了HTML、CSS、JS、Axios、Vue等技术，并基于完成了一些前端开发的案例 。我们目前的前端开发中，当我们需要使用一些资源时，例如：vue.js，和axios.js文件，都是直接再工程中导入的，如下图所示：

<img src="assets/image-20231215163852195.png" alt="image-20231215163852195" style="zoom:80%;" />  

但是上述开发模式存在如下问题：

- **不规范**：每次开发都是从零开始，比较麻烦
- **难复用**：多个页面中的组件共用性不好
- **难维护**：js、图片等资源没有规范化的存储目录，没有统一的标准，不方便维护

所以现在企业开发中更加讲究前端工程化方式的开发，主要包括如下4个特点

- 模块化：将js和css等，做成一个个可复用模块
- 组件化：我们将UI组件，css样式，js行为封装成一个个的组件，便于管理
- 规范化：我们提供一套标准的规范的目录接口和编码规范，所有开发人员遵循这套规范
- 自动化：项目的构建，测试，部署全部都是自动完成

所以对于前端工程化，说白了，就是在企业级的前端项目开发中，把前端开发所需要的工具、技术、流程、经验进行规范化和标准化。从而提升开发效率，降低开发难度等等。接下来我们就需要学习vue的官方提供的脚手架帮我们完成前端的工程化。





### 1.2 环境准备

- 介绍：create-vue是Vue官方提供的最新的脚手架工具，用于快速生成一个工程化的Vue项目。

- create-vue提供了如下功能：
  - 统一的目录结构
  - 本地调试
  - 热部署
  - 单元测试
  - 集成打包上线

- 依赖环境：NodeJS 

  ![image-20231016170430866](assets/image-20231016170430866.png)

  详细安装方式，请查看资料中的**NodeJS安装文档**

  

- npm：**N**ode **P**ackage **M**anager，是NodeJS的软件包管理器。

  ![image-20231016171048831](assets/image-20231016171048831.png)



### 1.3 Vue项目-创建

- 创建一个工程化的Vue项目，执行命令：`npm init vue@3.3.4`

  ![image-20231215194113846](assets/image-20231215194113846.png)  

  详细步骤说明：

  > Project name：------------------》项目名称，默认值：vue-project，可输入想要的项目名称。
  >
  > Add TypeScript? ----------------》是否加入TypeScript组件？默认值：No。
  >
  > Add JSX Support? ---------------》是否加入JSX支持？默认值：No。
  >
  > Add Vue Router ...--------------》是否为单页应用程序开发添加Vue Router路由管理组件？默认值：No。
  >
  > Add Pinia ...-------------------》是否添加Pinia组件来进行状态管理？默认值：No。
  >
  > Add Vitest ...------------------》是否添加Vitest来进行单元测试？默认值：No。
  >
  > Add an End-to-End ...-----------》是否添加端到端测试？默认值No。
  >
  > Add ESLint for code quality? ---》是否添加ESLint来进行代码质量检查？默认值：No。

  

  提示：执行上述指令，将会安装并执行 create-vue，它是 Vue 官方的项目脚手架工具

  

  项目创建完成以后，进入vue-project1项目目录，执行命令安装当前项目的依赖：`npm install`

  ![image-20231215194138179](assets/image-20231215194138179.png) 

  > **创建项目以及安装依赖的过程，都是需要联网的。【如果网络不太好，可能会造成依赖下载不完整报错，继续再次执行 命令安装。】** 

  

- Vue项目-目录结构

  <img src="assets/image-20231016171341396.png" alt="image-20231016171341396" style="zoom: 50%;" /> 

  

- 启动项目，执行命令：`npm run dev`

  <img src="assets/image-20231016171434286.png" alt="image-20231016171434286" style="zoom:80%;" /> 

  

- 浏览器中可以直接访问，地址：http://127.0.0.1:5173 

  <img src="assets/image-20231016171545313.png" alt="image-20231016171545313" style="zoom:67%;" /> 





### 1.4 Vue项目开发流程

如下图：

<img src="assets/image-20231016171734451.png" alt="image-20231016171734451" style="zoom:67%;" /> 

其中`*.vue`是Vue项目中的组件文件，在Vue项目中也称为单文件组件（[SFC](https://cn.vuejs.org/guide/scaling-up/sfc.html)，Single-File Components）。Vue 的单文件组件会将一个组件的逻辑 (JS)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里（`*.vue`） 

<img src="assets/image-20231215171210123.png" alt="image-20231215171210123" style="zoom:80%;" /> 





### 1.5 API风格

- Vue的组件有两种不同的风格：**组合式API** 和 **选项式API**

- 组合式API

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue';
  const count = ref(0); //声明响应式变量
  
  function increment(){ //声明函数
     count.value++;
  }
  
  onMounted(() => { //声明钩子函数
    console.log('Vue Mounted....'); 
  })
  </script>
  
  <template>
     <input type="button" @click="increment" value="Api Demo1 Count : ">{{ count }}
  </template>
  
  <style scoped>
     
  </style>
  ```

  - setup：是一个标识，告诉Vue需要进行一些处理，让我们可以更简洁的使用组合式API。
  - ref()：接收一个内部值，返回一个响应式的ref对象，此对象只有一个指向内部值的属性 value。
  - onMounted()：在组合式API中的钩子方法，注册一个回调函数，在组件挂载完成后执行。

     

- 选项式API

  ```vue
  <script>
  export default{
     data() {
        return {
           count: 0
        }
     },
     methods: {
        increment: function(){
           this.count++
        }
     },
     mounted() {
        console.log('vue mounted.....');
     }
  }
  </script>
  
  <template>
    <input type="button" @click="increment" value="Api Demo1 Count : "> {{ count }}
  </template>
  
  <style scoped>
  
  </style>
  
  ```

​		 

选项式API，可以用包含多个选项的对象来描述组件的逻辑，如：data，methods，mounted等。选项定义的属性都会暴露在函数内部的this上，它会指向当前的组件实例。

> 在Vue中的组合式API使用时，是没有this对象的，this对象是undefined。 





### 1.6 案例

在Vue项目中，基于组合式API完成用户列表数据渲染。 要求：在页面加载完毕之后，发送异步请求，加载数据，渲染表格。

最终实现效果：

<img src="assets/image-20231215182532452.png" alt="image-20231215182532452" style="zoom:67%;" /> 



代码实现如下：

在 src 下定义 views 目录，在 views 目录中定义文件 `UserList.vue`，  然后，我们就可以将之前实现的Vue案例中的代码，基于Vue工程化的形式来实现一遍。 

1). 把原来定义的CSS样式代码，拷贝到 `<style></style>` 标签中。

2). 把页面的`<div id="app"></div>` 中的页面展示的html标签代码，拷贝到 `<template></template>` 标签中。

3). 将页面的JS代码，按照组合式API的形式，在 `<script></script>` 中定义出来。



具体代码如下：

```html
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const name = ref('')
const gender = ref('')
const job = ref('')
const userList = ref([])

function search(){
  //基于axios发送异步请求加载数据
  axios.get(`http://47.98.197.202/api/emps/list?name=${name.value}&gender=${gender.value}&job=${job.value}`).then((result) => {
    console.log(result);
    userList.value = result.data.data;
  }).catch((err) => {
    console.log(err);
  });
}

onMounted(() => {
  search()
})
</script>

<template>
  <div id="center">
      姓名: <input type="text" name="name" v-model="name">

      性别:
      <select name="gender" v-model="gender">
        <option value="1">男</option>
        <option value="2">女</option>
      </select>

      职位:
      <select name="job" v-model="job">
        <option value="1">讲师</option>
        <option value="2">班主任</option>
        <option value="3">其他</option>
      </select>

      <input class="btn" type="button" value="查询" @click="search">
  </div>
    
  <table>
    <tr>
      <th>序号</th>
      <th>姓名</th>
      <th>头像</th>
      <th>性别</th>
      <th>职位</th>
      <th>入职时间</th>
      <th>更新时间</th>
    </tr>

    <!-- v-for 用于列表循环渲染元素 -->
    <tr v-for="(user, index) in userList" :key="user.id">
      <td>{{index + 1}}</td>
      <td>{{user.name}}</td>
      <td> <img :src="user.image"> </td>
      <td>
        <span v-if="user.gender == 1">男</span>
        <span v-else-if="user.gender == 2">女</span>
        <span v-else>其他</span>
      </td>
      <td>
        <span v-show="user.job == 1">班主任</span>
        <span v-show="user.job == 2">讲师</span>
        <span v-show="user.job != 1 && user.job != 2">其他</span>
      </td>
      <td>{{user.entrydate}}</td>
      <td>{{user.updatetime}}</td>
    </tr>
  </table>
</template>

<style>
  table,th,td {
      border: 1px solid #000;
      border-collapse: collapse;
      line-height: 50px;
      text-align: center;
    }

    #center,table {
      width: 60%;
      margin: auto;
    }

    #center {
      margin-bottom: 20px;
    }

    img {
      width: 50px;
    }

    input,select {
      width: 17%;
      padding: 10px;
      margin-right: 30px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .btn {
      background-color: #ccc;
    }
</style>
```



然后在 `App.vue` 中，将 `UserList.vue` 引入进来。

```html
<script setup>
import UserList from './views/user/UserList.vue'
</script>

<template>
   <UserList></UserList>
</template>

<style scoped>

</style>
```



最终展示形式如下：

![image-20231215202759426](assets/image-20231215202759426.png) 





## 2. TS

### 2.1 概述

- TypeScript（简称 TS）是JavaScript的超集（继承了JS全部语法），TypeScript = Type + JavaScript。

  <img src="assets/image-20231016182655912.png" alt="image-20231016182655912" style="zoom:80%;" /> 

- 简单说，就是在JS的基础上，为JS添加了类型支持。

- TypeScript是微软开发的开源编程语言，可以在任何运行JavaScript的地方运行。

  <img src="assets/image-20231215203524846.png" alt="image-20231215203524846" style="zoom: 80%;" /> 

  <img src="assets/image-20231215203546276.png" alt="image-20231215203546276" style="zoom:80%;" /> 

  
  
  **类型注解**：是指在变量、函数等定义的时候，使用特定语法（: type）来指定其类型，并在代码中限制只能接收特定类型的值。

---

<details>
<summary>🔍 <strong>本站源码对照：TypeScript 实战应用</strong>（点击展开）</summary>

**📄 types.ts** - 全局类型定义（枚举 + 接口）

```typescript
// 枚举类型：限定节点类型只能是 file 或 directory
export enum NodeType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

// 接口类型：定义文件节点的数据结构
export interface FileNode {
  name: string;
  path: string;           // 类型注解：字符串
  type: NodeType;         // 类型注解：枚举
  children?: FileNode[];  // 可选属性 + 递归类型
  content?: string;
  wordCount?: number;     // 类型注解：数字
  lastModified?: string;
}
```

**📄 stores/appStore.ts** - Pinia Store 类型定义

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 泛型类型注解：ref<'en' | 'zh'> 限定只能是这两个值
  const lang = ref<'en' | 'zh'>('zh')
  
  // 字面量类型：限定 fontSize 只能是这三个值之一
  const userSettings = ref({
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    fontFamily: 'sans' as 'sans' | 'serif',
  })
  
  // 函数参数类型注解
  function showToast(msg: string, duration = 2000) {
    // ...
  }
  
  // 泛型函数：K 必须是 userSettings 的键
  function updateSettings<K extends keyof typeof userSettings.value>(
    key: K, 
    value: typeof userSettings.value[K]
  ) {
    userSettings.value[key] = value
  }
})
```

**📄 composables/useFile.ts** - 组合式函数类型

```typescript
import { ref, computed, type Ref } from 'vue'
import type { FileNode } from '../types'

// 函数参数使用 Ref 泛型类型
export function useFile(
  fileSystem: Ref<FileNode[]>,   // Ref<T> 泛型
  lang: Ref<'en' | 'zh'>         // 联合类型
) {
  // 泛型 ref：初始值为 null 或 FileNode
  const currentFile = ref<FileNode | null>(null)
  
  // 函数返回类型注解
  const findNodeByPath = (
    nodes: FileNode[], 
    path: string
  ): FileNode | null => {
    // ...
  }
  
  // 异步函数返回 Promise<string>
  const fetchFileContent = async (file: FileNode): Promise<string> => {
    // ...
  }
}
```

</details>

---

**为什么要用TypeScript ?**

- 动态类型语言
  - 编写bug多，影响开发效率
  - 运行时才会发现问题
  - 开发工具代码提示功能弱
  - 不便项目维护

- 静态类型语言

  - 有利于发现错误（编写时）

  - 有利于代码的静态分析

  - 便于语法提示和自动补全

  - 利于项目维护



### 2.2 快速入门

- 准备：
  
  - 以管理员身份运行CMD，安装TS官方提供的编译器：npm install -g typescript (只需要做一次即可)
  
- 编码：
  - 定义ts文件，定义变量，指定类型注解

  - 编译ts文件，测试程序运行

    <img src="assets/image-20231215203650050.png" alt="image-20231215203650050" style="zoom:80%;" />  

    编译命令：`tsc demo.ts`

    ![image-20231016182901520](assets/image-20231016182901520.png) 

    编译之后的文件为：**demo.js**

  > 注意：TS代码编译目标版本为es3(比较低)，可以通过参数 `–target` 指定编译的目标版本。如：es5、es6、es2016... esnext

​	

### 2.3 常用类型

TS中除了支持JS中的数据类型之外，还提供了新的实用的数据类型。 常见类型如下:

| **类型**           | **例子**                      | **备注**                             |
| ------------------ | ----------------------------- | ------------------------------------ |
| 字符串类型         | string                        |                                      |
| 数字类型           | number                        | 整数 、小数                          |
| 布尔类型           | boolean                       | true、false                          |
| null/undefined类型 | null / undefined              | 表示null和undefined本身，意义不大    |
| 任意类型           | any                           | 没有指定任何类型                     |
| 数组类型           | number[] / Array`<number>`    |                                      |
| 联合类型           | number \| string              | 一个值可以是几种类型之一             |
| 字面量类型         | 'left' \| 'center' \| 'right' | 限制变量或参数的取值，只能是其中之一 |
| 函数类型           | () => void                    | 对函数的参数及返回值指定类型         |
| 对象类型           | {...}                         | 限定对象的结构（属性及方法）         |
| 复杂类型           | interface接口                 |                                      |
| 泛型               | `<T>  `                       |                                      |





#### 2.3.1 基础类型

基础类型：string，number，boolean，null，undefined，any，数组。

<img src="assets/image-20231215205621562.png" alt="image-20231215205621562" style="zoom:80%;" /> 

原则上，不推荐使用any!!! 这会让TypeScript又回到JavaScript(失去TS类型保护的优势)。





#### 2.3.2 联合类型

联合类型：是指由两个或多个其他类型组成的类型，表示可以是其中的任意一种。

写法：类型1 | 类型2

<img src="assets/image-20231215205653270.png" alt="image-20231215205653270" style="zoom:80%;" /> 

TS中的联合类型中指定的多种类型之间使用 | 分隔，建议使用()括起来。



- 类型别名：相当于一种自定义类型，为任意类型起别名。

- 使用场景：当同一类型（复杂）别多次使用时，可以通过类型别名，简化该类型（复杂）的书写。

- 定义语法：type customType = 指定类型

  <img src="assets/image-20231215205713300.png" alt="image-20231215205713300" style="zoom:80%;" /> 

  类型别名type，是可以为任意类型指定别名的。



#### 2.3.3 函数类型

- 函数类型实际上指的是：函数的参数及返回值的类型

- 语法一：单独指定参数、返回值类型

  ![image-20231016183424890](assets/image-20231016183424890.png)

  与JS不同，TS中函数调用时传入的参数个数必须与函数定义时参数个数一致。

- 语法二：书写完成函数类型（同时指定参数、返回值类型）

  ![image-20231016183457515](assets/image-20231016183457515.png) 

- 可选参数：在TS里我们可以在参数后使用？实现可选参数的功能。而且可选参数只能出现在参数列表的最后。

  ![image-20231016183514149](assets/image-20231016183514149.png) 

  如果函数没有返回值，则函数的返回值类型为：void

​		 

​		

#### 2.3.4 对象类型 & 接口interface

**对象类型**

TS中的对象类型就是来描述对应的结构的（有什么类型的属性和方法）

![image-20231016183611453](assets/image-20231016183611453.png)

- 说明：
  - 直接使用{}来描述对象的结构。属性采用 属性名:类型 的形式；方法采用 方法名():返回值类型 的形式。
  - 如果方法有参数，就在方法名后面的小括号中指定参数类型（如：say(content:string):void）。
  - 在一行中指定多个属性类型时，可以使用 逗号/分号 来分割。
  - 方法的类型，也可以使用箭头函数形式，比如：say:() => void。
  - 对象的属性或方法，也可以是可选的，此时就可以声明可选属性/方法，使用 ？（问号）来表示。



**接口interface**

当一个对象类型被多次使用时，我们可以使用 接口（interface）来描述对象的类型，达到 复用 的目的。

![image-20231016183721661](assets/image-20231016183721661.png)

- 说明：
  - 接口使用 `interface` 关键字来声明，接口名称可以是任意合法的变量名称。
  - 接口中定义的属性或方法，结尾可以使用逗号(,)/分号(;)分隔；如果每一行只有一个属性，后面也可以不写分号（;）。



**Interface（接口） 与 type（类型别名）对比**

- 相同点：都可以给对象指定类型。

- 不同点：
  - interface（接口），只能为对象指定类型。

  - type（类型别名），可以为任意类型指定别名。

    ![image-20231016183908918](assets/image-20231016183908918.png)







#### 2.3.5 类型推论

- 在TS中，在有些没有明确指出类型的地方，类型推论会帮助提供类型。

- 换句话说：由于类型推论的存在，某些地方，类型注解是可以省略不写的。

- 常见场景：

1. 声明变量并初始化

2. 决定函数返回值时 

​	<img src="assets/image-20231215210044764.png" alt="image-20231215210044764" style="zoom:80%;" /> 

>   提示：如果不知道类型，可以通过鼠标，放在变量名称 或 方法名称上，利用VSCode的提示来查询类型。





## 3. ElementPlus

### 3.1 介绍

Element：是饿了么公司前端开发团队提供的一套基于 Vue3 的网站组件库，用于快速构建网页。

Element 提供了很多组件（组成网页的部件）供我们使用。例如 超链接、按钮、图片、表格等等。

官方网站：https://element-plus.org/zh-CN/#/zh-CN



如下图所示就是我们开发的页面和ElementUI提供的效果对比：可以发现ElementUI提供的各式各样好看的按钮

<img src="assets/image-20231215210448428.png" alt="image-20231215210448428" style="zoom: 67%;" />  

ElementPlus的学习方式和我们之前的学习方式不太一样，对于ElementPlus，我们作为一个后台开发者，只需要**学会如何从 ElementPlus 的官网拷贝组件到我们自己的页面中，并且做一些修改即可**。 我们主要学习的是ElementPlus中提供的常用组件，至于其他组件同学们可以通过我们这几个组件的学习掌握到ElementPlus的学习技巧，然后课后自行学习。





### 3.2 快速入门

**准备工作：**

1). 将资料中提供的基础工程（`资料/04. ElementPlus基础工程/vue-project02.zip`），解压到工作目录中，使用VSCode将其打开。

![image-20231215212817741](assets/image-20231215212817741.png) 



2). 参照官方文档，安装ElementPlus的组件库（在当前工程的目录下），执行如下命令：【这一步可以不做，已经安装好了】

```shell
npm install element-plus --save
```

![image-20231215212953435](assets/image-20231215212953435.png) 



3). 在`main.ts` 中引入ElementPlus组件库 （参照官方文档），最终 `main.ts` 中代码如下：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```



**制作组件：**

1）. 访问ElementPlus的官方文档，查看对应的组件源代码。

![image-20231215213643236](assets/image-20231215213643236.png) 



2). 在 `views` 目录下，创建`Element.vue`组件文件，复制组件代码，调整成自己想要的 。

```html
<script setup lang="ts">

</script>

<template>
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
</template>

<style scoped>

</style>

```



3). 启动项目，访问 http://localhost:5173

![image-20231215214543859](assets/image-20231215214543859.png) 







### 3.3 常见组件

#### 3.3.1 表格组件

用于展示多条结构类似的数据， 可对数据进行排序、筛选、对比或其他自定义操作。

<img src="assets/image-20231215214723765.png" alt="image-20231215214723765" style="zoom:80%;" /> 



接下来我们通过代码来演示。

首先我们需要来到 ElementPlus 的组件库中，找到表格组件，如下图所示：

![image-20231215214850778](assets/image-20231215214850778.png) 



然后新建一个组件 `Element.vue`，组件中，需要注意的是，我们组件包括了3个部分，如果官方有除了template部分之外的style和script都需要复制。具体操作如下图所示：

![image-20231215220453492](assets/image-20231215220453492.png) 



整体代码如下所示：

```html
<script setup lang="ts">
const tableData = [
  {date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'}
]
</script>

<template>
  <!-- Button按钮 -->
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
  <br>

  <!-- Table表格 -->
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<style scoped>
</style>

```



此时回到浏览器，我们页面呈现如下效果：

![image-20231215220919300](assets/image-20231215220919300.png) 



Table表格组件，属性说明：

- data: 主要定义table组件的数据模型
- prop: 定义列的数据应该绑定data中定义的具体的数据模型
- label: 定义列的标题
- width: 定义列的宽度





#### 3.3.2 分页条组件

Pagination: 分页组件，主要提供分页工具条相关功能。其展示效果图下图所示：

<img src="assets/image-20231215221045707.png" alt="image-20231215221045707" style="zoom:80%;" /> 



默认情况下，ElementPlus的组件是英文的，如果希望使用中文语言，可以在 `main.ts` 中做如下配置：

```ts
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {locale: zhCn})
```

然后还需要在 `env.d.ts` 中增加如下配置项：

```js
declare module 'element-plus/dist/locale/zh-cn.mjs'
```



接下来我们通过代码来演示功能。

首先在官网找到分页组件，我们选择带背景色分页组件，如下图所示：

![image-20231215221543413](assets/image-20231215221543413.png) 



然后复制代码到我们的 `Element.vue` 组件文件的template中，在 `<template> </template>` 拷贝如下代码：

```html
  <el-pagination
    v-model:current-page="currentPage4"
    v-model:page-size="pageSize4"
    :page-sizes="[100, 200, 300, 400]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
```



在 `<script> </script>` 中拷贝如下代码：

```ts
import { ref } from 'vue'

const currentPage4 = ref(4)
const pageSize4 = ref(100)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
```



目前，整个 `Element.vue`  的文件内容如下：

```html
<script setup lang="ts">
import { ref } from 'vue'

const currentPage4 = ref(4)
const pageSize4 = ref(100)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const tableData = [
  {date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'}
]


</script>

<template>
  <!-- Button按钮 -->
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
  <br>

  <!-- Table表格 -->
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <br>

  <!-- Pagination分页条 -->
  <el-pagination
    v-model:current-page="currentPage4"
    v-model:page-size="pageSize4"
    :page-sizes="[100, 200, 300, 400]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style scoped>
</style>
```



打开浏览器，查看页面效果如下：

![image-20231215222303611](assets/image-20231215222303611.png) 



Pagination 分页组件的属性如下：

对于分页组件我们需要关注的是如下几个重要属性（可以通过查阅官网组件中最下面的组件属性详细说明得到）：

- background: 添加北京颜色，也就是上图蓝色背景色效果。
- layout: 分页工具条的布局，其具体值包含`sizes`, `prev`, `pager`, `next`, `jumper`,  `total` 这些值
- total: 数据的总数量

<img src="assets/image-20231215222448236.png" alt="image-20231215222448236" style="zoom:67%;" /> 



对于分页组件，除了上述几个属性，还有2个非常重要的事件我们需要去学习：

- size-change ： pageSize 改变时会触发 
- current-change ：currentPage 改变时会触发 





#### 3.3.3 对话框组件

在保留当前页面状态的情况下，告知用户并承载相关操作。

<img src="assets/image-20231215222614389.png" alt="image-20231215222614389" style="zoom:80%;" /> 



首先我们需要在ElementPlus官方找到Dialog组件，如下图所示：

<img src="assets/image-20231215222711425.png" alt="image-20231215222711425" style="zoom:80%;" /> 



然后复制如下代码到我们的组件文件 `Element.vue` 的 `<template></template>` 模块中：

```html
  <el-button @click="dialogTableVisible = true">
    打开对话框
  </el-button>

  <el-dialog v-model="dialogTableVisible" title="Shipping address">
    <el-table :data="tableData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-dialog>
```



然后复制如下代码到我们的组件文件 `Element.vue` 的 `<script></script>` 模块中：

```
const dialogTableVisible = ref(false)
```



最终，完成的 `Element.vue` 的代码如下：

```html
<script setup lang="ts">
import { ref } from 'vue'

const currentPage4 = ref(4)
const pageSize4 = ref(100)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const tableData = [
  {date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'},
  {date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles'}
]

const dialogTableVisible = ref(false)

</script>

<template>
  <!-- Button按钮 -->
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
  <br>

  <!-- Table表格 -->
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <br>

  <!-- Pagination分页条 -->
  <el-pagination
    v-model:current-page="currentPage4"
    v-model:page-size="pageSize4"
    :page-sizes="[100, 200, 300, 400]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <br>

  <el-button @click="dialogTableVisible = true">
    打开对话框
  </el-button>

  <el-dialog v-model="dialogTableVisible" title="Shipping address">
    <el-table :data="tableData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-dialog>

</template>

<style scoped>
</style>
```



打开浏览器，最终的页面效果如下：

![image-20231215223307178](assets/image-20231215223307178.png) 



> Dialog对话框组件使用的关键点，就是控制其显示与隐藏。 通过 v-model 给定的boolean值，来控制Dialog的显示与隐藏。



#### 3.3.4 表单组件

Form 表单：由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。 

表单在我们前端的开发中使用的还是比较多的，接下来我们学习这个组件，与之前的流程一样，我们首先需要在ElementPlus的官方找到对应的组件示例：如下图所示：

![image-20231215223550057](assets/image-20231215223550057.png) 



然后复制如下代码到我们的组件文件 `Element.vue` 的 `<template></template>` 模块中：

```html
  <!-- Form 表单 -->
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.user" placeholder="Approved by" clearable />
    </el-form-item>

    <el-form-item label="Activity zone">
      <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>

    <el-form-item label="Activity time">
      <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable/>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Query</el-button>
    </el-form-item>
  </el-form>
```



然后复制如下代码到我们的组件文件 `Element.vue` 的 `<script></script>` 模块中：

```js
const formInline = ref({
  user: '',
  region: '',
  date: '',
})

const onSubmit = () => {
  console.log('submit!')
}
```



打开浏览器，查看页面效果：

![image-20231215224735144](assets/image-20231215224735144.png) 





### 3.4 案例

需求：基于ElementPlus组件库制作如下页面，并异步获取数据，完成页面展示。

<img src="assets/image-20231215224828379.png" alt="image-20231215224828379" style="zoom:80%;" /> 



**1). 准备工作**

由于在案例中，我们需要在vue项目中使用Axios，需要安装axios，需要在当前项目的目录下执行如下命令：

```
npm install axios
```

![image-20231215225358020](assets/image-20231215225358020.png) 



**2). 编码实现**

在views目录下，再定义一个文件 `EmpList.vue`，具体代码实现如下：

```html
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const searchEmp = ref({
  name: '',
  gender: '',
  job: '',
})

onMounted(() => {
  search();
})

const search = async () => {
  const url = `https://web-server.itheima.net/emps/list?name=${searchEmp.value.name}&gender=${searchEmp.value.gender}&job=${searchEmp.value.job}`
  const result = await axios.get(url)
  tableData.value = result.data.data
}

const clear = () => {
  searchEmp.value = { name: '', gender: '', job: '' }
  search();
}

let tableData = ref([])
</script>

<template>
  <div id="center">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="searchEmp.job" placeholder="请选择" clearable>
          <el-option label="班主任" value="1" />
          <el-option label="讲师" value="2" />
          <el-option label="咨询师" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
    <br>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; ">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="name" label="姓名" width="100" align="center" />
      <el-table-column label="头像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" width="50">
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="120" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="职位" width="180" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entrydate" label="入职日期" width="180" align="center" />
      <el-table-column prop="updatetime" label="更新时间" align="center" />
    </el-table>
  </div>
</template>

<style scoped>
#center {
  width: 70%;
  margin: auto;
  margin-top: 100px;
}
</style>
```



3). 在 `App.vue` 中引入 `EmpList.vue` 文件

```html
<script setup lang="ts">
  import EmpList from './views/EmpList.vue'
</script>

<template>
  <EmpList></EmpList>
</template>

<style scoped>

</style>

```



4). 打开浏览器，查看页面效果

![image-20231215225555724](assets/image-20231215225555724.png) 







