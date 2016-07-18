sass --update app/assets/stylesheets:public/stylesheets

slimrb app/views/index.slim > public/views/index.html

cp -a app/assets/scripts/. public/scripts

cp -a app/assets/images/. public/images

rackup