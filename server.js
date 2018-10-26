const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

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
    return {
      type: 'dom',
      node: '<span><a href="${splunkUrl}/en-US/app/monitoringopenshift/search?q=search%20sourcetype%3D%22openshift_logs%22%20openshift_pod_name%3D%22'+encodeURIComponent(resource.metadata.name)+'*%22">' + resource.metadata.name + '</a><span class="action-divider">|</span></span>'
    };
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