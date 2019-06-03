-   @note cmd_flow

    -   用 task api, 去做某些任务
        -   task api 能进入 xshell 吗
    -   或者用 node 脚本执行命令
    -   自定义一些命令 open file folder ...
        -   用 node 脚本
    -   像 task 一样直接编辑怎么处理

-   https://github.com/microsoft/vscode-extension-samples/tree/12a3528bae5fd7f97c9966fba2daede8b8adde31/tree-view-sample

*   [cmdFlow]

    -   有些结尾没有空格的如何处理
    -   打开检测是不是 busy 如果是 就重新打开 不然就...
    -   hide 的命令直接关闭 terminal...
    -   activeTerminal 关闭...
    -   在侧边栏显示...
    -   cmdFlow 无法知道一个任务是成功还是失败...

## 2019-01-02 18:40:38

-   @ques 能不能监听 onData 中数据的变化来判断任务是否终止??
-   @ques 能不能自己创建一个 terminalRender

## 2018-12-29 16:07:11

-   https://code.visualstudio.com/api/references/vscode-api#tasks

-   CmdManager init status
    -   no_init in_init inited

## 2018-12-29 11:51:03

-   log 清理

-   @ques 同时运行两条命令是什么样子的

-   @todo dop 更新 dop

-   struct unknown word

-   @ques dop 太不方便了 怎么处理

    -   怎么方便的调用...
    -   创建 绑定 调用
    -   设置属性...behave setModel(map, val)

-   @note 语言

    -   遇到什么做什么
    -   info => {a, b} 用这种方式定义变量 a, b

-   dop

    -   all -> file -> symbol -> cmd

-   @note 我这动不动就重写实在实在是太累了

    -   如果能变成一步一步的经行就好多了

-   @note 循序渐进 慢慢而来

    -   model.d.ts 整理结构
    -   在实现时一个个的移出去
    -   一目了然的看清自己的结构...

-   @ques 在 update 的时候如何看有文件更新了...
    -   查看文件是否更新?? 是不是太麻烦了

*   function program 实在是太细碎了

-   @ques 如何添加测试代码

## 2018-12-28 17:31:41

-   同时执行多个命令, 依赖一个命令 隐藏命令

    -   我怎么确认 before 中对应的, 名称??

        -   extern Global
        -   Global::?? 这种形式
        -   group
        -   public...
            -   这一切有没有意义 我一个 bash 脚本解决所有问题不是更好吗
            -   我同时操作者一大堆的 terminal, 能不能很方便的执行代码呢
        -   列表中需要排除相同的文件

    -   我又怎么能确认能执行完成

-   @ques 能不能加载其他 markdown 文件...
    -   import markdown
    -   如果是这样为什么不使用 yaml

## 2018-11-30 18:48:31

-   @ques 如何知道一条 terminal 已经完成
    -   我所要的功能是一条命令后面继续执行下一条命令...

*   ProcessExecution onDidEndTaskProcess

-   terminal 太多了 太乱了

-   没有监听 terminal dispose 报错..
    -   await processExist(await terminal.processId) === false

## 2018-11-30 10:14:58

-   @ques api 不打开 文件, 解析文件...

    -   FileSystemProvider.readFile

-   @toto

    -   icon + readme
        -   @ques gif
    -   一个全局文件保存位置

-   @bug 有时候命令没有执行完成, 就进行下一条

-   @ques 如何不打开文件, 解析文件 - bookmark 如何做到的 - 记录在内存里面吗...

-   @ques cur Document

-   @ques 如何设置
    -   workbench.settings.editor
    -   workspace.getConfiguration
    -   Unknown configuration setting

## 2018-11-29 10:03:59

-   @ques onDidWriteData 如何取消...

-   @ques ShellExecution 这是干什么的

-   @ques 无法知道 activeTerminal 是不是空闲的状态, 所以直接新建就可以了

-   @ques 无法执行 bash 函数

    -   可以设置参数
    -   可以当整个 bash 脚本执行, 可以一条一条执行...

-   @todo 可以 before

-   @ques 怎么会选择一个 item 呢

-   @ques \r\n linux 换行不是这个 怎么处理
-   @todo 清除空行, 如何

-   @ques 如果存在多层 symbol 怎么处理...

全部写在一个 mardown 文件中...
https://github.com/patrys/vscode-code-outline/blob/master/src/symbolOutline.ts

-   @ques 如何 open document file

-   @ques 如何不打开 md 的情况下解析 js 如何解析 markdown

    -   list
    -   代码
    -   注释

-   @ques vscode indent space...

```ts
let d = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
    'vscode.executeDocumentSymbolProvider',
    list,
);
```

-   @ques 必须要打开我才能 获得 吗 SymbolProvider
    -   我怎么获取 code 里面的数据

## 2018-11-16 09:12:13

-   terminal is not busy

    -   https://github.com/Microsoft/vscode/issues/20676

-   https://code.visualstudio.com/docs/extensionAPI/vscode-api

    -   Provider

-   gitlen

    -   blameAnnotationProvider.ts
    -   • Uncommitted changes

-   D:\zsytssk\github\test[open][openterminal]

    -   自己的语法命令...

-   @ques 如何将文件夹高亮...

-   @ques 能不能像 rust test 一样在 文件夹旁边自动显示 open terminal, open

-   @ques 如何传递参数 extension

    -   D:\zsytssk\github\test

-   @ques 如何在页面添加 panel 打开 运行...

    -   曾小平 以前运行 http 的那个插件叫什么
    -   Gitleng
    -   @ques contentprovider-sample 是这个吗
    -   @ques Virtual Document Sample

-   @ques evernote

    -   https://github.com/Microsoft/vscode-extension-samples/tree/master/fsprovider-sample

-   @ques 只在 markldown 中运行

-   @ques 将命令直接写在文件夹旁边...

## 2018-11-15 17:42:03

-   processId

*   terminal de pid 知道他忙不忙 - shell is busy

*   vscode html preview

*   @ques 如何保存配置...

*   @ques `context.subscriptions` 这是做什么的

*   @ques 怎么打开顶部的选择栏

*   terminal 所有事件

*   @ques vscode 所有 categories

*   activationEvents 是什么意思...

    -   插件需要一个激活的命令, 只有这个命令运行
    -   才能进行后续擦操作...

*   @ques 怎么知道 terminal idle 了

    -   额没有这样的 api 啊

*   @ques 怎么不运行 extensions

## terminal APi

-   vscode
-   window

    -   terminals
    -   ***
    -   showInformationMessage
    -   onDidOpenTerminal
    -   onDidChangeActiveTerminal
    -   createTerminalRenderer [proposedAPI]

-   commands

    -   registerCommand`terminalTest.createTerminal`
    -   ***

-   terminal

    -   onDidWriteData
    -   sendText
    -   ***
    -   dispose
    -   processId @ques 这是干什么的

-   context
    -   subscriptions
        -   push

`E:/zsytssk/tools/putty/plink.exe -ssh dev-game@10.189.12.30 -pw 1746e04b7f3e752d8b9695b63b600f9b ssh -tt www@21.58.201.35 cd /data/httpd/zhangshiyang/wap`

-   createAndSend
-   onDidWriteData

*   @ques 能不能知道命令执行完成
    -   有没有静止状态...

-   @ques 能不能一直发命令

    -   vscode 能不能一直一条一条的执行..

-   activateTaskProvider
