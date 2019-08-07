# Integration of OpenShift Web Console with Monitoring OpenShift application

A node-js application that listens on port 8080 and returns a `script.js`,
that is used by the OpenShift Web Console to embed links from the
Logs page directly to Splunk.

The `script.js` based on the example from [Extension Option for External Logging Solutions](https://docs.openshift.com/container-platform/3.11/install_config/web_console_customization.html#extension-option-for-external-logging-solutions).
The integration is based on the [Loading Extension Scripts and Stylesheets](https://docs.openshift.com/container-platform/3.11/install_config/web_console_customization.html#loading-custom-scripts-and-stylesheets).

![Web Console Example](https://raw.githubusercontent.com/outcoldsolutions/openshift-webconsole-integration/master/docs/webconsole-example.png)

## Install the application

Switch to the `collectorforopenshift` project if you want to keep the app
under the same project as our collector.

```bash
oc project collectorforopenshift
```

You can install the application from our [template](https://github.com/outcoldsolutions/openshift-webconsole-integration/blob/master/openshift/templates/outcoldsolutions-webconsole-integration.yaml)
or from the source.

### Install from the template

> Skip if you are planning to install from the source

Create application from the template (change the `SPLUNK_WEB_URL` to the URL of your Splunk Web)

```bash
oc new-app -f https://raw.githubusercontent.com/outcoldsolutions/openshift-webconsole-integration/v1.2.0/openshift/templates/outcoldsolutions-webconsole-integration.yaml \
    --param=SPLUNK_WEB_URL=http://splunk.example.com:8000 \
    --param=SOURCE_REPOSITORY_REF=v1.2.0
```

You can verify all the created workloads and objects with

```bash
oc get all -l app=outcoldsolutions-webconsole-integration
```

#### Parameters

- `SOURCE_REPOSITORY_URL` - source URL. The default value is
[https://github.com/outcoldsolutions/openshift-webconsole-integration](https://github.com/outcoldsolutions/openshift-webconsole-integration).
You can fork this repository and specify a different URL.
- `SOURCE_REPOSITORY_REF` - the reference of the repository (branch or tag). The
default value is empty (master).
- `SPLUNK_WEB_URL` - the path to the Splunk Web interface. The default value is
`https://localhost:8000`.
- `SPLUNK_APP_NAME` - the name of the application (default is `monitoringopenshift`).
- `APPLICATION_DOMAIN` - if you want to override the default hostname of the
exposed route. Default value is `outcoldsolutions-webconsole-integration-collectorforopenshift.apps.example.com`,
where `apps.example.com` is the `openshift_master_default_subdomain`.
- `REPLICA_COUNT` - the number of replicas to run. The default value is 1.

### Install from the source

> Skip, if you have installed it from the template.

Clone the repo

```bash
git clone https://github.com/outcoldsolutions/openshift-webconsole-integration
cd openshift-webconsole-integration
```

Create a new application from the repo

```
oc new-app . --name outcoldsolutions-webconsole-integration --labels=app=outcoldsolutions-webconsole-integration
```

Set the URL to your Splunk instance

```bash
oc set env dc/outcoldsolutions-webconsole-integration SPLUNK_WEB_URL='http://splunk.example.com:8000'
```

Create the route

```bash
oc create route edge --service=outcoldsolutions-webconsole-integration 
```

## Uninstall the application

If you wish to uninstall the application with all dependencies, please use the following command.
You need to execute it under the same project where you created it.

```bash
oc delete all -l app=outcoldsolutions-webconsole-integration
```

## Web Console integration

Get the URL of the `script.js`

```bash
echo "https://$(oc get route outcoldsolutions-webconsole-integration -o=jsonpath='{.spec.host}')/script.js"
```

The URL will look similar to

```text
https://outcoldsolutions-webconsole-integration-collectorforopenshift.apps.example.com/script.js
```

Verify first that you can open this URL in the browser. If you are using
self-signed certificate, you will need to trust this URL first.

Follow the instructions of [Loading Extension Scripts and Stylesheets](https://docs.openshift.com/container-platform/3.11/install_config/web_console_customization.html#loading-custom-scripts-and-stylesheets)
how to load external scripts in your Web Console.

Resulting ConfigMap will look similar to

```yaml
apiVersion: v1
kind: ConfigMap
data:
  webconsole-config.yaml: |
    apiVersion: webconsole.config.openshift.io/v1
    extensions:
      scriptURLs:
        - https://outcoldsolutions-webconsole-integration-collectorforopenshift.apps.example.com/script.js
  ...
```

Web Console automatically picks up the updated configuration. Refresh the Web Console
in the browser.

## Troubleshooting

Open development console in your browser. Refresh the page and locate `script.js`
from the URL specified above. If you see not a 200 code, troubleshoot base on the 
error code.

![Web Console Dev Console](https://raw.githubusercontent.com/outcoldsolutions/openshift-webconsole-integration/master/docs/webconsole-dev-console.png)


If you don't see a script, you can try to delete the Pods with OpenShift console,
so the new Pods can pick up an updated configuration

```bash
oc delete pods -n openshift-web-console -l app=openshift-web-console
```

## Release notes

- 2019-08-07 1.2.0
    - New parameter `SPLUNK_APP_NAME` that allows to override default name of the application from `monitoringopenshift`
- 2018-11-02 1.1.0
    - Use `node.js:8` as a default image instead of `nodejs.10` to support earlier versions
    - Add `NODEJS_IMAGE` template parameter to be able to override default image `nodejs:8`
- 2018-10-26 1.0.0
    - Initial release
