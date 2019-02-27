微度新标签页修改版 (Modified Weidu New Tab)
=============================
基于原名为“微度新标签页 (X New Tab Page)”的Chrome扩展修改而来。

__微度新标签页 (X New Tab Page):__
* 一款基于Html5的Chrome浏览器扩展程序。
  它提供了网站快速拨号、网站云添加、数据云备份等功能来增强 Chrome
    原生新标签页（New Tab）；
  另外微度还提供了：
    天气、云壁纸、快速搜索等插件，为用户提供最快捷的上网方式。
* 微度新标签页: [www.weidunewtab.com](http://www.weidunewtab.com/);
    X New Tab Page: [www.newtabplus.com](http://www.newtabplus.com/).
* its official online version supporting multi browsers:
    [www.94994.com](http://www.94994.com/).

__修改__
* 删除了多国语言和多浏览器支持，只保留中文、Chrome支持
* 完美支持在此扩展程序的页面中使用<span style="color: #2f508e;">Vim</span>ium <span style="color: #8e5e2f;">C</span>的快捷键
* 提供了
    [chrome-extension://hdnehngglnbnehkfcidabjckinphnief/vomnibar.html](chrome-extension://hdnehngglnbnehkfcidabjckinphnief/vomnibar.html)
    来供Vimium C使用，
  设置为Vimium C的`Preferred Vomnibar Page`即可减少Vimium C自身的内存占用
* 尽量减少访问网络的次数，不登录且不开天气模块的话，加载页面时不会发ajax
* 修复在不同Chrome版本下的兼容性问题，比如最新的chrome默认滚动事件是passive的，不改的话会报错，而且影响使用
* 删除了一些个人觉得没什么用的功能模块
* 精简权限，历史、收藏、扩展程序等权限仅在第一次打开相应对话框时才会请求
* 调优性能（限于个人时间、精力，优化的地方很少）
* 壁纸的显示方式：修改了一个尺寸的适配方式，能自动适配不同宽高比的图片，让自动更换壁纸的功能更好用些

__已知问题__
* OAuth登录和设置备份大概是不能用的，因为我习惯了手动备份设置文件
* 此版本导出的设置文件不能直接用到原版上，但原版的配置文件可以导入此修改版（应该吧）

__更新日志__

修改版: 4.8.3 mod
* 像`Vomnibar Page for Vimium C`一样，提供了可供Vimium C使用的Vomnibar页面，

修改版: 4.8.2 mod
* 无功能性改动，只是将版本号里的`4.83`修复成`4.8.2`

修改版: 4.83.3 (2017-01-13)
* 在Chrome 56下仍能和Vimium C配合使用

修改版: 4.83.2 (2016-12-29)
* 修正Chrome扩展商店中的应用名称

微度新标签页原版: 4.8.2 (2015-03-19)
* 和4.8.0版相比并无不同，只是删去了一些被废弃功能的代码.

__版权所有+感谢__
* 微度新标签页: ©2012 杭州佐拉网络有限公司 保留所有权利.
