var THREEx = THREEx || {}

THREEx.ArPatternFile = {}

THREEx.ArPatternFile.encodeImageURL = function(imageURL, onComplete){
    var image = new Image;
    image.onload = function(){
        var patternFileString = THREEx.ArPatternFile.encodeImage(image)
        onComplete(patternFileString)
    }
    image.src = imageURL;
}

THREEx.ArPatternFile.encodeImage = function(image){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d')
    canvas.width = 16;
    canvas.height = 16;

    var patternFileString = ''
    for(var orientation = 0; orientation > -2*Math.PI; orientation -= Math.PI/2){
        context.save();
        context.clearRect(0,0,canvas.width,canvas.height);
        context.translate(canvas.width/2,canvas.height/2);
        context.rotate(orientation);
        context.drawImage(image, -canvas.width/2,-canvas.height/2, canvas.width, canvas.height);
        context.restore();

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        if( orientation !== 0 ) patternFileString += '\n'
        for(var channelOffset = 2; channelOffset >= 0; channelOffset--){
            for(var y = 0; y < imageData.height; y++){
                for(var x = 0; x < imageData.width; x++){
                    if( x !== 0 ) patternFileString += ' '

                    var offset = (y*imageData.width*4) + (x * 4) + channelOffset
                    var value = imageData.data[offset]

                    patternFileString += String(value).padStart(3);
                }
                patternFileString += '\n'
            }
        }
    }

    return patternFileString
}

THREEx.ArPatternFile.triggerDownload = function(patternFileString, fileName = 'pattern-marker.patt'){
    var domElement = window.document.createElement('a');
    domElement.href = window.URL.createObjectURL(new Blob([patternFileString], {type: 'text/plain'}));
    domElement.download = fileName;
    document.body.appendChild(domElement)
    domElement.click();
    document.body.removeChild(domElement)
}

document.querySelector('.next_button').addEventListener('click', function() {
    // 隱藏按鈕
    document.querySelector('.next_button').style.display = 'none';
    document.querySelectorAll('.step').forEach(function(stepElement) {
        stepElement.style.display = 'none';
    });

    // 獲取圖片 URL
    var imgElement = document.querySelector('.tag_review');

    if (imgElement && imgElement.src) {
        // 使用 THREEx.ArPatternFile 生成 .patt 文件
        THREEx.ArPatternFile.encodeImageURL(imgElement.src, function(patternFileString) {
            try {
                // 創建 .patt 文件 Blob 和 File
                const blobPatt = new Blob([patternFileString], { type: 'text/plain' });
                const pattFile = new File([blobPatt], 'generated-marker.patt', { type: 'text/plain' });
    
                // 下載圖片 Blob，生成圖片文件
                fetch(imgElement.src)
                    .then(response => response.blob())
                    .then(blobImage => {
                        const imageFile = new File([blobImage], 'marker-image.jpg', { type: blobImage.type });
    
                        // 構建 FormData 對象
                        const formData = new FormData();
                        formData.append('pattFile', pattFile); // 添加 .patt 文件
                        formData.append('imageFile', imageFile); // 添加對應圖片檔案
    
                        // 獲取影片檔案
                        const videoInput = document.querySelector('.video_upload');
                        if (videoInput && videoInput.files.length > 0) {
                            formData.append('videoFile', videoInput.files[0]);
                        }
    
                        console.log(formData); // 檢查 FormData 內容
    
                        // 使用 Fetch API 傳送至後端
                        fetch('http://127.0.0.1:5000/upload', {
                            method: 'POST',
                            body: formData
                        })
                            .then(response => {
                                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                                return response.json();
                            })
                            .then(data => {
                                console.log('Success:', data); // 處理伺服器回應
                                document.querySelector('.step#s3').style.display = 'block';
                            })
                            .catch(error => {
                                console.error('Error during upload:', error);
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                    });
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        });
    } else {
        console.warn('Image element or source is missing.');
    }
    
});
