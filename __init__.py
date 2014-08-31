import cherrypy
from mako.lookup import TemplateLookup
import json

class Timer(object):

    @cherrypy.expose
    def index(self, **kwargs):
        return render('timerlist.mako.html')

root = Timer()

def render(templateFileName,**context):
    pageTemplate = pageLookup.get_template(templateFileName)
    return pageTemplate.render(**context).encode('utf-8')

def render_def(templateFileName,functionName,**context):
    pageTemplate = pageLookup.get_template(templateFileName).get_def(functionName)
    return pageTemplate.render(**context).encode('utf-8')

def secureheaders():
    headers = cherrypy.response.headers
    headers['X-Frame-Options'] = 'DENY'
    headers['X-XSS-Protection'] = '1; mode=block'
    headers['Content-Security-Policy'] = "default-src='self'"

# set the priority according to your needs if you are hooking something
# else on the 'before_finalize' hook point.
cherrypy.tools.secureheaders = cherrypy.Tool('before_finalize', secureheaders, priority=60)


pageLookup = TemplateLookup(directories=['views'])


cherrypy.quickstart(root=root,config="subtimer.conf")

#userpassdict = {'tentative' : 'deadlines'}
#checkpassword = cherrypy.lib.auth_basic.checkpassword_dict(userpassdict)
#basic_auth = {'tools.auth_basic.on': True,
#    'tools.auth_basic.realm': 'legible',
#    'tools.auth_basic.checkpassword': checkpassword,
#    }
#app_config = { '/' : basic_auth }
#
#app = cherrypy.tree.mount(
#        Bills(), "/bills",config="legible.conf")
#app.merge(app_config)
#cherrypy.engine.start()
#cherrypy.engine.block()

