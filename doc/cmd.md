## test1

<!-- terminalOption:> 下面这是terminal的配置(code inside json is terminal setting), [TerminalOptions](src\model\cmd.ts),   -->

```json
{
    "name": "test",
    "completeClose": true
}
```

<!-- cmdList:> 下面这是运行的命令, 命令是一行一行执行的(code inside bash is cmd to run, run cmd line by line)  -->

```bash
git status
git log
```

## loginSSh

```json
{
    "shellPath": "bash.exe"
}
```

<!-- cmdList:> 下面这是运行的命令, 命令是一行一行执行的(code inside bash is cmd to run, run cmd line by line)  -->

```bash
ssh ssh.host.path.xxx #waitStr(password:)
sshPassword
cd path/to/folder
```
