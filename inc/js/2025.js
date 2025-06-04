$(document).ready(function () {
  //select
  $('select').niceSelect();

  //tab
  const tabs = document.querySelectorAll('.ne-tabs-item');
  const contents = document.querySelectorAll('.ne-tabs-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // 모든 탭과 컨텐츠에서 active 제거
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      // 클릭한 탭과 해당 컨텐츠에 active 추가
      tab.classList.add('active');
      document
        .getElementById(tab.getAttribute('data-tab'))
        .classList.add('active');
    });
  });
});
