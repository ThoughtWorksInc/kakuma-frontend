sass --update app/assets/stylesheets:public/stylesheets

slimrb app/views/index.slim > public/views/index.html

cp -a app/assets/scripts/. public/scripts
