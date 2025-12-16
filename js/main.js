$(function() { 
    // -----------------
    // family site 메뉴 기능
    // -----------------
    const $familySiteWrapper = $('.footer-family-site');
    const $button = $familySiteWrapper.find('.family-site-button');

    // 1. 버튼 클릭 이벤트
    $button.on('click', function() {
        $familySiteWrapper.toggleClass('is-open');
        
        // aria-expanded 상태를 토글
        const isExpanded = $button.attr('aria-expanded') === 'true';
        $button.attr('aria-expanded', !isExpanded);
    });

    // 2. 메뉴 외부 클릭 시 닫기
    $(document).on('click', function(event) {
        // 클릭된 요소가 Family Site 영역 안에 속하지 않는다면
        if (!$(event.target).closest('.footer-family-site').length) {
            $familySiteWrapper.removeClass('is-open');
            $button.attr('aria-expanded', 'false');
        }
    });

    // -------------------
    // Top 버튼 기능
    // -------------------
    const $scrollButton = $('#scrollToTopBtn');
    
    // 버튼 요소가 존재할 경우에만 실행
    if ($scrollButton.length) {
        // 1. 스크롤 위치 감지 (버튼 표시/숨김)
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 300) {
                $scrollButton.addClass('is-visible');
            } else {
                $scrollButton.removeClass('is-visible');
            }
        });

        // 2. 버튼 클릭 시 맨 위로 이동
        $scrollButton.on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 300);
        });
    }
});



// -------------------
// 유효성 검사
// -------------------

$(document).ready(function() {
    function showModal(title, message, fieldId) {
        $('#alert-modal .modal-title').text(title);
        $('#alert-modal .modal-message').text(message);
        $('#alert-modal').css('display', 'flex'); 

        $('#modal-confirm-btn').off('click').on('click', function() {
            $('#alert-modal').css('display', 'none'); 
            if (fieldId) {
                $('#' + fieldId).focus();
            }
        });
    }

    // 현재 페이지가 'voc_submit.html' 접수 페이지인지, 조회 페이지인지 확인
    const currentPath = window.location.pathname;
    const isSubmitPage = currentPath.includes('voc_submit.html');
    const isCheckPage = currentPath.includes('voc_check.html');
    
    let requiredFields = [];

    if (isSubmitPage) {
        // 민원 접수 페이지 필드 목록
        requiredFields = [
            { id: 'writer', message: '작성자 이름을 입력해주세요.' },
            { id: 'contact', message: '연락처를 입력해주세요.' },
            { id: 'password', message: '비밀번호를 입력해주세요.' },
            { id: 'title', message: '제목을 입력해주세요.' },
            { id: 'content', message: '문의 내용을 입력해주세요.' },
            { id: 'email', message: '이메일 주소를 입력해주세요.' }
        ];

        // 1. 연락처 필터링 
        $('#contact').on('input', function() {
            var sanitizedValue = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(sanitizedValue);
        });

        // 2. 문의 내용 800자 제한
        $('#content').on('input', function() {
            var maxLength = 800;
            var currentLength = $(this).val().length;
            if (currentLength > maxLength) {
                $(this).val($(this).val().substring(0, maxLength));
            }
        });

    } else if (isCheckPage) {
        // 민원 조회 페이지 필드 목록
        requiredFields = [
            { id: 'postNumber', message: '게시글 번호를 입력해주세요.' },
            { id: 'contact', message: '연락처를 입력해주세요.' },
            { id: 'password', message: '비밀번호를 입력해주세요.' }
        ];

        // 1. 연락처 필터링
        $('#contact').on('input', function() {
            var sanitizedValue = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(sanitizedValue);
        });
        
    }

    // 3. 폼 제출 시 유효성 검사 (공통 로직)
    $('.voc-form').on('submit', function(event) {
        event.preventDefault();

        // 필수 항목 누락 검사
        for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            var fieldValue = $('#' + field.id).val();
            if (!fieldValue || fieldValue.trim() === '') {
                showModal('필수 항목 누락', field.message, field.id);
                return false;
            }
        }
        
        // 이메일 형식 검사
        if (isSubmitPage) {
            var emailInput = $('#email');
            var emailValue = emailInput.val();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

            if (!emailRegex.test(emailValue)) {
                showModal('입력 오류', '이메일 주소를 올바른 형식으로 입력해주세요.', 'email');
                return false;
            }
        }

        this.submit();
    });
});