'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// public 폴더 안의 사진 등을 브라우저에 제공합니다.
app.use(express.static(path.join(__dirname, 'public')));

// 화면에서 공통으로 사용할 HTML입니다.
function makePage(title, content) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <nav>
    <a href="/">홈</a> |
    <a href="/photo">사진</a> |
    <a href="/time">현재 시각</a> |
    <a href="/posts">게시글</a> |
    <a href="/about">자기소개</a>
  </nav>
  <hr>
  ${content}
</body>
</html>`;
}

// 홈
app.get('/', (req, res) => {
  res.send(makePage(
    '홈',
    '<h1>KERT 웹 백엔드 스터디</h1><p>1주차 과제입니다.</p>'
  ));
});

// 기본 과제: 사진
app.get('/photo', (req, res) => {
  res.send(makePage(
    '사진',
    `<h1>내가 선택한 사진</h1>
     <img
       src="/photo.jpg"
       alt="과제에 사용한 사진"
       style="width: 500px; max-width: 100%;"
     >`
  ));
});

// 기본 과제: 요청을 받은 시각
app.get('/time', (req, res) => {
  // 요청이 들어올 때마다 현재 시각을 새로 구합니다.
  const now = new Date();

  const timeText = now.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  res.set('Cache-Control', 'no-store');

  res.send(makePage(
    '현재 시각',
    `<h1>접속한 시각</h1>
     <p>${timeText}</p>
     <p>몇 초 뒤 새로고침하면 시각이 달라집니다.</p>`
  ));
});

// 도전 과제용 예시 게시글
const posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee' }
];

// 코드에 직접 작성한 예시 데이터를 HTML로 만듭니다.
function renderPostList(posts) {
  if (posts.length === 0) {
    return '<p>글이 없습니다</p>';
  }

  const items = posts.map((post) => {
    return `<li>[${post.id}] ${post.title} (${post.author})</li>`;
  }).join('');

  return `<ul>${items}</ul>`;
}

// 도전 과제: 게시글 목록
app.get('/posts', (req, res) => {
  res.send(makePage(
    '게시글 목록',
    `<h1>게시글 목록</h1>${renderPostList(posts)}`
  ));
});

// 도전 과제: 자기소개
app.get('/about', (req, res) => {
  res.send(makePage(
    '자기소개',
    `<h1>자기소개</h1>
     <p>안녕하세요. 김유현 입니다.</p>
     <p>KERT에서 웹 백엔드를 공부하고 있습니다.</p>`
  ));
});

// 도전 과제: 존재하지 않는 경로
// 다른 경로를 처리하는 코드보다 아래에 둡니다.
app.use((req, res) => {
  res.status(404).send(makePage(
    '404',
    '<h1>404</h1><p>페이지를 찾을 수 없습니다.</p>'
  ));
});

// 서버 실행
app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
