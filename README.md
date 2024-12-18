# HTML-Editor

### 写在前面

本项目为复旦大学 2024 本科生软件设计课程的 Lab 参考，用于展示设计模式、设计原则在软件开发中的实践。Lab 的需求参考`lab1.md`与`lab2.md`。

出于此目的，项目在开发过程中会假设一些更复杂的开发场景，并尽量使用相应的设计模式来解决问题。但在实际开发中，要避免在项目之初由于“不存在的未来需求”堆砌设计模式，造成过度设计使开发难度上升；应根据需求进行合理的考量，在迭代开发中逐步重构并运用设计模式。

另外，项目是助教根据自己的理解进行实现的，并非标准答案，如有其他解决方式或是有不合适之处，欢迎大家讨论交流。

### 使用

##### 安装依赖：

```bash
npm install
```

##### 运行程序：

```bash
npm run start
```

程序将在本项目的`playground`目录下运行。

##### 运行测试：

```bash
npm run test
```

### 模块设计概述

![uml](https://i.imgur.com/WScD3HM.jpg)

图中展示了本项目的模块以及主要的接口与类设计：

- `Core`模块是编辑器的核心实现，包括了简易版 HTML 的结构设计以及编辑器的主要功能。
- `Service`中包含了不属于编辑器核心功能的其他功能，例如嵌套打印、语法检查、解析文本等。
- `Control`层作为编辑器底层功能与上层用户需求的一个“中间层”，通过组合和调用`Core`、`Service`中的功能来满足易变的上层需求，同时保持底层功能的稳定。
- `IO`模块将输入输出的功能抽象出来，使其他功能与具体的 io 形式解耦，提高其他功能的复用性，同时也更便于自动化测试。

### 设计模式运用

#### 组合模式

参考文章：[Refactoring.Guru Composite](https://refactoringguru.cn/design-patterns/composite)

<img style="width: 40%" src="https://i.imgur.com/tS2jJkC.png" />

由于需求中约定每个标签至多有一段文本且必须放置在开头，因此可以简单的设计一个标签类型，并将文本作为该类型的一个属性；但在实际 HTML 中，一个标签节点可以有多段不同位置的文本，甚至还存在“注释标签”，因此将文本、注释等设计成叶子结点，并使用组合模式，可以合适地表示一个 HTML 结构。

#### 访问者模式

参考文章：[Refactoring.Guru Visitor](https://refactoringguru.cn/design-patterns/visitor)

<img style="width: 70%" src="https://i.imgur.com/gyuJTVP.png" />

- 当需要访问一个复杂结构中的不同对象，且针对不同对象的访问行为不同时，我们可以使用访问者模式。例如，图中的`ContentVisitor`针对不同的节点有不同的返回方式。
- 同时，访问者模式可以尽量避免对核心代码的侵入。核心代码中只需要添加`accept`方法，而所有非核心功能的实现都可以被隔离在具体的 `Visitor`中，避免污染核心功能。

#### 适配器模式

参考文章：[Refactoring.Guru Adapter](https://refactoringguru.cn/design-patterns/adapter)

<img style="width: 70%" src="https://i.imgur.com/poMwKpv.png" />

场景：

- 我们已经实现了一个 `FileSystem` 类用于读取文件系统（项目实际使用的是 nodejs 库）
- 现在需要能够树状打印某个目录内的所有文件名、目录名（即 Lab 需求中的`dir-tree`命令）
- 我们已经拥有一个能够树状打印内容的服务，但该服务需要被打印的内容满足`Printable`接口（项目中的`@service/printer/Printer`类）
- 我们不希望在`FileSystem`中重复添加类似的实现，因为这样不仅麻烦还会污染该类

在这种场景下，我们可以使用适配器模式，创建一个适配器类`PathToPrintableAdpter`。适配器类通过组合和调用`FileSystem`的功能，来实现`Printable`接口要求的方法。通过适配器模式，我们可以为现有的类创造一个适配器来“适配”已有的服务，从而优雅地将服务复用。

类似的，项目中还创建了`NodeToPrintableAdapter`适配器类，使`Node`类能够适配并使用`Printer`的树状打印服务。

#### 命令模式

参考文章：[Refactoring.Guru Command](https://refactoringguru.cn/design-patterns/command)

<img style="width: 70%" src="https://i.imgur.com/UNMa3ra.png" />

- 命令模式可将请求转换为一个包含与请求相关的所有信息的独立对象（`Command`的各种派生类）。该转换让你能延迟请求执行或将其放入队列中，实现可撤销操作。（图中示例仅针对 undo 功能，项目中为了同时支持 undo、redo、isModified 功能，实现比图中略复杂一些）
- 当我们的程序有多种不同的方式来触发相同的操作，例如，除了通过已经实现的读取命令行输入的方式，还可能有监听快捷键按下、或是 GUI 界面的按钮点击等方式来触发。此时，使用命令模式可以避免在多处编写重复的逻辑，我们只需要在每个可以触发该功能的位置通过参数来 new 一个相应的命令实例即可。
- 命令模式还可以作为“中间层”或“胶水层”，通过组合和调用现有的功能来满足易变的用户需求，避免频繁改动核心代码，从而保持核心代码的稳定。本项目中刻意保持了`Core`模块的功能简介，并在`Control`层中组合这些功能来实现更复杂的需求，从而体现这一特点。但注意，在`Command`的实现中应尽量组合并调用其他类的功能，避免在其中添加业务逻辑。

#### 装饰器模式

参考文章：[Refactoring.Guru Decorator](https://refactoringguru.cn/design-patterns/decorator)

<img style="width: 70%" src="https://i.imgur.com/g7l7Y0h.png" />

场景：

- 我们已经使用`PathToPrintableAdapter`适配器将`FileSystem`类与树状打印服务成功适配。上述几个类都与编辑器无关。
- 根据需求，在打印树状打印目录时，需要将正在编辑的文件名后面添加“\*”号，该功能依赖`Session`类。
- 我们不希望破坏或修改现有的`PathToPrintableAdapter`类，这会导致该类与`Session`类产生不必要的耦合。

在这种场景下，我们可以使用装饰器模式：

- 我们通过创建装饰器类来添加装饰功能。基类`BaseDecorator`继承自需要装饰的类`PathToPrintableAdapter`，并且在构造时包含一个该类的实例（称为`wrapped`）。基类不作任何装饰，所有功能直接委托`wrapped`实现。
- `ModifiedDecorator`在构造是需要一个额外的`Session`实例，借此来判断文件是否 modified，并添加相应的装饰。

继承 vs 装饰：

- 我们确实可以通过继承实现同样的效果。（直接继承自`PathToPrintableAdapter`并重写`getContent`）
- 但是装饰器可以动态自由组合，而继承是静态的，必须提前写出所有组合方式。

  - 假设现在除了给 modified 的文件添加“\*”号，还需要给 editting 的文件添加“!”号。是否使用装饰以及装饰的顺序会根据用户的需求变化。
  - 使用装饰器模式：

    ```typescript
    class ModifiedDecorator extends BaseDecorator;
    class EdittingDecorator extends BaseDecorator;

    // 根据用户的需求更改装饰顺序或减少装饰
    switch (userPreference) {
      case "*!": return new EdittingDecorator(new ModifiedDecorator(new PathToPrintableAdapter()))
      case "!*": ...
      case "*": ...
      case "!": ...
    }
    ```

  - 使用继承：

    ```typescript
    class ModifiedDecorator extends PathToPrintableAdapter;
    class EdittingDecorator extends PathToPrintableAdapter;
    // 必须提前生成所有组合，且实现逻辑重复
    class ModifiedEdittingDecorator extends PathToPrintableAdapter;
    class EdittingModifiedDecorator extends PathToPrintableAdapter;

    switch (userPreference) {
      case "*!": return new EdittingModifiedDecorator()
      case "!*": ...
      case "*": ...
      case "!": ...
    }
    ```

  - 因此，假设有`n`种装饰，使用装饰器模式仅需创建`n`种装饰器类；使用继承则需要创建`2^n`种子类。

项目中一共四处使用了装饰器模式：

- `dir-tree`、`dir-indent`打印目录时，使用“\*”号装饰文件名称
- `print-tree`打印 HTML 内容时，使用“[X]”装饰拼写错误的文本
- 使用`CanUndoDecorator`装饰所有可以被撤销的命令（装饰 execute：在 execute 后将命令自身添加到记录类中去）
- 使用`ReactiveCachedDecorator`装饰`SpellCheckService`（装饰 check：在 check 前先检查是否已有缓存）

#### 发布订阅模式（中介者模式+观察者模式）

参考文章：[Refactoring.Guru Mediator](https://refactoringguru.cn/design-patterns/mediator)、[Refactoring.Guru Observer](https://refactoringguru.cn/design-patterns/observer)、[Pub/Sub Pattern](https://medium.com/jimmy-wang/%E7%B3%BB%E7%B5%B1%E8%A8%AD%E8%A8%88%E5%85%A5%E9%96%80-pub-sub-pattern-ec391aca22aa)

<img style="width: 70%" src="https://i.imgur.com/54Bx0n9.jpg" />

发布订阅模式是一种常用的消息传递模式，通常结合了中介者模式和观察者模式。它允许对象之间的松耦合通信，使得发布者和订阅者之间不直接交互，而是通过一个中介者进行通信。

场景：

- 我们发现`spell-check`和`print-tree`命令的执行耗时较长，因为它们需要在触发时对所有的文本节点发送拼写检查请求。
- 注意到我们可以在文本内容发生改变时，在后台提前进行拼写检查，将结果缓存。当需要执行拼写检查相关命令时，首先从缓存中查找结果，从而减少命令的执行耗时。
- 我们需要一种机制在文本内容发生改变(`TagNode`的`setText`函数执行)时，“发布”事件通知相关组件进行检查并缓存结果。
- 考虑到“订阅”事件的组件可能有许多非核心组件，我们不希望直接在`setText`函数执行的末尾直接添加上这些组件的相关函数，因为这可能导致核心组件的频繁修改、且容易因为非核心组件的 bug 导致影响整个核心业务。因此我们需要一种“松耦合”的消息传递模式。

在这种场景下，可以使用发布订阅模式：

- 创建一个转发事件的中介者`EventMediator`
- 组件可以“订阅”某类事件，并指定如何响应该事件（传递一个 callback 回调函数）
- `EventMediator`记录下这些回调函数
- 组件可以要求`EventMediator`“发布”事件以及相关的数据
- `EventMediator`根据事件类型查找记录的所有回调函数，并以相关数据作为参数依次调用这些回调函数

#### 单例模式

参考文章：[Refactoring.Guru Singleton](https://refactoringguru.cn/design-patterns/singleton)

<img style="width: 50%" src="https://i.imgur.com/h2PeVBa.jpg" />

单例模式的目的是使全局只有唯一的对象实例，这通常可以通过私有化构造函数并提供一个静态的`getInstance`函数来实现。单例模式有几个优点：

- 如果类的实例占用大量资源（如数据库连接、线程池等），单例模式可以有效地控制资源的使用，避免过多的实例消耗系统资源
- 单例模式提供一个全局访问点，能够避免在程序的多个部分传递同一个对象
- 单例模式的实现可以支持延迟加载，即在第一次使用时创建实例，而不是在程序启动时就创建，这可以提高程序启动速度

本项目中，事件中介`EventMediator`使用了单例模式。

### SOLID 设计原则

##### S -- 单一功能原则

> 对象应该仅具有一种单一功能

项目中的类设计都尽量符合职责单一。典型的一次重构是将`CommandFactory`类中抽离出`UserCommandInputParser`类：

起初`CommandFactory`负责解析用户的输入字符串，并且将环境（Session、IO、Printer 等）和用户参数（指定的标签和内容等）组装成命令对象。

后续开发中考虑到除了用户输入，系统内部有时也需要创建命令执行（例如`InitSessionCommand`中的执行需要创建`LoadCommand`），此时再模拟一个用户输入并不合理，应该直接使用参数创建命令。

因此，重构后，`CommandFactory`类只负责装配环境，而新抽象出的`UserCommandInputParser`类则负责解析用户输入的参数，`CommandFactory`不再依赖于用户输入字符串，同时继续维持了单一功能原则。

##### O -- 开闭原则

> 软件应该是对于扩展开放的，但是对于修改封闭

许多设计模式的使用正是为了维持这一原则：

- 针对打印功能使用适配器模式，从而避免了对`Printer`类或是`Node`等类的修改
- 使用装饰器类来添加新的装饰功能，从而避免了直接修改原本的类
- 使用发布订阅模式，从而在避免修改“发布者”组件的情况下能够扩展“订阅者”组件

通过避免修改现有代码，可以减少引入新错误的风险。

##### L -- 里氏替换原则

> 程序中的对象应该是可以在不改变程序正确性的前提下被它的子类所替换

符合里氏替换原则是实现多态性的重要基础。例如，在装饰器模式中，我可以用任意多次装饰后的类来替换原本的类。

违反里氏替换原则可能是由于违反了父类约定的前置条件或后置条件（对参数、返回值以及行为的约定），这往往在缺少类型约定的弱类型语言中更容易违反。

##### I -- 接口隔离原则

> 多个特定的接口要好于一个宽泛用途的接口

建立单一接口，不要建立臃肿的接口。对于特定功能，应声明最小需要的接口，而不是一个臃肿的宽泛接口，否则客户端在使用时不得不实现一些不被使用的方法。

例如，在`Printer`类中，树状打印和缩进打印的接口细化为`TreePrintable`和`IndentPrintable`，而不是直接使用`Printable`接口作为两个方法参数的接口声明。

##### D -- 依赖反转原则

> 方法应该依赖于抽象而不是一个实例

方法依赖于高层次的抽象而不是低层次的具体实现，这样做可以使得方法与具体实现解耦，从而便于扩展或者替换。

例如，项目中针对服务声明了`SpellCheckService`和`HtmlParserService`接口，并使用`LanguageTool`和`Cheerio`分别实现了上述接口。其他类在使用这些服务时，依赖于接口而非具体的实现，如此，我们可以使用其他库添加新的服务实现方式，并可以轻松地替换我们的服务。当使用的第三方库出现问题或是我们需要更换服务的实现时，这么做可以尽可能减少对程序的改动。

### 自动化测试

编写自动化测试有诸多好处：

- 更高的覆盖率：相较于手动测试，我们可以通过编写测试文件，有层次、有组织的测试各个模块的功能，从而更有逻辑地覆盖到程序功能的方方面面，提高测试的覆盖率。
- 更快的测试效率：编写完测试文件后，后续每次测试只需要通过一句简单的命令即可快速完成一次全面的测试。当你修改了程序的部分功能而不确定其是否影响了其他功能的正常运行时，使用自动化测试来确保所有功能依旧符合预期，相比于手动再全部测试一次，这尤其有用。
- 其他种种好处：例如便于发现性能瓶颈、支持持续集成和持续交付、自动化测试脚本也是文档的一种补充等等。

项目中使用`ts-mocha`配合`node:assert`进行自动化测试。命令行运行`npm run test`预期获得类似如下的输出：

![test output](https://i.imgur.com/Vq9pgtA.png)

为了使程序能够支持自动化测试，需要注意：

- 模块化：将程序分解为小的、独立的模块，便于单元测试。
- 低耦合：模块之间的依赖尽量减少，以便单独测试每个模块。
- 使用相关的测试技术：例如使用一些 mock 库或插桩库。

例如，项目中为了便于测试程序的输出，将功能模块与标准输入输出（console.log 等）解耦，抽象出`IO`接口，使功能模块依赖`IO`接口而不是具体的 IO 实现。从而，在程序运行时使用`StdIO`在控制台进行标准输入输出，在自动化测试中使用`ListIO`将输入输出收集在数组中便于断言判断。

项目的自动化测试中还使用了`mock-fs`库，用于模拟一个文件系统，并将程序中的文件读写功能覆盖为读写该模拟的文件系统，从而避免文件读写相关的自动化测试影响真实的文件系统。
