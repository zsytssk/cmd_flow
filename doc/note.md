## 2018-11-30 10:14:58

- @ques 如何不打开文件, 解析文件 - bookmark 如何做到的 - 记录在内存里面吗...

- @ques cur Document

## 2018-11-29 10:03:59

- @ques onDidWriteData 如何取消...

- @ques ShellExecution 这是干什么的

- @ques 无法知道 activeTerminal 是不是空闲的状态, 所以直接新建就可以了

- @ques 无法执行 bash 函数

  - 可以设置参数
  - 可以当整个 bash 脚本执行, 可以一条一条执行...

- @todo 可以 before

- @ques 怎么会选择一个 item 呢

- @ques \r\n linux 换行不是这个 怎么处理
- @todo 清除空行, 如何

- @ques 如果存在多层 symbol 怎么处理...

全部写在一个 mardown 文件中...
https://github.com/patrys/vscode-code-outline/blob/master/src/symbolOutline.ts

- @ques 如何 open document file

- @ques 如何不打开 md 的情况下解析 js 如何解析 markdown

  - list
  - 代码
  - 注释

- @ques vscode indent space...

```ts
let d = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
  'vscode.executeDocumentSymbolProvider',
  list,
);
```

- @ques 必须要打开我才能 获得 吗 SymbolProvider
  - 我怎么获取 code 里面的数据

## 2018-11-16 09:12:13

- terminal is not busy

  - https://github.com/Microsoft/vscode/issues/20676

- https://code.visualstudio.com/docs/extensionAPI/vscode-api

  - Provider

- gitlen

  - blameAnnotationProvider.ts
  - • Uncommitted changes

- D:\zsytssk\github\test[open][openterminal]

  - 自己的语法命令...

- @ques 如何将文件夹高亮...

- @ques 能不能像 rust test 一样在 文件夹旁边自动显示 open terminal, open

- @ques 如何传递参数 extension

  - D:\zsytssk\github\test

- @ques 如何在页面添加 panel 打开 运行...

  - 曾小平 以前运行 http 的那个插件叫什么
  - Gitleng
  - @ques contentprovider-sample 是这个吗
  - @ques Virtual Document Sample

- @ques evernote

  - https://github.com/Microsoft/vscode-extension-samples/tree/master/fsprovider-sample

- @ques 只在 markldown 中运行

- @ques 将命令直接写在文件夹旁边...

## 2018-11-15 17:42:03

- processId

* terminal de pid 知道他忙不忙 - shell is busy

* vscode html preview

* @ques 如何保存配置...

* @ques `context.subscriptions` 这是做什么的

* @ques 怎么打开顶部的选择栏

* terminal 所有事件

* @ques vscode 所有 categories

* activationEvents 是什么意思...

  - 插件需要一个激活的命令, 只有这个命令运行
  - 才能进行后续擦操作...

* @ques 怎么知道 terminal idle 了

  - 额没有这样的 api 啊

* @ques 怎么不运行 extensions

## terminal APi

- vscode
- window

  - terminals
  - ***
  - showInformationMessage
  - onDidOpenTerminal
  - onDidChangeActiveTerminal
  - createTerminalRenderer [proposedAPI]

- commands

  - registerCommand`terminalTest.createTerminal`
  - ***

- terminal

  - onDidWriteData
  - sendText
  - ***
  - dispose
  - processId @ques 这是干什么的

- context
  - subscriptions
    - push

`E:/zsytssk/tools/putty/plink.exe -ssh dev-game@10.189.12.30 -pw 1746e04b7f3e752d8b9695b63b600f9b ssh -tt www@21.58.201.35 cd /data/httpd/zhangshiyang/wap`

- createAndSend
- onDidWriteData

* @ques 能不能知道命令执行完成
  - 有没有静止状态...

- @ques 能不能一直发命令

  - vscode 能不能一直一条一条的执行..

- activateTaskProvider
