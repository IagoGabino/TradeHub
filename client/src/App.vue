<template>
  <router-view/>
</template>

<style lang="less">
@import '@fortawesome/fontawesome-free/css/all.css';
@import '@/assets/fonts/Gellix/stylesheet.less';


#app {
  font-family: 'Gellix', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #25436e;
}

:root {
  --primaryColor: #25436e;
  --secondaryColor: #858586;
}


nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
