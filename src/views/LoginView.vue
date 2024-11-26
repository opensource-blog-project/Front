<template>
  <div class="login-container">
    <h1>맛집블로그</h1>
    <p>나만 알기 아까운 전국 각지 맛집들을 공유해보세요!</p>

    <div class="login-form">
      <label for="userId">Id</label>
      <input type="text" id="userId" v-model="userId" placeholder="아이디를 입력하세요" />

      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요" />

      <button @click="login">로그인</button>

      <div class="signup-link">
        <p>아직 회원이 아니시라면?</p>
        <router-link to="/api/v1/user">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userId: '', // userId로 변수명 수정
      password: '',
    };
  },
  methods: {
    async login() {
      if (!this.userId || !this.password) {
        alert('아이디와 비밀번호를 입력해주세요.');
        return;
      }

      try {
        // POST 요청 보내기
        const response = await axios.post('http://localhost:8080/api/user/token', {
          userId: this.userId,
          password: this.password,
        });

        // 로그인 성공
        if (response.data.success) {
          const token = response.data.data.accessToken; // 토큰 추출
          localStorage.setItem('accessToken', token); // 토큰을 localStorage에 저장
          alert('로그인에 성공했습니다!');
          this.$router.push('/posts'); // 메인 페이지로 이동
        } else {
          alert('로그인에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.status === 401) {
          alert('아이디 또는 비밀번호가 잘못되었습니다.');
        } else {
          alert('서버와의 통신 중 문제가 발생했습니다.');
        }
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