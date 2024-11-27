<template>
  <div class="visiting-post-view">
    <div class="left-banner">
      <router-link to="/posts" class="back-link">🏠 홈 화면으로 돌아가기</router-link>
      <div class="comments-section">
        <p class="likes" @click="likePost">▼ 💜 Like {{ post.likes }}</p>
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <span class="nickname">@{{ comment.userId }}</span>

          <!-- 수정 모드일 때와 아닐 때를 구분 -->
          <div v-if="editMode === comment.id">
            <input v-model="editedComment" />
            <button @click="saveComment(comment.id)">저장</button>
            <button @click="cancelEdit">취소</button>
          </div>
          <p v-else class="comment-text">{{ comment.text }}</p>

          <!-- 댓글 작성자일 경우에만 수정 및 삭제 버튼 표시, 수정 중일 때는 숨김 -->
          <div v-if="isAuthor(comment) && editMode !== comment.id" class="comment-actions">
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
        <button @click="navigateToEdit">수정</button>
        <button @click="deletePost">삭제</button>
      </div>
      <p class="author">@{{ post.postWriter }}</p>
      <h1 class="title">{{ post.title }}</h1>
      <div class="images">
        <img v-for="(image, index) in post.images" :key="index" :src="image" class="post-image" />
      </div>
      <h3 class="store-name">{{ post.restaurant }}</h3>
      <p class="body">{{ post.content }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
//import EventBus from '@/utils/eventBus';


export default {
  data() {
    return {
      post: {},
      comments: [],
      newComment: '',
      editMode: null,
      editedComment: '',
      isLiking: false // 좋아요 처리 상태 확인
    };
  },
  computed: {
    currentUser() {
      // 현재 로그인한 사용자의 정보를 로컬 스토리지에서 가져옵니다.
      return localStorage.getItem('username');
    },
    isPostAuthor() {
      return this.post.author === this.currentUser;
    },
  },
  mounted() {
    const postId = this.$route.params.id; // URL 파라미터에서 ID를 가져옵니다.
    axios.get(`http://localhost:8080/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then(response => {
        this.post = response.data;
        this.comments = response.data.comments; // 댓글 데이터도 함께 가져옵니다.
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
  methods: {
    isAuthor(comment) {
      return comment.author === this.currentUser;
    },
    async addComment() {
      if (!this.newComment.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append('author', this.currentUser);
        formData.append('content', this.newComment);

        const response = await axios.post(`http://localhost:8080/posts/${this.post.id}/comments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        // 댓글 목록에 새 댓글 추가
        this.comments.push(response.data);

        // 입력 필드 초기화
        this.newComment = "";

        alert("댓글이 성공적으로 작성되었습니다.");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("인증에 실패했습니다. 다시 로그인해주세요.");
        } else {
          console.error("댓글 작성 중 오류 발생:", error);
          alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        }
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
    navigateToEdit() {
      this.$router.push({
        name: 'EditPost',
        params: { id: this.post.id },
      });
    },
    deletePost() {
      if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
        axios.delete(`http://localhost:8080/posts/${this.post.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
          .then(() => {
            console.log('Post deleted');
            this.$router.push({ name: 'Main' }); // 삭제 후 홈으로 이동
          })
          .catch(error => {
            console.error('Error deleting post:', error);
          });
      }
    },
    likePost() {
      if (this.isLiking) return; // 이미 요청 중이라면 아무것도 하지 않음
      this.isLiking = true;

      axios.post(`http://localhost:8080/posts/${this.post.id}/like`, {
        username: this.currentUser
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then(response => {
          this.post.likes = response.data.likes;
        })
        .catch(error => {
          console.error('좋아요 처리 실패:', error);
        })
        .finally(() => {
          this.isLiking = false; // 요청 완료 후 상태 초기화
        });
    }
  }
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