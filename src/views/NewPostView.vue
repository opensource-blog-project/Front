<template>
  <div class="new-post-container">
    <a @click="goBack" class="back-link">← 홈 화면으로 돌아가기</a>

    <div class="form-group">
      <label for="title">제목</label>
      <input type="text" id="title" v-model="localTitle" placeholder="제목을 입력하세요" />
    </div>

    <div class="photo-upload">
      <label for="photos">사진 선택 (최대 2개):</label>
      <input type="file" id="photos" @change="handlePhotoUpload" multiple accept="image/*" />
      <p>{{ photoCountMessage }}</p>
    </div>

    <div class="form-group">
      <label for="businessName">상호명 입력</label>
      <input type="text" id="businessName" v-model="localBusinessName" placeholder="상호명을 입력하세요" />
    </div>

    <div class="form-group">
      <label for="content">본문 작성</label>
      <textarea id="content" v-model="localContent" placeholder="본문을 입력하세요"></textarea>
    </div>

    <button @click="submitPost" class="submit-button">
      {{ isEditMode ? '수정 완료' : '작성 완료' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    id: {
      type: String,
      default: null, // null일 경우 새 글 작성 모드로 간주
    },
  },
  data() {
    return {
      localId:'',
      localAuthor:'',
      localTitle: '',
      localPhotos: [],
      localBusinessName: '',
      localContent: '',
    };
  },
  computed: {
    isEditMode() {
      return !!this.id; // id가 있으면 수정 모드
    },
  },
  async created() {
    if (this.isEditMode) {
      console.log('수정 모드입니다. id:', this.id);
      await this.loadPostData();
    } else {
      console.log('새 글 작성 모드입니다.');
    }
  },
  methods: {
    goBack() {
      this.$router.push('/posts');
    },
    handlePhotoUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length > 2) {
        alert('사진은 최대 2개까지 업로드할 수 있습니다.');
        return;
      }
      this.localPhotos = files;
    },
    async loadPostData() {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${this.id}`);
        console.log(response.data); // 응답 데이터 콘솔에 출력
        const post = response.data;

        this.localId = post.id;
        this.localAuthor = post.author;
        this.localTitle = post.title;
        this.localPhotos = post.images || [];
        this.localBusinessName = post.restaurant;
        this.localContent = post.content;
      } catch (error) {
        console.error('게시글 데이터를 불러오는 중 오류가 발생했습니다:', error);
        alert('게시글 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    async submitPost() {
      const formData = new FormData();
      if (this.isEditMode) {
        formData.append('id', this.localId);
      }
      formData.append('author', this.localAuthor);
      formData.append('title', this.localTitle);
      formData.append('content', this.localContent);
      formData.append('restaurant', this.localBusinessName);
      this.localPhotos.forEach((photo, index) => {
        formData.append(`images[${index}]`, photo);
      });

      const url = this.isEditMode
        ? `http://localhost:3000/posts/${this.id}` // 수정 모드일 때 URL
        : 'http://localhost:3000/posts'; // 새 글 작성 모드일 때 URL

      try {
        // PUT 요청으로 데이터 전송
        let response;
        if (this.isEditMode) {
          response = await axios.put(url, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } else {
          // POST 요청 처리
          response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        console.log('Response data:', response.data);
        alert(this.isEditMode ? '글 수정이 완료되었습니다!' : '글 작성이 완료되었습니다!');
        this.$router.push('/posts');
      } catch (error) {
        console.error('Error:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  },
};
</script>

<style scoped>
.new-post-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 12px;
  color: #fff;
  background-color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  background-color: #555;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.photo-upload {
  margin-bottom: 20px;
}

.photo-upload input {
  margin-top: 8px;
}

.photo-upload p {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
