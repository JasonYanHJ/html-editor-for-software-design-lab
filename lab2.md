# Lab2

**对 Lab1 HTML 编辑器的增强**

## 1. 支持多个文件的编辑

启动程序到关闭的过程我们称为一个会话 Session。一个 Session 可以有多个文件编辑器(Editor)，程序同时至多有一个活动编辑器(Active Editor)，可以通过切换命令来更改当前的 Active Editor。每个 Editor 有独立的 undo/redo 的状态。

> 提示: 参考 VSCode。一个打开的 VSCode 窗口对应 Session，每个 VSCode 标签对应一个 Editor，当前正在编辑的 VSCode 标签是 Active Editor。

为此我们需要重新设计 Lab1 中的命令。原 Lab1 中的编辑类、显示类、撤销和重做命令都针对 Active Editor 进行操作，取消原 Lab1 中的输入/输出类命令（read、save、init），并改为如下命令：

#### load 将 HTML 文件装入新 Editor 中

```bash
load filepath
```

- filepath 为文件的路径名
- 装入的文件不存在时，新建文件并提供初始 html 模板（类似原 Lab1 中的 init 功能）
- Active Editor 自动切换为新装入的 Editor
- 需要装入的文件已经装入时，给出必要的错误提示

#### save 保存

```bash
save
```

- 保存 Active Editor 中的文件内容

#### close 关闭

```bash
close
```

- 关闭 Active Editor
- 如果 Active Editor 中的文件修改过，则询问是否需要保存
- 关闭后 Active Editor 变为打开的编辑器列表中第一个，如果 Session 中没有其他的 Editor，则没有 Active Edtior。

#### editor-list 显示编辑器列表

```bash
editor-list
```

- 显示 Session 中的所有 Editor 对应的 filepath
- 在 Active Editor 前面显示“>”
- 在修改过文件内容的 Editor 后面显示“\*”

#### edit 切换 Active Editor

```bash
edit filepath
```

- filepath 为文件的路径名
- 文件必须已经装入 Editor 中
- 对于未装入 Editor 的文件，给出必要的错误提示

#### exit 退出程序

```bash
exit
```

- 退出程序时需要逐一询问用户没有保存的文件是否需要保存，未保存的内容将被丢弃
- 退出程序**不等同于**对所有文件执行 close 命令，具体要求请参考“4. 恢复上次编辑的状态”

## 2. html 树形结构的显示增强

#### print-tree 命令增强

```bash
print-tree
```

增强功能：在 html 的树形结构上标记出有拼写检查错误的节点

- 拼写错误的节点前面显示“[X]”标记
- 为确保数据的一致性，打印前对于拼写检查的结果应做必要的更新（例如，每次打印前执行 spell-check 功能）

#### showid 设置是否展示 id

```bash
showid true/false
```

以树形结构打印时，有 id 的节点在尾部增加了“#id”，这会影响可读性。
通过 showid true 和 showid false 命令控制是否显示 id

- 该命令作用于 Active Editor
- 需要保持 Editor 的 showid 设置（例如，执行 showid false 后，切换 Active Editor 再切换回来，仍保持不显示 id 的设置）

## 3. 支持文件目录的显示

#### dir-tree、dir-indent

```bash
dir-tree
dir-indent [indent]
```

dir 命令用于显示当前工作目录中包含的文件(所有种类)和子目录，并递归显示子目录中的文件和目录。其中，dir-tree 以树形结构展示，dir-indent [indent]以缩进方式展示，默认缩进为 2。当打印到当前 Session 中经编辑还未保存的文件时，在文件名结尾显示 “\*”。

> 提示: 思考如何复用已有的树形和缩进形式的打印功能

样例如下：

```bash
dir-tree

lab1
├── readme.pdf
├── examples
│    └── folder
│          └── a.jpg
└── testcases
      ├── a.html*
      ├── b.html
      ├── special_cases
      │    ├── c.html*
      │    ├── d.html*
      │    └── e.html
      └── empty_folder

dir-indent

lab1
  readme.pdf
  examples
    folder
      a.jpg
  testcases
    a.html*
    b.html
    special_cases
      c.html*
      d.html*
      e.html
    empty_folder
```

## 4. 恢复上次编辑的状态

当运行 exit 命令退出程序时，程序需要记录：

1. 退出前打开的文件编辑器(Editor)列表
2. 退出前的活动编辑器(Active Editor)
3. 每个文件编辑器的 showid 设置

（注：不需要保留 undo/redo 记录）

当下次启动程序时，程序应该自动恢复以上三种工作状态。

> 提示: 现代编辑器软件通常会创建一个隐藏文件夹，用于存储与特定工作区或项目相关的设置和配置文件的目录，通常位于项目的根目录下（例如 .vscode 文件夹或 .idea 文件夹）。类似的，我们可以在当前根目录中存储一个 .my-html 的文件来保存需要的状态。
