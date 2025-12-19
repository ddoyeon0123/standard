# 🏢 스탠다드 네트웍스 웹사이트 (StandardNetworks)

HTML, CSS, jQuery를 기반으로 구축된 기업 웹사이트입니다.

## 🚀 프로젝트 개요 (Overview)
* **목적**: 기업 브랜드 가치 전달과 더불어, 고객사가 필요한 **실무 지원 서비스(정산 시스템, 민원 접수 등)에 대한 직관적이고 신속한 접근성 제공**을 최우선으로 합니다.
* **주요 기능**: 
    * 관리자 정산 시스템 외부 페이지 이동
    * 고객의 소리(VOC) 접수 및 조회 기능
    * JSON 데이터를 활용한 연혁 및 고객사 정보 동적 로드
    * 미디어 쿼리를 이용한 반응형 웹 구현

## 🛠 기술 스택 (Tech Stack)
* **Language**: HTML5, CSS3, JavaScript
* **Library**: jQuery (v3.x 이상 권장)
* **Data Storage**: JSON

## 💻 개발 환경 (Development Environment)
* **Editor**: Visual Studio Code
* **Extension**: Live Server 
* **Version Control**: Git




## 📂 전체 프로젝트 구조 (Full Project Structure)

```text
STANDARD/
├── .vscode/                # VS Code 에디터 설정 폴더
├── css/                    # 스타일시트 리소스
│   ├── about.css           # 기업 소개 페이지 전용 스타일
│   ├── business.css        # 사업 분야 페이지 전용 스타일
│   ├── common.css          # 공통 레이아웃 (GNB, Footer 등)
│   ├── reset.css           # 브라우저 기본 스타일 초기화
│   ├── responsive.css      # 미디어 쿼리 기반 반응형 스타일
│   ├── style.css           # 메인 페이지 전용 스타일
│   └── voc.css             # 고객의 소리 페이지 전용 스타일
├── file/                   # 다운로드용 문서 자산
│   └── std_company_info.pdf # 회사 소개서 PDF
├── html/                   # 서비스 페이지 마크업 (카테고리별 분리)
│   ├── about/              # [기업소개] 관련 페이지
│   │   ├── about_clients.html     # 주요 고객사
│   │   ├── about_history.html     # 기업 연혁
│   │   ├── about_location.html    # 오시는 길
│   │   ├── about_technology.html  # 기술 보유 현황
│   │   └── about_vision.html      # 기업 비전 및 가치
│   ├── business/           # [사업분야] 관련 페이지
│   │   ├── business_ai.html       # AI 상담센터 서비스
│   │   ├── business_asp.html      # ASP 서비스 (AD ON, FREE ON)
│   │   ├── business_mail.html     # 메일 서비스 (Aimer, Ammer)
│   │   └── business_mobile.html   # 모바일 서비스 (SMS, MMS, SFA)
│   ├── service/            # [서비스] 관련 페이지
│   │   └── service_submit.html    # 서비스 신청 페이지
│   └── voc/                # [문의(VOC)] 관련 페이지
│       ├── voc_check.html         # 문의 내역 확인
│       ├── voc_submit.html        # 문의 등록(작성)
│       └── voc_view.html          # 문의 상세 보기
├── img/                    # 이미지 리소스 관리
│   ├── about/              # 기업 소개용 이미지 폴더
│   ├── business/           # 사업 분야용 이미지 폴더
│   ├── footer_logo.png     # 하단 로고
│   ├── gnb_logo.png        # 상단 네비게이션 로고
│   ├── main_backgroud.jpg  # 메인 히어로 섹션 배경
│   └── main_cta_background.png # 메인 하단 CTA 섹션 배경
├── js/                     # 자바스크립트 및 라이브러리
│   └── main.js             # 전체 웹사이트 인터랙션 제어
├── json/                   # 동적 데이터 파일 (AJAX 로드용)
│   ├── clients.json        # 고객사 데이터 리스트
│   ├── history.json        # 기업 연혁 데이터 리스트
│   └── patent.json         # 특허 및 인증 데이터 리스트
├── favicon.ico             # 브라우저 탭 아이콘
└── index.html              # 웹사이트 메인 페이지

```

## 📋 폼 데이터 명세 (Form Data Specification)

`service_submit.html`에서 사용되는 모든 입력 요소의 `name` 속성 정의입니다.

| 구분 | 항목 | HTML 태그 | 설정된 name 값 |
| :--- | :--- | :--- | :--- |
| **고객 정보** | 작성자 | `input (text)` | `writer` |
| | 연락처 | `input (tel)` | `contact` |
| | 회사명 | `input (text)` | `company` |
| | 이메일 | `input (email)` | `email` |
| **신청 내용** | 모집분야 | `input (hidden)` | `service` |
| | 자료요청 | `input (checkbox)` | `request_data` |
| | 제목 | `input (text)` | `title` |
| | 내용 | `textarea` | `content` |
| **약관 동의** | 개인정보 동의 | `input (checkbox)` | `privacy_consent` |

> **모집분야 커스텀 셀렉트**: `.custom-select` 내의 `<li>` 클릭 시, 해당 요소의 `data-value`를 매핑된 `hidden input`에 자동으로 할당합니다.
