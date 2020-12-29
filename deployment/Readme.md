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