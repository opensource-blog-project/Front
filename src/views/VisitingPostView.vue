<template>
    <div class="writing-view">
      <!-- Home Navigation Link -->
      <a href="#" @click="goBackToMain" class="back-link"
        >← 홈 화면으로 돌아가기</a
      >
  
      <!-- Post Content Section -->
      <div class="post-content">
        <div class="post-header">
          <span class="author-nickname">@{{ postAuthor }}</span>
          <button @click="editPost" class="edit-btn">수정</button>
          <button @click="confirmDeletePost" class="delete-btn">삭제</button>
        </div>
        <h2 class="post-title">{{ postTitle }}</h2>
  
        <div class="post-images">
          <img
            v-for="(image, index) in postImages"
            :src="image"
            :alt="'Post Image ' + (index + 1)"
            :key="index"
          />
        </div>
        <h3 class="business-name">{{ businessName }}</h3>
        <p class="post-body">{{ postBody }}</p>
      </div>
  
      <!-- Like and Comment Section -->
      <div class="comments-banner">
        <div class="like-section">
          <span class="like-count">♥ Like {{ likeCount }}</span>
          <button @click="toggleLike" class="like-btn">♥</button>
        </div>
  
        <!-- Comments List -->
        <div class="comments-list">
          <div v-for="(comment, index) in comments" :key="index" class="comment">
            <span class="comment-author">@{{ comment.author }}</span>
            <span class="comment-text">{{ comment.text }}</span>
            <button
              v-if="comment.isEditable"
              @click="editComment(index)"
              class="edit-comment-btn"
            >
              ✏️
            </button>
            <button
              v-if="comment.isEditable"
              @click="deleteComment(index)"
              class="delete-comment-btn"
            >
              🗑️
            </button>
          </div>
        </div>
  
        <!-- Add Comment Input -->
        <div class="add-comment">
          <input v-model="newComment" placeholder="댓글을 입력해주세요" />
          <button @click="addComment">등록</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        postAuthor: 'puppy', // 예시 데이터
        postTitle: '경기대 근처 짱이야떡볶이 추천합니다!',
        postImages: ['/path/to/image1.jpg', '/path/to/image2.jpg'], // 이미지 URL
        businessName: '짱이야 떡볶이',
        postBody:
          '떡볶이 애호가라면 꼭 방문해야 할 최고의 맛집을 소개합니다. 경기대 근처의 숨은 보석...',
        likeCount: 25,
        comments: [
          { author: 'abcd', text: '저도 가고싶어요!!', isEditable: false },
          {
            author: 'tigerrrr',
            text: '좋은 정보 감사합니다 🙂',
            isEditable: true,
          },
          {
            author: 'lmcat',
            text: '떡볶이 저도 참 좋아해요!',
            isEditable: false,
          },
        ],
        newComment: '',
      };
    },
    methods: {
      goBackToMain() {
        // 메인 화면으로 돌아가는 로직
        this.$router.push('/main');
      },
      editPost() {
        // 글 수정 기능
        alert('글 수정 기능은 아직 구현되지 않았습니다.');
      },
      confirmDeletePost() {
        // 글 삭제 확인 알림
        if (confirm('삭제하시겠습니까?')) {
          this.deletePost();
        }
      },
      deletePost() {
        // 글 삭제 기능
        alert('글이 삭제되었습니다.');
        this.$router.push('/main');
      },
      toggleLike() {
        // 좋아요 기능
        this.likeCount++;
      },
      addComment() {
        if (this.newComment.trim() === '') return;
        this.comments.push({
          author: 'currentUser',
          text: this.newComment,
          isEditable: true,
        });
        this.newComment = '';
      },
      editComment(index) {
        // 댓글 수정 기능
        const newText = prompt('댓글을 수정하세요:', this.comments[index].text);
        if (newText) {
          this.comments[index].text = newText;
        }
      },
      deleteComment(index) {
        // 댓글 삭제 기능
        if (confirm('댓글을 삭제하시겠습니까?')) {
          this.comments.splice(index, 1);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 스타일 설정 */
  .writing-view {
    padding: 20px;
  }
  .back-link {
    font-size: 14px;
    color: #555;
    text-decoration: none;
  }
  .post-content {
    margin-top: 20px;
  }
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .author-nickname {
    font-weight: bold;
  }
  .edit-btn,
  .delete-btn {
    background-color: #f5f5f5;
    border: none;
    cursor: pointer;
  }
  .post-title {
    font-size: 24px;
    margin-top: 10px;
  }
  .post-images img {
    width: 100%;
    max-width: 300px;
    margin: 10px;
  }
  .business-name {
    font-size: 18px;
    font-weight: bold;
  }
  .post-body {
    margin-top: 20px;
    line-height: 1.5;
  }
  .comments-banner {
    margin-top: 30px;
  }
  .like-section {
    display: flex;
    justify-content: space-between;
  }
  .like-count {
    font-size: 16px;
  }
  .like-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  .comments-list {
    margin-top: 20px;
  }
  .comment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
  }
  .comment-author {
    font-weight: bold;
  }
  .comment-text {
    margin-left: 10px;
  }
  .add-comment {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .add-comment input {
    flex: 1;
    margin-right: 10px;
  }
  </style>