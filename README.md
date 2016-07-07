Copyright (c) 2016 ThoughtWorks, Inc. All rights reserved.

#Find me in Kakuma

Front-end code used for user testing.

Install all the ruby gems:
``bundle install``

To compile the slim files from the project root:
``slimrb app/views/index.slim > public/views/index.html``

To compile SASS and Slim files to the public folder, run:
``./go.sh``

To watch the sass files, run:
``sass --watch app/assets/stylesheets:public/stylesheets``

To start the server:
``rackup``

Go to localhost:9292
