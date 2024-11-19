<template>
  <div id="app">
    <header>
      
    </header>
    <router-view />
    <!-- 여기에 각 페이지가 렌더링됨 -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  color: #333;
}

header {
  background-color: #f8f8f8;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  font-size: 2.5rem;
}
</style>
