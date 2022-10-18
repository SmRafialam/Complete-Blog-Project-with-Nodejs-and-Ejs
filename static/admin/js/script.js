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
