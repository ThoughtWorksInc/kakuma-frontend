require './app'
run MyApp


# use Rack::Static,
#   :urls => ["/stylesheets", "/scripts", "/images"],
#   :root => "public"
#
# run lambda { |env|
#   [
#     200,
#     {
#       'Content-Type'  => 'text/html',
#       'Cache-Control' => 'public, max-age=86400'
#     },
#     File.open('public/views/index.html', File::RDONLY)
#   ]
# }
