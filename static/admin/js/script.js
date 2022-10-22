const { post } = require("../../../routes/router");

(function($) {

	"use strict";

	 $(document).ready(function() {
        $('#multiple-checkboxes').multiselect({
          includeSelectAllOption: true,
        });
        // $("#table").DataTable({
        //   order: [0, 'desc']
        // });
        
    });
})(jQuery);

tinymce.init({
  selector: 'textarea#myTextarea',
  plugins: [
    'advlist autolink link image lists charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
    'table emoticons template paste help'
  ],
  toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
    'forecolor backcolor emoticons | help',
  menu: {
    favs: {title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons'}
  },
  menubar: 'favs file edit view insert format tools table help',
  content_css: 'css/content.css',
    setup: function (editor) {
      editor.on('init', function (e) {
        editor.setContent(localStorage.getItem("myContent"));
      });
    }
  
});




// plugins: [
//     'advlist autolink link image lists charmap print preview hr anchor pagebreak',
//     'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
//     'table emoticons template paste help'
//   ],
//   toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
//     'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
//     'forecolor backcolor emoticons | help',
//   menu: {
//     favs: {title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons'}
//   },
//   menubar: 'favs file edit view insert format tools table help',
//   content_css: 'css/content.css'

