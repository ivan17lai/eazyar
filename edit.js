document.addEventListener('DOMContentLoaded', function() {
    const tagUploadInput = document.querySelector('.tag_upload');
    const tagUploadButton = document.querySelector('.upload_button');
    const tagReview = document.querySelector('.tag_review');
    const videoUploadInput = document.querySelector('.video_upload');
    const videoUploadButton = document.querySelectorAll('.upload_button')[1];
    const videoReview = document.querySelector('.video_review');
    const nextButton = document.querySelector('.next_button');

    function checkFilesSelected() {
        if (tagUploadInput.files.length > 0 && videoUploadInput.files.length > 0) {
            nextButton.style.display = 'block';
        } else {
            nextButton.style.display = 'none';
        }
    }

    tagUploadInput.addEventListener('change', function() {
        if (tagUploadInput.files && tagUploadInput.files[0]) {
            const fileName = tagUploadInput.files[0].name;
            tagUploadButton.textContent = fileName;

            const reader = new FileReader();
            reader.onload = function(e) {
                tagReview.src = e.target.result;
                tagReview.style.display = 'block';
            };
            reader.readAsDataURL(tagUploadInput.files[0]);
        }
        checkFilesSelected();
    });

    videoUploadInput.addEventListener('change', function() {
        if (videoUploadInput.files && videoUploadInput.files[0]) {
            const fileName = videoUploadInput.files[0].name;
            videoUploadButton.textContent = fileName;

            const reader = new FileReader();
            reader.onload = function(e) {
                videoReview.src = e.target.result;
                videoReview.style.display = 'block';
                videoReview.controls = true;
            };
            reader.readAsDataURL(videoUploadInput.files[0]);
        }
        checkFilesSelected();
    });
});