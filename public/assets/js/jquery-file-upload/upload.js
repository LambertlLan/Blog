//表单文件上传通用组件
function ajaxHMFileUpload() {
    var body = $('body');
    body.find('.JS_upload').unbind().on('change', function () {
        var _this = $(this);
        var container = _this.closest('.form-file-upload');
        var URL = container.data('url');
        var fileType = container.data('filetype');
        var extIMG = '.jpg.jpeg.gif.bmp.png.';
        var extBP = '.pdf.ppt.pptx.';
        var extVideo = '.mp4.';
        var f = _this.val();
        f = f.substr(f.lastIndexOf('.') + 1).toLowerCase();

        if (f === '') {
            _this.val('');
            alert('请选择文件后上传');
        } else if (fileType === 'image' && extIMG.indexOf('.' + f + '.') === -1) {
            alert('图片格式不正确，仅支持 jpg、jpeg、png、gif、bmp 格式的图片');
        } else if (fileType === 'bp' && extBP.indexOf('.' + f + '.') === -1) {
            alert('文件格式不正确，仅支持 pdf、ppt、pptx 格式的文件');
        } else if (fileType === 'mp4' && extVideo.indexOf('.' + f + '.') === -1) {
            alert('视频格式不正确，仅支持 mp4 格式的视频文件');
        } else {
            $.ajaxFileUpload({
                // url: baseURL + URL,
                url: URL,
                secureuri: false,
                fileElementId: _this.attr('id'),//file标签的id
                dataType: 'json',//返回数据的类型
                success: function (data, status) {
                    console.info('File Upload Status: ' + status);
                    if (data) {
                        //展示预览区域
                        // container.addClass('exit').find('.file-preview').find('.upload-input-real').val(dat.url);
                        if (fileType !== 'image') {
                            container.addClass('file').find('.file-preview').find('img');
                            if (!container.hasClass('file')) {
                                container.addClass('file');
                            }
                        } else {
                            container.find('.file-preview').find('img').attr('src', data);
                        }
                    } else {
                        _this.val('');
                        alert('上传失败');
                    }
                },
                error: function (data, status, e) {
                    //console.log(data);
                    //console.log(status);
                    //console.log(e);
                }
            });
        }

        //重新绑定事件
        ajaxHMFileUpload();
    });

    //删除事件（将上传控件初始化）
    body.find('.JS_fileUploadDelete').unbind().on('click', function () {
        var _this = $(this);
        _this.closest('.form-file-upload').find('.file-preview').find('img').val('');
        _this.closest('.form-file-upload').find('.file-preview').find('.upload-input-real').val('');
        _this.closest('.form-file-upload').removeClass('exit').find('.file-upload');
        return false;
    });
}

$(function () {
    ajaxHMFileUpload();
});
