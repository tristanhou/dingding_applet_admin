<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
@media screen and (max-width:900px){
  html {
    font-size: 12px
  }
}
@media screen and (max-width:1080px){
  html {
    font-size: 14px
  }
}
</style>
