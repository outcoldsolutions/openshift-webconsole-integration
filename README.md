# Integration of OpenShift Web Console with Monitoring OpenShift application

This is a node-js application, that listens on port 8080 and returns a script.js,
that can be used by the OpenShift Web Console to integrate links from the
Logs page directly to Splunk.

![Web Console Example](https://raw.githubusercontent.com/outcoldsolutions/openshift-webconsole-integration/master/docs/webconsole-example.png)

## App installation

Switch to the `collectorforopenshift` project if you want to keep the app
under the same project as our collector.

```bash
oc project collectorforopenshift
```

### Install from template

Create application from the template (change the `SPLUNK_WEB_URL` to the URL of your Splunk Web)

```bash
oc new-app -f https://raw.githubusercontent.com/outcoldsolutions/openshift-webconsole-integration/v1.0.0/openshift/templates/outcoldsolutions-webconsole-integration.yaml \
    --param=SPLUNK_WEB_URL=http://splunk.example.com:8000 \
    --param=SOURCE_REPOSITORY_REF=v1.0.0
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
- `APPLICATION_DOMAIN` - if you want to override the default hostname of the
exposed route. Default value is `outcoldsolutions-webconsole-integration-collectorforopenshift.apps.example.com`,
where `apps.example.com` is the `openshift_master_default_subdomain`.
- `REPLICA_COUNT` - number of replicas to run. The default value is 1.

### Install from the source

Clone the repo

```bash
git clone https://github.com/outcoldsolutions/openshift-webconsole-integration
cd openshift-webconsole-integration
```

Create new application from the repo

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

## Uninstall App

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


