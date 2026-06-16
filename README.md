# ivyxiangyu.github.io

蒋翔宇 (Xiangyu Jiang) 的个人学术主页，纯静态 HTML，部署在 GitHub Pages。

线上地址：https://ivyxiangyu.github.io

## 文件说明
- `index.html`：主页全部内容（已内嵌样式与明暗主题切换，单文件即可运行）。
- `.nojekyll`：让 GitHub Pages 跳过 Jekyll 构建，直接按静态文件提供。
- `assets/profile.jpg`：头像（可选）。不放也行，主页会自动显示 “XJ” 圆形占位。
- `cv.pdf`：你的简历 PDF（导航栏 CV 链接指向它）。把英文版简历导出成 `cv.pdf` 放到本目录即可。

## 部署步骤（一次性）
1. 在 GitHub 用 **ivyxiangyu** 这个账号登录（用户名必须是 ivyxiangyu，否则域名对不上）。
2. 新建一个公开仓库，名字必须正好是 `ivyxiangyu.github.io`。
3. 把本文件夹里的所有文件上传/推送到该仓库的根目录（`main` 分支）。

   命令行方式：
   ```bash
   cd ivyxiangyu.github.io
   git init
   git add .
   git commit -m "init academic homepage"
   git branch -M main
   git remote add origin https://github.com/ivyxiangyu/ivyxiangyu.github.io.git
   git push -u origin main
   ```
4. 进入仓库 Settings → Pages，Source 选择 `Deploy from a branch`，分支选 `main`、目录 `/ (root)`，保存。
5. 等 1 到 2 分钟，访问 https://ivyxiangyu.github.io 即可。申请表的“个人主页”就填这个地址。

## 提交前可补充（可选）
- 把导航栏头像换成真实照片：放一张 `assets/profile.jpg`。
- 把 `index.html` 里 Google Scholar 的链接换成你真实的 Scholar 主页；没有就删掉那一行。
- 如果有 OpenReview / 论文 PDF / 代码仓库链接，可在对应论文标题处加超链接。
- 放一份 `cv.pdf`，导航栏的 CV 才点得开。
