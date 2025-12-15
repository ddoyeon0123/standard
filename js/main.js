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