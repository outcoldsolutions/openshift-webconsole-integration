const http = require('http');
const url = require('url');

const hostname = '0.0.0.0';
const port = 8080;

const stript = (() => {
    let splunkUrl = process.env['SPLUNK_WEB_URL'];

    if (!splunkUrl) {
        splunkUrl = "http://splunk:8000";
    }

    if (splunkUrl.endsWith('/')) {
        splunkUrl = splunkUrl.substr(0, splunkUrl.length - 1)
    }

    splunkUrl = encodeURI(splunkUrl);

    return `'use strict';
angular.module("mylinkextensions", ['openshiftConsole'])
.run(function(extensionRegistry) {
  extensionRegistry.add('log-links', _.spread(function(resource, options) {
    console.dir(resource);
    if (resource.kind === "Pod") {
      return {
        type: 'dom',
        node: '<span>'+
          '<a href="${splunkUrl}/en-US/app/monitoringopenshift/pod?form.host='+encodeURIComponent(resource.spec.nodeName)+'&form.openshift_pod_id=' + encodeURIComponent(resource.metadata.uid) + '">' + 
          'Splunk (Monitoring)</a><i class="fa fa-external-link"></i><span class="action-divider">|</span></span>' +
          '<span>'+
          '<a href="${splunkUrl}/en-US/app/monitoringopenshift/search?q=search%20%60macro_openshift_logs%60%20openshift_pod_id%3D%22'+encodeURIComponent(resource.metadata.uid)+'%22">' + 
          'Splunk (Logs)</a><i class="fa fa-external-link"></i><span class="action-divider">|</span></span>'
      };
    } else {
      return {
        type: 'dom',
        node: '<span>'+
          '<a href="${splunkUrl}/en-US/app/monitoringopenshift/pod?form.workload='+encodeURIComponent(resource.kind.toLowerCase())+'&form.openshift_workload_id=' + encodeURIComponent(resource.metadata.uid) + '">' + 
          'Splunk (Monitoring)</a><i class="fa fa-external-link"></i><span class="action-divider">|</span></span>' + 
          '<span>'+
          '<a href="${splunkUrl}/en-US/app/monitoringopenshift/search?q=search%20%60macro_openshift_logs%60%20openshift_' + encodeURIComponent(resource.kind.toLowerCase()) + '_id%3D%22'+encodeURIComponent(resource.metadata.uid)+'%22">' + 
          'Splunk (Logs)</a><i class="fa fa-external-link"></i><span class="action-divider">|</span></span>'
      };
    }
  }));
});
hawtioPluginLoader.addModule("mylinkextensions");`
})();

const server = http.createServer((req, res) => {
    const requestURL = url.parse(req.url)

    if (requestURL.pathname !== "/script.js") {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
        res.end("unknown path");
        return
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset="utf-8"');
    res.end(stript);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});