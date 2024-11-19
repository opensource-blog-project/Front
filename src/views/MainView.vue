<template>
  <div class="main-container">
    <h1 class="title">맛집블로그</h1>
    <div class="search-bar-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="검색어를 입력하세요"
      />
      <button @click="goToNewPost">New Post</button>
    </div>

    <div class="post-board">
      <div class="post-card" v-for="post in filteredPosts" :key="post.id">
        <div class="profile">
          <span class="nickname">{{ post.author }}</span>
        </div>
        <router-link
          :to="{ name: 'Visiting', params: { id: post.id } }"
          class="post-title"
          >{{ post.postTitle }}</router-link
        >
        <img :src="post.image" alt="Post Image" class="post-image" />
        <h3 class="store-name">{{ post.storeName }}</h3>
        <p class="likes">💜 Like {{ post.likes }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      posts: [
        {
          id: 1,
          author: '@abcd',
          postTitle: '경기대 근처 짱이야떡볶이 추천합니다!',
          image: require('@/assets/tteokbokki.jpg'),
          storeName: '짱이야 떡볶이',
          likes: 25,
        },
        {
          id: 2,
          author: '@puppy',
          postTitle: '타코집 중에서는 여기가 최고에요 ㅠㅠ',
          image: require('@/assets/taco.jpg'),
          storeName: '타코타코팜',
          likes: 10,
        },
        {
          id: 3,
          author: '@Imcat',
          postTitle: '수제피자집 피자홈 강추!',
          image: require('@/assets/pizza.jpg'),
          storeName: '피자홈홈',
          likes: 20,
        },
        {
          id: 4,
          author: '@hamstar',
          postTitle: '어머니 손맛 가득한 김치찌개집 추천이요,,',
          image: require('@/assets/gimchi.jpg'),
          storeName: '어머니 김치찌개',
          likes: 14,
        },
        // 다른 게시글들...
      ],
    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter(
        (post) =>
          post.storeName.includes(this.searchQuery) ||
          post.postTitle.includes(this.searchQuery)
      );
    },
  },
  methods: {
    search() {
      // 검색 로직 처리
      console.log('검색 기능 실행됨');
    },
    goToNewPost() {
      this.$router.push('/newpost'); // 글 작성 화면으로 이동
    },
  },
};
</script>

<style scoped>
.main-container {
  text-align: center;
  padding: 20px;
}

input {
  padding: 8px;
  font-size: 16px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.search-bar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 5px;
}

.post-board {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.post-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.nickname {
  font-weight: bold;
}

.description {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.post-image {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.business-name {
  font-size: 1.1rem;
  margin: 5px 0;
}

.likes {
  font-size: 0.9rem;
  color: #888;
}

button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: gray;
}
</style>
