<template>
  <div class="my-page">
    <!-- 홈 화면으로 돌아가기 버튼 -->
    <div class="new-post-container">
      <a @click="goToMainView" class="back-link"> ← 홈 화면으로 돌아가기</a>
    </div>

    <!-- 상단 제목 -->
    <header class="header">
      <h1>MY PAGE</h1>
      <p>@{{ userId }}</p>
    </header>

    <!-- 박스 리스트 -->
    <div class="box-container">
      <div v-for="(box, index) in boxes" :key="index"
           :class="['box', { 'bold-text': box.type === 'written' || box.type === 'saved', active: selectedBox === index }]"
           @click="selectBox(index)">
        <template v-if="box.icon">
          <img :src="box.icon" alt="Icon" class="icon" />
          <span>{{ box.name }}</span>
        </template>
        <template v-else>
          <span>{{ box.emoji }} {{ box.name }}</span>
        </template>
      </div>
    </div> <!-- 박스 컨테이너 닫는 태그 -->

    <!-- 전체게시판 -->
    <div class="board-title">
      <span class="red-text">전체게시판</span>
      <span class="black-text">검색결과</span>
    </div>

    <!-- 게시판 테이블 -->
    <div class="board-container">
      <table class="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th v-if="selectedBox === 1">작성자</th>
            <th v-if="selectedBox === 1">내용</th>
            <th v-else>제목</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="item.id">
            <td>{{ filteredItems.length - index }}</td>
            <td v-if="selectedBox === 1">{{ item.writer }}</td>
            <td v-if="selectedBox === 1">{{ item.content }}</td>
            <td v-else>{{ item.title }}</td>
          </tr>
        </tbody>
      </table>
    </div> 
  </div> <!-- 모달 및 루트 my-page 닫는 태그 -->
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import storeIcon from "@/assets/storeicon.png";
import bookmarkIcon from "@/assets/bookmarkicon.png";

export default {
  props: {
    currentUser: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const userId = ref(props.currentUser || ''); // currentUser를 userId로 매핑
    const selectedBox = ref(0); // 첫 번째 박스를 기본 선택

    // 박스 데이터
    const boxes = ref([
      { name: "내가 작성한 글", type: "written", icon: storeIcon },
      { name: "내가 쓴 댓글", type: "comments", icon: "", emoji: "✍", },
      { name: "내가 좋아요 누른 글", type: "liked", icon: "", emoji: "🩷", },
      { name: "내가 저장한 글", type: "saved", icon: bookmarkIcon },
    ]);

    // 게시물 데이터
    const items = ref([]);

    // 현재 선택된 박스의 타입에 맞게 게시물을 필터링
    const filteredItems = computed(() =>
      items.value.filter(item => {
        if (selectedBox.value === null) return []; // 박스가 선택되지 않은 경우 빈 배열 반환
        return item.type === boxes.value[selectedBox.value].type;
      })
    );

    // 박스 선택 함수
    const selectBox = index => {
      selectedBox.value = index;
      loadData(); // 박스를 선택할 때마다 해당하는 데이터 불러오기
    };

    // 홈으로 이동
    const goToMainView = () => {
      router.push("/posts"); // 라우터를 사용하여 메인 화면으로 이동
    };

    // API 호출 함수
    const loadData = async () => {
      try {
        let response;
        switch (selectedBox.value) {
          case 0: // 내가 작성한 글
            response = await axios.get('http://localhost:8080/mypage/my-posts', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
            items.value = response.data.map(item => ({
              ...item,
              type: 'written',
            }));
            break;
          case 1: // 내가 쓴 댓글
            response = await axios.get('http://localhost:8080/mypage/my-comments', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
            items.value = response.data.map(comment => ({
              id: comment.commentId,
              writer: comment.commentWriter,
              content: comment.content,
              type: 'comments',
            }));
            break;
          case 2: // 내가 좋아요 누른 글
            response = await axios.get('http://localhost:8080/mypage/liked-posts', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
            items.value = response.data.map(item => ({
              ...item,
              type: 'liked',
            }));
            break;
          case 3: // 내가 저장한 글
            response = await axios.get('http://localhost:8080/mypage/saved-posts', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
            items.value = response.data.map(item => ({
              ...item,
              type: 'saved',
            }));
            break;
          default:
            items.value = [];
        }
        console.log("Filtered Items After Load:", filteredItems.value);
      } catch (error) {
        console.error("데이터를 불러오는 데 오류가 발생했습니다.", error);
      }
    };

    // 컴포넌트가 마운트될 때 데이터 불러오기
    onMounted(() => {
      loadData();
    });

    return {
      userId,
      boxes,
      items,
      selectedBox,
      filteredItems,
      selectBox,
      goToMainView,
    };
  },
};
</script>

<style scoped>
  .my-page {
    width: 100%; /* 브라우저 전체 너비 */
    max-width: 1200px;
    min-height: 100vh; /* 브라우저 높이와 동일하거나 그 이상 */
    display: flex;
    flex-direction: column;
    margin: auto;
    font-family: Arial, sans-serif;
  }
  
  .new-post-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }
  
  .back-link {
    font-size: 14px;
    cursor: pointer;
    color: #000;
    text-decoration: none;
    right: 10px;
  }
  
  .back-link:hover {
    text-decoration: underline;
    color: #000;
  }
  
  .header {
    text-align: center;
    margin-top: 40px;
    margin-bottom: 0;
    font-family: "Georgia", serif;
    font-size: 36px;
    font-weight: bold;
  }
  
  .header p {
    font-size: 30px;
    margin-top: -10px;
  }
  
  /* 박스 컨테이너 */
  .box-container {
    width: 100%;
    max-width: 1200px; /* 최대 너비 설정 */
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px auto; /* 가운데 정렬 */
    padding: 10px; /* 패딩 추가 */
  }
  
  .box {
    flex: 1 0 200px;
    max-width: 1200px;
    padding: 15px;
    margin: 20px auto;
    text-align: center;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: normal; /* 기본적으로 글씨 두께는 normal */
  }
  
  /* 특정 박스만 글씨 두껍게 */
  .box.bold-text {
    font-weight: bold; /* 글씨 두께를 bold로 설정 */
  }
  
  .box.active {
    background-color: #000;
    color: white;
    font-weight: bold;
  }
  
  .box:hover {
    background-color: #d0d0d0;
  }
  
  /* 보드 타이틀 */
  .board-title {
    width: 100%; /* 너비 100% */
    max-width: 1200px; /* 최대 너비 설정 */
    margin: 20px auto; /* 상하 마진은 20px, 좌우 마진은 자동 */
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .red-text {
    color: red;
    font-weight: bold;
    font-size: 20px;
  
  }
  
  .black-text {
    color: black;
    font-size: 19px;
  }
  
  .delete-button {
    margin-left: auto;
    background: none;
    border: none;
    color: black;
    font-size: 16px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    color: red;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    object-fit: contain;
  }
  
  .box span {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
  }
  
  /* 박스 컨테이너 */
  .box-container {
    width: 100%;
    max-width: 1200px; /* 최대 너비 설정 */
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px auto; /* 가운데 정렬 */
    padding: 10px; /* 패딩 추가 */
  }
  
  
  
  .board-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    
  }
  
  .board-table th,
  .board-table td {
    border: 1px solid #ddd;
    padding: 12px;
    line-height: 1.5;
    font-size: 14px;
    vertical-align: middle;
    text-align: center; /* 가운데 정렬 추가 */
  }
  
  .board-table th:nth-child(1),
  .board-table td:nth-child(1) {
    width: 5%;
  }
  
  .board-table th:nth-child(2),
  .board-table td:nth-child(2) {
    width: 10%;
  }
  
  .board-table th:nth-child(3),
  .board-table td:nth-child(3) {
    width: 70%;
  }
  
  .board-table th {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  
  .image-button {
    display: flex;
    align-items: center;
    background-color: #000;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .image-button .icon {
    width: 20px; /* 아이콘 크기 조절 */
    height: 20px; /* 아이콘 크기 조절 */
    margin-right: 10px; /* 아이콘과 텍스트 간격 */
  }
  
  /* 기존 박스 스타일 유지, 활성화 시 아이콘 색상 변경 */
  .box.active .icon {
    filter: invert(100%); /* 색상을 반전 */
  }
  
  .board-table th,
  .board-table td {
    text-align: center;
    padding: 8px;
  }

  .board-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

</style>