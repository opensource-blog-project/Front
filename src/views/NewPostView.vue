<template>
    <div class="new-post-container">
      <a @click="goBack" class="back-link">← 홈 화면으로 돌아가기</a>
  
      <div class="form-group">
        <label for="title">제목</label>
        <input
          type="text"
          id="title"
          v-model="title"
          placeholder="제목을 입력하세요"
        />
      </div>
  
      <div class="photo-upload">
        <label for="photos">사진 선택 (최대 2개):</label>
        <input
          type="file"
          id="photos"
          @change="handlePhotoUpload"
          multiple
          accept="image/*"
        />
        <p>{{ photoCountMessage }}</p>
      </div>
  
      <div class="form-group">
        <label for="businessName">상호명 입력</label>
        <input
          type="text"
          id="businessName"
          v-model="businessName"
          placeholder="상호명을 입력하세요"
        />
      </div>
  
      <div class="form-group">
        <label for="content">본문 작성</label>
        <textarea
          id="content"
          v-model="content"
          placeholder="본문을 입력하세요"
        ></textarea>
      </div>
  
      <button @click="submitPost" class="submit-button">작성 완료</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: '',
        photos: [],
        businessName: '',
        content: '',
      };
    },
    computed: {
      photoCountMessage() {
        return `선택된 사진 수: ${this.photos.length}/2`;
      },
    },
    methods: {
      goBack() {
        this.$router.push('/main');
      },
      handlePhotoUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length > 2) {
          alert('사진은 최대 2개까지 업로드할 수 있습니다.');
          return;
        }
        this.photos = files;
      },
      submitPost() {
        if (!this.title || !this.businessName || !this.content) {
          alert('모든 필드를 작성해 주세요.');
          return;
        }
        // 작성 완료 처리 로직 추가
        alert('글 작성이 완료되었습니다!');
        this.$router.push('/main');
      },
    },
  };
  </script>
  
  <style scoped>
  .new-post-container {
    padding: 20px;
  }
  
  .back-link {
    cursor: pointer;
    color: #000;
    text-decoration: underline;
    margin-bottom: 20px;
    display: inline-block;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  textarea {
    resize: vertical;
  }
  
  .photo-upload {
    margin-bottom: 20px;
  }
  
  .submit-button {
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .submit-button:hover {
    background-color: #555;
  }
  </style>
  