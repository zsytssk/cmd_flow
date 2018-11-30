## todo

- webpack 打包

- @ques 设置参数

  - bash, curTerminal, newTerminal
  - 可以当整个 bash 脚本执行, 可以一条一条执行...

- @todo 脚本依赖 可以 before 一条条执行

- ssh 登录

- run select text

  - new terminal
  - active terminal

- open folder or terminal in folder

## APi

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

- registerHoverProviders
- provideDetailsHover
