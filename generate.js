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

// 按鈕點擊事件
document.querySelector('.next_button').addEventListener('click', function() {
    // 隱藏按鈕
    document.querySelector('.next_button').style.display = 'none';

    // 獲取圖片 URL
    var imgElement = document.querySelector('.tag_review');

    if (imgElement && imgElement.src) {
        // 使用 THREEx.ArPatternFile 生成 .patt 文件
        THREEx.ArPatternFile.encodeImageURL(imgElement.src, function(patternFileString) {
            // 觸發下載 .patt 文件
            THREEx.ArPatternFile.triggerDownload(patternFileString, 'generated-marker.patt');
        });
    }
});
