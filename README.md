# cloud

#### 介绍
jimicloud

#### 软件架构
vue + vue-router + vuex + axios + iview3.0


#### install and run 

```
// install dependencies
npm install

// develop
npm run dev
```

#### build

```
npm run build
```
#### 国际化

#### 自定义图标

#### 目录
|-- cloud
    |-- .babelrc
    |-- .editorconfig
    |-- .eslintignore
    |-- .eslintrc.js
    |-- .gitignore
    |-- .postcssrc.js
    |-- .travis.yml
    |-- app.js
    |-- cypress.json
    |-- LICENSE
    |-- mime.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vue.config.js
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
    |   |-- App.vue
    |   |-- index.less
    |   |-- main.js
    |   |-- api
    |   |   |-- api.js
    |   |   |-- data.js
    |   |   |-- http.js
    |   |   |-- routers.js
    |   |   |-- user.js
    |   |-- assets
    |   |   |-- icons
    |   |   |   |-- iconfont.css
    |   |   |   |-- iconfont.eot
    |   |   |   |-- iconfont.svg
    |   |   |   |-- iconfont.ttf
    |   |   |   |-- iconfont.woff
    |   |   |-- images
    |   |       |-- login-bg.jpg
    |   |       |-- logo-b.png
    |   |       |-- logo-min.jpg
    |   |       |-- logo-min.png
    |   |       |-- logo.png
    |   |       |-- error-page
    |   |           |-- error-401.svg
    |   |           |-- error-404.svg
    |   |           |-- error-500.svg
    |   |-- components
    |   |   |-- common
    |   |   |   |-- common.less
    |   |   |   |-- util.js
    |   |   |-- common-icon
    |   |   |   |-- common-icon.vue
    |   |   |   |-- index.js
    |   |   |-- icons
    |   |   |   |-- icons.vue
    |   |   |   |-- index.js
    |   |   |-- login-form
    |   |   |   |-- index.js
    |   |   |   |-- login-form.vue
    |   |   |-- main
    |   |   |   |-- index.js
    |   |   |   |-- main.less
    |   |   |   |-- main.vue
    |   |   |   |-- components
    |   |   |       |-- a-back-top
    |   |   |       |   |-- index.js
    |   |   |       |   |-- index.vue
    |   |   |       |-- error-store
    |   |   |       |   |-- error-store.vue
    |   |   |       |   |-- index.js
    |   |   |       |-- fullscreen
    |   |   |       |   |-- fullscreen.vue
    |   |   |       |   |-- index.js
    |   |   |       |-- header-bar
    |   |   |       |   |-- header-bar.less
    |   |   |       |   |-- header-bar.vue
    |   |   |       |   |-- index.js
    |   |   |       |   |-- custom-bread-crumb
    |   |   |       |   |   |-- custom-bread-crumb.less
    |   |   |       |   |   |-- custom-bread-crumb.vue
    |   |   |       |   |   |-- index.js
    |   |   |       |   |-- sider-trigger
    |   |   |       |       |-- index.js
    |   |   |       |       |-- sider-trigger.less
    |   |   |       |       |-- sider-trigger.vue
    |   |   |       |-- language
    |   |   |       |   |-- index.js
    |   |   |       |   |-- language.vue
    |   |   |       |-- side-menu
    |   |   |       |   |-- collapsed-menu.vue
    |   |   |       |   |-- index.js
    |   |   |       |   |-- item-mixin.js
    |   |   |       |   |-- mixin.js
    |   |   |       |   |-- side-menu-item.vue
    |   |   |       |   |-- side-menu.less
    |   |   |       |   |-- side-menu.vue
    |   |   |       |-- tags-nav
    |   |   |       |   |-- index.js
    |   |   |       |   |-- tags-nav.less
    |   |   |       |   |-- tags-nav.vue
    |   |   |       |-- user
    |   |   |           |-- index.js
    |   |   |           |-- user.less
    |   |   |           |-- user.vue
    |   |   |-- parent-view
    |   |   |   |-- index.js
    |   |   |   |-- parent-view.vue
    |   |   |-- select_tree
    |   |   |   |-- index.js
    |   |   |   |-- index.less
    |   |   |   |-- select_tree.vue
    |   |   |-- tables
    |   |   |   |-- edit.vue
    |   |   |   |-- handle-btns.js
    |   |   |   |-- index.js
    |   |   |   |-- index.less
    |   |   |   |-- tables.vue
    |   |   |-- trees
    |   |       |-- index.js
    |   |       |-- trees.vue
    |   |-- config
    |   |   |-- index.js
    |   |-- directive
    |   |   |-- directives.js
    |   |   |-- index.js
    |   |-- libs
    |   |   |-- api.request.js
    |   |   |-- axios.js
    |   |   |-- excel.js
    |   |   |-- tools.js
    |   |   |-- util.js
    |   |-- locale
    |   |   |-- index.js
    |   |   |-- lang
    |   |       |-- en-US.js
    |   |       |-- zh-CN.js
    |   |       |-- zh-TW.js
    |   |-- mock
    |   |   |-- data.js
    |   |   |-- index.js
    |   |   |-- login.js
    |   |   |-- user.js
    |   |-- plugin
    |   |   |-- index.js
    |   |   |-- loading
    |   |       |-- index.js
    |   |       |-- loading.vue
    |   |-- router
    |   |   |-- before-close.js
    |   |   |-- index.js
    |   |   |-- routers.js
    |   |-- store
    |   |   |-- index.js
    |   |   |-- module
    |   |       |-- app.js
    |   |       |-- user.js
    |   |-- view
    |       |-- components
    |       |   |-- selectTree
    |       |   |   |-- selectTree.vue
    |       |   |-- tables
    |       |   |   |-- table.vue
    |       |   |-- trees
    |       |       |-- trees.vue
    |       |-- error-page
    |       |   |-- 401.vue
    |       |   |-- 404.vue
    |       |   |-- 500.vue
    |       |   |-- back-btn-group.vue
    |       |   |-- error-content.vue
    |       |   |-- error.less
    |       |-- login
    |       |   |-- login.less
    |       |   |-- login.vue
    |       |-- single-page
    |           |-- error-logger.vue
    |           |-- home
    |           |   |-- home.vue
    |           |   |-- index.js
    |           |-- message
    |               |-- index.vue
    |-- tests
        |-- e2e
        |   |-- .eslintrc
        |   |-- plugins
        |   |   |-- index.js
        |   |-- specs
        |   |   |-- test.js
        |   |-- support
        |       |-- commands.js
        |       |-- index.js
        |-- unit
            |-- .eslintrc.js
            |-- HelloWorld.spec.js



