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




How to build and push to heroku.

First sign up for heroku (if you haven't already).
Install the Heroku Toolbelt https://toolbelt.heroku.com/
Ask Lucy to add your heroku account as a collaborator on the Findme-kakuma app.
Sign in on the command line
``heroku login``

get your git repo ready - ie build, commit, push to master etc, so you have a clean tree.

Add the Heroku git remote to your local get repository.
``heroku git:remote -a findme-kakuma``

Then deploy to Heroku by running:
``git push heroku master``

## Running ElasticSearch locally
To set up an ElasticSearch server, clone the dev tools repo from:
``git@git.thoughtworks.net:amaddiso/kakuma-local-dependencies.git``

In the local dependencies folder run:
``vagrant up``

This will provision a vagrant box and start the elastic seaerch server.
To stop the server, SSH into the vagrant box by running:
``vagrant SSH``

And stop the service with:
``sudo service elasticsearch stop``
