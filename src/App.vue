<template>
  <div id="app">
    <header>
      <h1>팀 블로그에 오신 것을 환영합니다~!</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
// import MyHome from './components/MyHome.vue'

export default {
  name: 'App',
  // components: {
  //   MyHome
  // }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 10px;
}

nav a {
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
