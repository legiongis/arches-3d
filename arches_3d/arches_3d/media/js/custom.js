var displayData, getUrl, ready;

getUrl = function (url) {
  return $.getJSON(url, {
    callback: '',
    jsonp: '',
    format: 'json'
  }).done(function (data) {
    displayData(data);
  });
};


displayData = function (data) {
  $.each(data.results, function (i, model) {
    var height, html, width;
    if (model.isPrintable !== true) {
      width = "100%";
      height = "75%";
      html = "<div class=\"col-md-4 sketchfab-gallery-item nopadding\">\n<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://sketchfab.com/models/" + model['uid'] + "/embed\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" onmousewheel=\"\"></iframe>\n<p style=\"font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;\">\n  <a href=\"https://sketchfab.com/models/" + model['uid'] + "?utm_source=oembed&utm_medium=embed&utm_campaign=" + model['uid'] + "\" target=\"_blank\" style=\"font-weight: bold; color: #1CAAD9;\">" + model['name'] + "</a>\n</p>\n</div>";
      $('#gallery').append(html);
      return;
    }
  });
};

ready = function () {
  if ($('#gallery').length) {
    return getUrl('https://api.sketchfab.com/v3/models?user=GlobalDigitalHeritage&count=6&sort_by=-publishedAt');
    $.HSCore.components.HSCubeportfolio.init('.sketchfabgallery');
  } else {
    console.log('no gallery, so no models to load');
  }
};

$(document).ready(ready);
$(document).on('page:load', ready);
