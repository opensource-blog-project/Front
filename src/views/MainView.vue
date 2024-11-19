<template>
  <div class="main-container">
    <div class="sidebar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="검색어를 입력하세요"
      />
      <ul class="post-list">
        <li v-for="post in filteredPosts" :key="post.id">{{ post.title }}</li>
      </ul>
      <button @click="createNewPost">New Post</button>
    </div>

    <div class="post-board">
      <div class="post-card" v-for="post in posts" :key="post.id">
        <img :src="post.image" alt="Post Image" />
        <h3>{{ post.title }}</h3>
        <p>{{ post.likes }} ❤️</p>
        <p>by {{ post.author }}</p>
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
          title: '짱이야 떡볶이',
          image: require('@/assets/tteokbokki.jpg'),
          likes: 25,
          author: '@abcd',
        },
        {
          id: 2,
          title: '타코타코팜',
          image: require('@/assets/taco.jpg'),
          likes: 10,
          author: '@puppy',
        },
        // 다른 게시글들...
      ],
    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => post.title.includes(this.searchQuery));
    },
  },
  methods: {
    createNewPost() {
      // 새 글 작성 로직
      console.log('New Post 클릭됨');
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
}

.sidebar {
  width: 20%;
  padding: 10px;
  background-color: #f0f0f0;
}

.post-list {
  list-style: none;
  padding: 0;
}

.post-list li {
  margin: 5px 0;
}

button {
  margin-top: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.post-board {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
}

.post-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  width: 30%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.post-card img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.post-card h3 {
  font-size: 18px;
  margin: 10px 0;
}
</style>
