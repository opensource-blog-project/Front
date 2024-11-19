<template>
  <div class="login-container">
    <h1>맛집블로그</h1>
    <p>나만 알기 아까운 전국 각지 맛집들을 공유해보세요!</p>

    <div class="login-form">
      <label for="username">Id</label>
      <input type="text" id="username" v-model="username" placeholder="Value" />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Value"
      />

      <button @click="login">로그인</button>

      <div class="signup-link">
        <p>아직 회원이 아니시라면?</p>
        <router-link to="/signup">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      // 로그인 로직을 여기에 구현해
      if (this.username && this.password) {
        // 인증 성공 후 메인 화면으로 이동
        this.$router.push('/main');
      } else {
        alert('아이디와 비밀번호를 입력해주세요.');
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f8f8;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
}

.login-form {
  background-color: #e0e0e0;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #555;
}

.signup-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
