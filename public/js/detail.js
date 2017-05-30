$(() => {
  $('.comment').click((e) => {
    let target = $(e.target);
    let toId = target.data('tid');
    let commentId = target.data('cid');

    if ($('.tidIpt').length !== 0) {
      $('.tidIpt').val(toId);
      $('.cidIpt').val(commentId);
    } else {
      $('<input class="tidIpt">').attr({
        type: 'hidden',
        name: 'comment[tid]',
        value: toId
      }).appendTo('#commentForm');

      $('<input class="cidIpt">').attr({
        type: 'hidden',
        name: 'comment[cid]',
        value: commentId
      }).appendTo('#commentForm');
    }
  });
});