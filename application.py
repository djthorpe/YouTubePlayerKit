#!/opt/local/bin/python2.7
# encoding: utf-8

__author__ = "djt@mutablelogic.com (David Thorpe)"

# Python imports
import sys, os, logging

# add python libraries:
#  - 'app' is for application code
#  - 'lib' for library modules
#  - 'lib3' for 3rd party modules
root_path = os.path.abspath(os.path.dirname(__file__))
code_paths = [
	os.path.join(root_path,'app'),
	os.path.join(root_path,'lib'),
	os.path.join(root_path,'lib3')
]
for path in code_paths:
	if (path not in sys.path) and os.path.exists(path): sys.path.insert(0,path)

# GAE imports
import webapp2

# app imports
from test import apihandler

# route /api/test /api/test/ and /api/test/... messages through to the apihandler
app = webapp2.WSGIApplication([
	('/api/test([\w\/]*)',apihandler.RequestHandler),
])

# add values to the registry
app.registry = {
	'debug': True
}
app.debug = app.registry['debug']
