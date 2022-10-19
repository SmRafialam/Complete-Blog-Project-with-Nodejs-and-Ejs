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
  selector: 'textarea#my-expressjs-tinymce-app',
  plugins: 'lists link image table code help wordcount'
});

// $(".btn").on('click', function () {


  var checkbox_value = "";
  $(".checkbox").each(function (i,element) {
      var ischecked = $(this).is(":checked");
      if (ischecked) {
         $.ajax({
      url: '/admin/postlists/'+$(this).val(),
      type: 'GET',
      data:{boolVal:true},
      success: function(response) {
        console.log(data);
        console.log(url);
      }
      });
      }
      else{
          $.ajax({
            url: '/admin/postlists/'+$(this).val(),
            type: 'GET',
            data:{boolVal:false},
            success: function(response) {
              console.log(data);
              console.log(url);
      }
      });
    }
  });
// });