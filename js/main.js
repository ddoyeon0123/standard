document.addEventListener('DOMContentLoaded', function() {
    const familySiteWrapper = document.querySelector('.footer-family-site');
    const button = familySiteWrapper.querySelector('.family-site-button');

    button.addEventListener('click', function() {
        familySiteWrapper.classList.toggle('is-open');

        const isExpanded = button.getAttribute('aria-expanded') === 'true' || false;
        button.setAttribute('aria-expanded', !isExpanded);
    });

    // 밖을 클릭하면 메뉴 닫기
    document.addEventListener('click', function(event) {
        if (!familySiteWrapper.contains(event.target)) {
            familySiteWrapper.classList.remove('is-open');
            button.setAttribute('aria-expanded', 'false');
        }
    });
});