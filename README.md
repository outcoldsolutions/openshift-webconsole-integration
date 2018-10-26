# Integration of OpenShift Web Console with Monitoring OpenShift application

## Install from template

Create application from the template

```bash
oc new-app -f ./openshift/templates/outcoldsolutions-webconsole-integration.yaml \
    --param=SPLUNK_WEB_URL=http://splunk.local.outcold.solutions:8000 \
    --param=SOURCE_REPOSITORY_REF=v1.0.0
```

```bash
oc new-app https://github.com/outcoldsolutions/openshift-webconsole-integration


```

## rebuild

```bash
oc start-build openshift-webconsole-integration --follow
```

```bash
oc set env dc/openshift-webconsole-integration SPLUNK_WEB_URL='http://localhost:8000'
```

## From template

```bash
oc new-app -f ./openshift/templates/outcoldsolutions-webconsole-integration.yaml --param=SPLUNK_WEB_URL=http://splunk.local.outcold.solutions:8000
```