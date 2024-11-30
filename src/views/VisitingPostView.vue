<template>
  <div class="visiting-post-view">
    <div class="left-banner">
      <router-link to="/posts" class="back-link">🏠 홈 화면으로 돌아가기</router-link>
      <div class="comments-section">
        <p class="likes" @click="likePost">▼ 💜 Like {{ post.likes }}</p>
        <div class="comment" v-for="comment in comments" :key="comment.commentId">
          <span class="nickname">@{{ comment.commentWriter }}</span>

          <!-- 수정 모드일 때와 아닐 때를 구분 -->
          <div v-if="editMode === comment.commentId">
            <input v-model="editedComment" />
            <button @click="saveComment(comment.commentId)">저장</button>
            <button @click="cancelEdit">취소</button>
          </div>
          <p v-else class="comment-text">{{ comment.content }}</p>

          <!-- 댓글 작성자일 경우에만 수정 및 삭제 버튼 표시 -->
          <div v-if="isAuthor(comment) && editMode !== comment.commentId" class="comment-actions">
            <button @click="editComment(comment.commentId)">✏️</button>
            <button @click="deleteComment(comment.commentId)">🗑️</button>
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
        <button @click="navigateToEdit">수정</button>
        <button @click="deletePost">삭제</button>
      </div>
      <p class="author">@{{ post.postWriter }}</p>
      <h1 class="title">{{ post.title }}</h1>
      <div class="images">
        <!-- postImage가 Base64 문자열로 처리 -->
        <img v-if="post.postImage" :src="'data:image/png;base64,' + post.postImage" class="post-image" />
      </div>
      <h3 class="store-name">{{ post.restaurant }}</h3>
      <p class="body">{{ post.content }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EventBus from '@/utils/eventBus';

export default {
  data() {
    return {
      post: {},
      comments: [],
      newComment: '',
      editMode: null,
      editedComment: '',
      currentUser: localStorage.getItem('currentUser') || '',
      isLiking: false,
    };
  },
  created() {
    EventBus.on('updateCurrentUser', (username) => {
      this.currentUser = username;
      localStorage.setItem('currentUser', username);
    });
  },
  beforeUnmount() {
    EventBus.off('updateCurrentUser');
  },
  computed: {
    isPostAuthor() {
      return this.post.postWriter === this.currentUser;
    },
  },
  async mounted() {
    const postId = this.$route.params.id;
    if (!postId) {
      console.error('postId가 제대로 전달되지 않았습니다.');
    }
    await this.fetchPostData(postId);
    await this.fetchComments(postId);
  },
  methods: {
    async fetchPostData(postId) {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.post = response.data;
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    },
    async fetchComments(postId) {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${postId}/comment/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.comments = response.data.content;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    isAuthor(comment) {
      return comment.commentWriter === this.currentUser;
    },
    async addComment() {
      if (!this.post.postId) {
        console.error('Post ID is not available!');
        return;
      }
      try {
        const response = await axios.post(
          `http://localhost:8080/posts/${this.post.postId}/comment/create`,
          { content: this.newComment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        this.comments.push(response.data);
        this.newComment = '';
      } catch (error) {
        console.error('댓글 작성 오류:', error);
      }
    },
    editComment(id) {
      const comment = this.comments.find((c) => c.commentId === id);
      this.editMode = id;
      this.editedComment = comment.content;
    },
    async saveComment(id) {
      try {
        const response = await axios.put(
          `http://localhost:8080/posts/${this.post.postId}/comment/${id}/update`,
          { content: this.editedComment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        const updatedComment = this.comments.find((c) => c.commentId === id);
        updatedComment.content = response.data.content;
        this.editMode = null;
        this.editedComment = '';
      } catch (error) {
        console.error('댓글 수정 오류:', error);
      }
    },
    cancelEdit() {
      this.editMode = null;
      this.editedComment = '';
    },
    async deleteComment(id) {
      try {
        await axios.delete(
          `http://localhost:8080/posts/${this.post.postId}/comment/${id}/delete`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        this.comments = this.comments.filter((c) => c.commentId !== id);
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
      }
    },
    navigateToEdit() {
      this.$router.push({
        name: 'NewPost',
        query: {
          id: this.post.postId,
          title: this.post.title,
          restaurant: this.post.restaurant,
          content: this.post.content,
        },
      });
    },
    async deletePost() {
      if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
        try {
          await axios.delete(`http://localhost:8080/posts/${this.post.postId}/delete`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          this.$router.push({ name: 'Main' });
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    },
    likePost() {
      if (this.isLiking) return;
      this.isLiking = true;

      axios
        .post(
          `http://localhost:8080/posts/${this.post.id}/like`,
          { username: this.currentUser },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          this.post.likes = response.data.likes;
        })
        .catch((error) => {
          console.error('좋아요 처리 실패:', error);
        })
        .finally(() => {
          this.isLiking = false;
        });
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
  font-size: 30px;
  margin: 20px 0;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  display: inline-block;
}

.images {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.post-image {
  width: 40%;
  border-radius: 5px;
}

.store-name {
  font-size: 25px;
  margin: 10px 0;
}

.body {
  font-size: 20px;
  line-height: 1.5;
}

.new-post {
  margin-top: 20px;
}

.new-post input,
.new-post textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.new-post button {
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
}
</style>