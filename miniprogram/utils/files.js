// 文件大小格式化
function formatFileSize(fileSize) {
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024 * 1024)) {
    var temp = fileSize / 1024;
    temp = temp.toFixed(2);
    return temp + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    var temp = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'MB';
  } else {
    var temp = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'GB';
  }
}

exports.formatFileSize = formatFileSize;

// 文件类型判断
var imgExt = new Array("dib", "jpeg", "webp", "svgz", "gif", "jpg", "ico", "png", "svg", "tif", "xbm", "bmp", "jfif", "pjpeg", "pjp", "tiff"); //图片文件的后缀名
var docExt = new Array("doc", "docx"); //word文件的后缀名
var xlsExt = new Array("xls", "xlsx"); //excel文件的后缀名
var pptExt = new Array("ppt", "pptx"); //ppt文件的后缀名
var zipExt = new Array("zip", "rar", "7z", "gz"); //压缩文件的后缀名
var musicExt = new Array("mp3", "wav", "aac", "flac"); //压缩文件的后缀名
var videoExt = new Array("mp4", "avi","ogv","mpeg","wmv","mov","ogm","webm","asx","mpg"); //视频文件的后缀名
var txtExt = "txt"
var pdfExt = 'pdf'

function typeJudge(fileName) {
  //获取最后一个.的位置
  var index = fileName.lastIndexOf(".")
  //获取后缀
  var ext = fileName.substr(index + 1);

  for (let item of imgExt) {
    if (ext == item) {
      return 'image'
    }
  }
  for (let item of docExt) {
    if (ext == item) {
      return 'doc'
    }
  }
  for (let item of xlsExt) {
    if (ext == item) {
      return 'xls'
    }
  }
  for (let item of pptExt) {
    if (ext == item) {
      return 'ppt'
    }
  }
  for (let item of zipExt) {
    if (ext == item) {
      return 'zip'
    }
  }
  for (let item of musicExt) {
    if (ext == item) {
      return 'music'
    }
  }
  for (let item of videoExt) {
    if (ext == item) {
      return 'video'
    }
  }
  if (ext == txtExt) {
    return 'txt'
  } else if (ext == pdfExt) {
    return 'pdf'
  } else {
    return 'unknown'
  }

}

exports.typeJudge = typeJudge;