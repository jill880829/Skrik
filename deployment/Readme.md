## use mongoDB on cloud
installation & authentication:

    1.  install gcloud (find steps from web!!)
    2.  gcloud components install kubectl
    3.  gcloud init
    4.  gcloud auth login
    5.  gcloud config set project skrik-299012
    6.  gcloud container clusters get-credentials skrik

forward port:

    1.  kubectl get pods  (check mongo pod name)
    2.  kubectl port-forward <pod-name> 27017:27017

docker ports:

    1. mongo:           27017
    2. mongo-express:   8081
    3. redis:           6379

## versions

    v0.0.4: single line ok; oauth ok
    v0.0.5: websocket version demo (v0.0.4 frontend)
    v0.0.6: websocket with splited room
    v0.0.7: multiple cursor
    v0.0.8: final