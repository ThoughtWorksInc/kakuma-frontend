sass --update app/assets/stylesheets:public/stylesheets

browserify app/javascripts/main.js -o public/main.js -d

cp -a app/javascripts/. public/scripts

cp -a app/assets/images/. public/images
