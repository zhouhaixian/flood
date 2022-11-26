# flood

短信之洪水

## 环境依赖

- ImageMagick
- Tesseract-OCR

**在 Linux ( Ubuntu ) 下安装**:

```bash
sudo apt-get install imagemagick
sudo apt-get install tesseract-ocr
```

**在 Windows 下安装**:

ImageMagick: [安装包](https://imagemagick.org/script/download.php#:~:text=an%20iOS%20application.-,Windows%20Binary%20Release,-ImageMagick%20runs%20on)

Tesseract-OCR: [安装包](https://github.com/UB-Mannheim/tesseract/wiki#tesseract-installer-for-windows)

## 构建可执行文件

**由于用于识别验证码的依赖库 `gm` 和 `tesseract.js` 依赖于上述环境依赖，故构建出来的可执行文件只有在已安装上述环境依赖的系统上才能识别验证码**
