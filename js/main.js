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
// 유효성 검사 (VOC/서비스 통합 로직)
// -------------------

$(document).ready(function() {
    
    // 모달 팝업 표시 함수
    function showModal(title, message, fieldId) {
        $('#alert-modal .modal-title').text(title);
        $('#alert-modal .modal-message').text(message);
        $('#alert-modal').css('display', 'flex'); 

        $('#modal-confirm-btn').off('click').on('click', function() {
            $('#alert-modal').css('display', 'none'); 
            if (fieldId) {
                const $field = $('#' + fieldId);
                if ($field.length && $field.is(':visible') && fieldId !== 'privacy-agree') {
                    $field.focus();
                } else if (fieldId === 'privacy-agree') {
                    $('[for="privacy-agree"]').focus();
                }
            }
        });
    }

    // 현재 페이지 URL을 기반으로 페이지 종류 확인
    const currentPath = window.location.pathname;
    const isVocSubmitPage = currentPath.includes('voc_submit.html'); 
    const isVocCheckPage = currentPath.includes('voc_check.html');   
    const isServicePage = currentPath.includes('service_submit.html') || document.title.includes('서비스 신청하기');
    
    let requiredFields = [];

    // ===================================
    // 1. 페이지별 필수 필드 정의 및 이벤트 설정
    // ===================================

    if (isVocSubmitPage) {
        requiredFields = [
            { id: 'writer', message: '작성자 이름을 입력해주세요.' },
            { id: 'contact', message: '연락처를 입력해주세요.' },
            { id: 'password', message: '비밀번호를 입력해주세요.' },
            { id: 'title', message: '제목을 입력해주세요.' },
            { id: 'content', message: '문의 내용을 입력해주세요.' },
            { id: 'email', message: '이메일 주소를 입력해주세요.' }
        ];
    } else if (isVocCheckPage) {
        requiredFields = [
            { id: 'postNumber', message: '게시글 번호를 입력해주세요.' },
            { id: 'contact', message: '연락처를 입력해주세요.' },
            { id: 'password', message: '비밀번호를 입력해주세요.' }
        ];
    } else if (isServicePage) {
        requiredFields = [
            { id: 'writer', message: '작성자 이름을 입력해주세요.' },
            { id: 'contact', message: '연락처를 입력해주세요.' },
            { id: 'company', message: '회사명을 입력해주세요.' },
            { id: 'email', message: '이메일 주소를 입력해주세요.' },
            { id: 'service-value', message: '모집분야를 선택해주세요.' },
            { id: 'title', message: '제목을 입력해주세요.' },
            { id: 'content', message: '문의 내용을 입력해주세요.' }
        ];
    }

    // 1-1. 공통 입력 필터링 및 길이 제한 
    if (isVocSubmitPage || isVocCheckPage || isServicePage) {
        $('#contact').on('input', function() {
            var sanitizedValue = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(sanitizedValue);
        });
    }

    if (isVocSubmitPage || isServicePage) {
        $('#content').on('input', function() {
            var maxLength = 800;
            if ($(this).val().length > maxLength) {
                $(this).val($(this).val().substring(0, maxLength));
            }
        });
    }


    // ===================================
    // 2. 폼 제출 시 유효성 검사 (공통 로직)
    // ===================================
    
    if (requiredFields.length > 0) {
        $('.voc-form').on('submit', function(event) {
            event.preventDefault();

            // 2-1. 필수 항목 누락 검사
            for (var i = 0; i < requiredFields.length; i++) {
                var field = requiredFields[i];
                var fieldValue = $('#' + field.id).val();
                
                // 드롭다운의 초기 값 ('') 검사
                if (field.id === 'service-value' && (!fieldValue || fieldValue.trim() === '')) {
                    showModal('필수 항목 누락', field.message, field.id);
                    return false;
                }

                if (field.id !== 'service-value' && (!fieldValue || fieldValue.trim() === '')) {
                    showModal('필수 항목 누락', field.message, field.id);
                    return false;
                }
            }

            showModal('조회 완료', '요청하신 민원 접수 내역을 찾았습니다.\n조회 결과 페이지로 이동합니다.', null);
            $('#modal-confirm-btn').on('click', function() {
                window.location.href = './voc_view.html'; 
            });
            
            // 2-2. 페이지별 추가 검사 
            if (isVocSubmitPage || isServicePage) {
                
                // 이메일 형식 검사 
                var emailInput = $('#email');
                var emailValue = emailInput.val();
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

                if (!emailRegex.test(emailValue)) {
                    showModal('입력 오류', '이메일 주소를 올바른 형식으로 입력해주세요.', 'email');
                    return false;
                }

                if (isServicePage) {
                    if (!$('#privacy-agree').prop('checked')) {
                        showModal('필수 항목 미동의', '개인정보 이용약관에 동의하지 않았습니다.', 'privacy-agree');
                        return false;
                    }
                }
            }
            
            // 2-3. 모든 검사 통과 시 최종 성공 메시지 분기
            if (isVocSubmitPage) {
                // 민원 접수 페이지 성공 메시지 
                showModal(
                    '민원 접수', 
                    '고객님의 민원이 정상적으로\n등록되었습니다.', 
                    null
                );
            } else if (isServicePage) {
                // 서비스 신청 페이지 성공 메시지
                showModal(
                    '신청 접수', 
                    '고객님의 서비스 이용 및 상담 신청이\n정상적으로 전송되었습니다.', 
                    null
                );
            }
            
            // 실제 서버에 폼을 전송하려면 아래 주석을 해제
            // this.submit(); 
        });
    }
});

// -------------------
// 드롭다운 메뉴 
// -------------------

$(document).ready(function() {
    const $customSelect = $('.custom-select');

    // 1. 드롭다운 토글 기능
    $customSelect.find('.select-display').on('click', function() {
        const $parent = $(this).closest('.custom-select');
        $parent.toggleClass('is-open');
    });

    // 2. 항목 선택 시 값 업데이트 및 드롭다운 닫기
    $customSelect.find('.select-options li').on('click', function() {
        const $li = $(this);
        const selectedText = $li.text();
        const selectedValue = $li.data('value');
        const $parent = $li.closest('.custom-select');

        // 선택된 항목 클래스 업데이트
        $parent.find('.select-options li').removeClass('selected');
        $li.addClass('selected');

        // 화면에 표시되는 값과 숨겨진 input 값 업데이트
        $parent.find('.selected-value').text(selectedText);
        $parent.find('input[type="hidden"]').val(selectedValue);

        // 드롭다운 닫기
        $parent.removeClass('is-open');
    });

    // 3. 외부 클릭 시 드롭다운 닫기
    $(document).on('click', function(e) {
        if (!$customSelect.is(e.target) && $customSelect.has(e.target).length === 0) {
            $customSelect.removeClass('is-open');
        }
    });

    // 4. 초기 값 설정
    $customSelect.each(function() {
        // 초기 값으로 첫 번째 항목의 텍스트와 값을 설정
        const $firstItem = $(this).find('.select-options li:first');
        if ($firstItem.length) {
            const initialText = $firstItem.text();
            const initialValue = $firstItem.data('value');
            
            $(this).find('.selected-value').text(initialText);
            $(this).find('input[type="hidden"]').val(initialValue);
            // 첫 번째 항목에 'selected' 클래스 추가 
            $firstItem.addClass('selected'); 
        }
    });
});

// -------------------
// 드롭다운 메뉴
// -------------------


$(document).ready(function() {
    const $customSelect = $('.custom-select');

    // 1. 드롭다운 토글 기능
    $customSelect.find('.select-display').on('click', function() {
        // 현재 드롭다운의 is-open 클래스 토글
        const $parent = $(this).closest('.custom-select');
        $parent.toggleClass('is-open');
    });

    // 2. 항목 선택 시 값 업데이트 및 드롭다운 닫기
    $customSelect.find('.select-options li').on('click', function() {
        const $li = $(this);
        const selectedText = $li.text();
        const selectedValue = $li.data('value');
        const $parent = $li.closest('.custom-select');

        // 선택된 항목 클래스 업데이트
        $parent.find('.select-options li').removeClass('selected');
        $li.addClass('selected');

        // 화면에 표시되는 값과 숨겨진 input 값 업데이트
        $parent.find('.selected-value').text(selectedText);
        $parent.find('input[type="hidden"]').val(selectedValue);

        // 드롭다운 닫기
        $parent.removeClass('is-open');
    });

    // 3. 외부 클릭 시 드롭다운 닫기
    $(document).on('click', function(e) {
        if (!$customSelect.is(e.target) && $customSelect.has(e.target).length === 0) {
            $customSelect.removeClass('is-open');
        }
    });

    // 초기 값 설정
    $customSelect.each(function() {
        const $firstItem = $(this).find('.select-options li:first');
        if ($firstItem.length) {
            const initialText = $firstItem.text();
            const initialValue = $firstItem.data('value');
            
            $(this).find('.selected-value').text(initialText);
            $(this).find('input[type="hidden"]').val(initialValue);
            $firstItem.addClass('selected');
        }
    });
});


// -------------------
// 연혁 탭 이동
// -------------------


$('.history-tabs li').click(function() {
    const tabId = $(this).attr('data-tab');

    // 탭 메뉴 활성화 변경
    $('.history-tabs li').removeClass('active');
    $(this).addClass('active');

    // 컨텐츠 전환
    $('.history-tab-content').removeClass('active');
    $('#' + tabId).addClass('active');
});


// -------------------
// 연혁 데이터 불러오기
// -------------------

$(document).ready(function () {
    $.getJSON('../../json/history.json', function (data) {

        function renderHistory(tabId) {
            const tabData = data.find(item => item.category === tabId);
            const $container = $('#' + tabId); 
            if (!tabData) return;

            let html = '';
            tabData.years.forEach(item => {
                html += `
                    <div class="history-row">
                        <div class="history-year">${item.year}</div>
                        <ul class="history-list">
                            ${item.list.map(entry => `
                                <li>
                                    <span>${entry.month}</span>
                                    <div class="history-desc">
                                        ${entry.text.map(t => `<p>${t}</p>`).join('')}
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;
            });
            
            $container.html(html);
        }
        renderHistory('tab1');

        $('.history-tabs li').on('click', function () {
            const tabId = $(this).attr('data-tab');
            
            $('.history-tabs li').removeClass('active');
            $(this).addClass('active');
            $('.history-tab-content').removeClass('active');
            $('#' + tabId).addClass('active');
            renderHistory(tabId);
        });
    }).fail(function() {
        console.error("JSON 파일을 불러오는 데 실패했습니다.");
    });
});

// -------------------
// 보유 기술 데이터 불러오기
// -------------------

$(document).ready(function () {
    $.getJSON('../../json/patent.json', function (data) {
        let html = '';
        data.forEach(item => {
            html += `
                <div class="history-row">
                    <div class="history-year">${item.year}</div>
                    <ul class="history-list">
                        ${item.list.map(text => `
                            <li>
                                <div class="history-desc">
                                    <p>${text}</p>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>`;
        });
        $('#patent-container').html(html);
    });
});

// -------------------
// 고객사 데이터 불러오기
// -------------------

$(document).ready(function () {
    $.getJSON('../../json/clients.json', function (data) {
        let html = '';

        data.forEach(section => {
            html += `
                <section class="client-section">
                    <h2 class="section-title">${section.category}</h2>
                    <div class="client-grid">
                        ${section.list.map(client => `
                            <div class="client-item ${client.isActive ? 'active' : ''}">
                                <img src="../../img/about/${client.img}" alt="${client.name}">
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        });

        $('#client-data-container').html(html);
    }).fail(function() {
        console.error("고객사 데이터를 불러오는 데 실패했습니다.");
    });
});

// -------------------
// 모바일 페이지 nav
// -------------------

$('.mobile-tabs li').click(function() {
    const tabId = $(this).attr('data-tab');

    // 탭 메뉴 활성화 변경
    $('.mobile-tabs li').removeClass('active');
    $(this).addClass('active');

    // 컨텐츠 전환
    $('.mobile-tab-content').removeClass('active');
    $('#' + tabId).addClass('active');
});