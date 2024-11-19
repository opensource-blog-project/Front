<template>
  <div class="signup-container">
    <h2>회원가입</h2>
    <form @submit.prevent="signUp">
      <input type="text" v-model="username" placeholder="아이디" required />
      <input type="email" v-model="email" placeholder="이메일" required />
      <input
        type="password"
        v-model="password"
        placeholder="비밀번호"
        required
      />
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    signUp() {
      // 회원가입 처리 로직
      console.log('회원가입 시도:', this.username, this.email, this.password);
    },
  },
};
</script>

<style scoped>
.signup-container {
  /* 스타일 추가 */
}
</style>
