$(() => {
  $('.del').click((e) => {
    let target = $(e.target);
    let id = target.data('id');
    let tr = $(`.item-id-${id}`);

    $.ajax({
      type: 'DELETE',
      url: `/admin/user/list?id=${id}`,
    })
    .done((res) => {
      console.log(res);
      if (res.success === 1) {
        if (tr) {
          tr.remove();
        }
      }
    });
  });
});