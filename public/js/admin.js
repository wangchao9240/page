$(() => {
  $('.del').click((e) => {
    let target = $(e.target);
    let id = target.data('id');
    let tr = $(`.item-id-${id}`);

    $.ajax({
      type: 'DELETE',
      url: `/admin/movie/list?id=${id}`,
    })
    .done((res) => {
      if (res.success === 1) {
        if (tr) {
          tr.remove();
        }
      }
    });
  });

  $('#douban').blur((e) => {
    let id = $(e.target).val();
    if (id) {
      $.ajax({
        url: 'http://api.douban.com/v2/movie/subject/' + id,
        dataType: 'jsonp',
        jsonpCallback: 'handlerResponse',
        success(res) {
          $('#inputTitle').val(res.title);
          $('#inputDirector').val(res.directors[0].name);
          $('#inputCountry').val(res.countries[0]);
          $('#inputPoster').val(res.images.medium);
          $('#inputYear').val(res.year);
          $('#inputSummary').val(res.summary);
        }
      });
    }
  });
});