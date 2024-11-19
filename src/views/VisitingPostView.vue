<template>
  <div class="visiting-post-view">
    <div class="left-banner">
      <router-link to="/main" class="back-link"
        >🏠 홈 화면으로 돌아가기</router-link
      >
      <div class="comments-section">
        <p class="likes" @click="likePost">▼ 💜 Like {{ post.likes }}</p>
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <span class="nickname">@{{ comment.author }}</span>

          <!-- 수정 모드일 때와 아닐 때를 구분 -->
          <div v-if="editMode === comment.id">
            <input v-model="editedComment" />
            <button @click="saveComment(comment.id)">저장</button>
            <button @click="cancelEdit">취소</button>
          </div>
          <p v-else class="comment-text">{{ comment.text }}</p>

          <!-- 댓글 작성자일 경우에만 수정 및 삭제 버튼 표시, 수정 중일 때는 숨김 -->
          <div
            v-if="isAuthor(comment) && editMode !== comment.id"
            class="comment-actions"
          >
            <button @click="editComment(comment.id)">✏️</button>
            <button @click="deleteComment(comment.id)">🗑️</button>
          </div>
        </div>

        <div class="add-comment">
          <input v-model="newComment" placeholder="댓글을 입력해주세요." />
          <button @click="addComment">등록</button>
        </div>
      </div>
    </div>

    <div class="post-content">
      <div v-if="isPostAuthor" class="post-actions">
        <button @click="editPost">수정</button>
        <button @click="deletePost">삭제</button>
      </div>
      <p class="author">@{{ post.author }}</p>
      <h1 class="title">{{ post.title }}</h1>
      <div class="images">
        <img
          v-for="(image, index) in post.images"
          :key="index"
          :src="image"
          :alt="post.title"
          class="post-image"
        />
      </div>
      <h3 class="store-name">{{ post.storeName }}</h3>
      <p class="body">{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        id: 1,
        author: 'puppy',
        title: '경기대 근처 짱이야떡볶이 추천합니다!',
        images: [
          require('../assets/tteokbokki.jpg'),
          require('../assets/frontStoretteokbokki.jpg'),
        ],
        storeName: '짱이야 떡볶이',
        body: '떡볶이 애호가라면 꼭 방문해야 할 최고의 맛집을 소개합니다...',
        likes: 25,
      },
      comments: [
        { id: 1, author: 'abcd', text: '저도 가고싶어요!!' },
        { id: 2, author: 'tigerrrr', text: '좋은 정보 감사합니다 :)' },
        { id: 3, author: 'puppy', text: '떡볶이 저도 참 좋아해요!' }, // 예제 댓글
      ],
      newComment: '',
      currentUser: 'puppy',
      editMode: null, // 편집 중인 댓글 ID 저장
      editedComment: '', // 수정 중인 댓글 텍스트 저장
    };
  },
  computed: {
    isPostAuthor() {
      return this.post.author === this.currentUser;
    },
  },
  methods: {
    isAuthor(comment) {
      return comment.author === this.currentUser;
    },
    addComment() {
      if (this.newComment.trim()) {
        this.comments.push({
          id: Date.now(),
          author: this.currentUser,
          text: this.newComment,
        });
        this.newComment = '';
      }
    },
    editComment(id) {
      const comment = this.comments.find((c) => c.id === id);
      this.editMode = id;
      this.editedComment = comment.text;
    },
    saveComment(id) {
      const comment = this.comments.find((c) => c.id === id);
      if (this.editedComment.trim()) {
        comment.text = this.editedComment;
        this.editMode = null;
        this.editedComment = '';
      }
    },
    cancelEdit() {
      this.editMode = null;
      this.editedComment = '';
    },
    deleteComment(id) {
      this.comments = this.comments.filter((c) => c.id !== id);
    },
    editPost() {
      console.log('Edit post');
    },
    deletePost() {
      if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
        console.log('Post deleted');
      }
    },
    likePost() {
      this.post.likes += 1;
    },
  },
};
</script>

<style scoped>
.visiting-post-view {
  display: flex;
  padding: 20px;
}
.left-banner {
  width: 250px;
  margin-right: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
}
.back-link {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
}
.comments-section {
  margin-top: 10px;
}
.likes {
  font-weight: bold;
  margin-bottom: 10px;
}
.comment {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}
.nickname {
  font-weight: bold;
  margin-right: 8px;
}
.comment-text {
  flex: 1;
}
.comment-actions button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}
.add-comment {
  display: flex;
  margin-top: 10px;
}
.add-comment input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.add-comment button {
  margin-left: 5px;
  padding: 5px 10px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
}
.post-content {
  flex: 1;
}
.post-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.post-actions button {
  background-color: black;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}
.author {
  font-size: 14px;
  color: #555;
}
.title {
  font-size: 24px;
  margin: 10px 0;
}
.images {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.post-image {
  width: 100%;
  border-radius: 5px;
}
.store-name {
  font-size: 18px;
  margin: 5px 0;
}
.body {
  font-size: 16px;
  line-height: 1.5;
}
</style>
