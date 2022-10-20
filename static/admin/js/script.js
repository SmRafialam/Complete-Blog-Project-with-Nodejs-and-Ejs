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
  selector: 'textarea#my-expressjs-tinymce-app',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  tinycomments_mode: 'embedded',
  tinycomments_author: 'Author name',
  mergetags_list: [
    { value: 'First.Name', title: 'First Name' },
    { value: 'Email', title: 'Email' },
  ]
});


function doComment(form){
  $.ajax({
    url: "/do-comment",
    method: "post",
    data: {name: form.name.value , email: form.email.value , comment:form.comment.value,
          post_id: form.post_id.value},
    success: function(response){
      alert(response);
    }      
  })
}
