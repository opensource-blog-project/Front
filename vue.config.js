const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/posts': {
        target: 'http://localhost:8080', // API 서버 주소
        changeOrigin: true,
      },
    },
  },
};