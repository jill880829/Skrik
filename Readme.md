# Skrik 
#### A Simultaneously and Co-edited Coding Website
## Links
* [Demo Video](https://youtu.be/hy1TVrDzkAU)
* [Skrik.net](https://skrik.net)
* [Github](https://github.com/jill880829/Skrik)

## Introduction
As engineering students, we all know that it is inevitable for us to co-coding projects. Hence, we would like to develop an online platform for project collaborators, integrating merits of HackMD and Visual Studio Code. Our goal is to create an impressive online platform, therefore, we simplify the well-known portrait Skrik(in Norwegian) of Edvard Munch as our logo.

This service mainly contains three pages. First, the login page. We support two approaches, register from Skrik or via GitHub accounts. After successfully login, we will enter the main page. In the left part, we can modify our profiles. In the right part, we list all projects that the user can edit. Also, we provide a button to create a project, which contains setting project name and collaborators. 

After clicking the project, we will arrive the editor page. The left side manifests whole file structure, we can create(delete) files or folders, also rename the files, still we can download the project by zipping all files. The right side is the main part of code editor, which supports three functions, automatically syntax highlighting by detecting extensions, allow multiple users to concurrently edit the files, and present every user's current cursor.

![](https://i.imgur.com/qCO0nq4.png)

## Usage
### Local
```bash=
git clone https://github.com/jill880829/Skrik
```
* Backend

    - Specify `backend/.env` first, there exists `backend/.env.example` for you to specify it
    - connect to database on cloud
    You need to be the IAM user in our GCP project, or you have to build your own database
        ```bash=
        # install and set gcloud info
        install gcloud (find steps from web!!)
        gcloud components install kubectl
        gcloud init
        gcloud auth login
        gcloud config set project skrik-299012
        gcloud container clusters get-credentials skrik-taiwan        

        # port forwarding the database
        kubectl get pods  (check mongo and redis pod name)
        kubectl port-forward <pod-name> [port]:[port]
        
        #docker ports:
        mongo:           27017
        mongo-express:   8081
        redis:           6379

        ```
    - Run backend server
        ```bash=
        make backend_yarn
        ```
        or ...
        
        ```bash=
        make backend
        ```
* Frontend
    - Run frontend react
        ```bash=
        cd Skrik/frontend/
        yarn
        yarn start
        ```
### Deployment
You need to be the IAM user in our GCP project, or you have to create GCP project and config your IAM users first
* Get certificate (using letsencrypt)
```bash=
make cert
sudo make cert_fetch
```
* Apply secrets(cert, passwords) to kubernetes
```bash=
# deploy the secret in .env
make deploy_db_conf
make deploy_redis_conf
make deploy_backend_conf
make cert_deploy
```
* Build docker and push to remote repo
```bash=
make deploy_db_build
make deploy_backend_build
make deploy_frontend_build
```
* Deploy storage services
```bash=
# claim persistant volume for db service
kubectl apply -f ./deployment/k8s/databae/mongo-pvc.yaml
kubectl apply -f ./deployment/k8s/databae/redis-pvc.yaml

#deploy instance
kubectl apply -f ./deployment/k8s/databae/mongo.yaml
kubectl apply -f ./deployment/k8s/databae/redis.yaml
```
* Deploy web service
```bash=
# backend configs
kubectl apply -f ./deployment/k8s/server/backend-conf.yaml

#deploy backend
kubectl apply -f ./deployment/k8s/server/backend.yaml
#deploy frontend
kubectl apply -f ./deployment/k8s/server/frontend.yaml
```
* Network issue
```bash=
# deploy nginx
kubectl apply -f ./deployment/k8s/network/nginx-service-conf.yaml
kubectl apply -f ./deployment/k8s/network/nginx-conf.yaml
kubectl apply -f ./deployment/k8s/network/nginx.yaml
kubectl apply -f ./deployment/k8s/network/nginx-service.yaml

# deploy ingress, need to reserve static IP first
kubectl apply -f ./deployment/k8s/ingress/ingress.yaml
```
* Restart service
```bash=
# rollout existed docker and restart
kubectl rollout restart statefulset mongo
kubectl rollout restart statefulset redis
kubectl rollout restart deployment frontend 
kubectl rollout restart deployment backend
kubectl rollout restart deployment nginx
```

## Dependency
### Backend
```json=
"body-parser": "^1.19.0",             <!-- deal with http request body -->
"cookie-parser": "~1.4.4",            <!-- parse cookie  -->
"crypto-js": "^4.0.0",        	       <!-- generate hash and base64 -->
"express": "~4.16.1",         	       <!-- deal with express -->
"express-session": "^1.17.1", 	       <!-- deal with session -->
"fstream": "^1.0.12",                 <!-- zip files for download -->
"http": "^0.0.1-security",            <!-- create http server -->
"http-errors": "~1.6.3",
"mongoose": "^5.11.8",                <!-- package to access mongodb -->
"morgan": "~1.9.1",                   <!-- backend server's log middleware-->
"passport": "^0.4.1",                 <!-- login logout strategy -->
"passport-github2": "^0.1.12",        <!-- github oAuth -->
"passport-local": "^1.0.0",           <!-- local login strategy -->
"connect-redis": "^5.0.0",            <!-- construct redis channel -->
"redis": "^3.0.2",                    <!-- construct redis channel -->
"ws": "^7.4.1"                        <!-- websocket -->
```
### Frontend
```json=
"@material-ui/core": "^4.11.2",          <!-- login icons -->
"@material-ui/icons": "^4.11.2",         <!-- login icons -->
"antd": "^4.10.2",                       <!-- alert and infos -->
"codemirror": "^5.58.3",                 <!-- editor text area-->
"diff": "^5.0.0",                        <!-- detect duplicate codes when -->
                                         <!-- transfering to backend      -->
"material-ui-password-field": "^2.1.2",  <!-- login blanks -->
"nodemon": "^2.0.7",                           
"react": "^17.0.1",                            
"react-codemirror2": "^7.2.1",           <!-- editor text area-->
"react-dom": "^17.0.1",
"react-icons": "4.1.0",                  <!-- icons -->
"react-router-dom": "^5.2.0",            <!-- router of pages -->
"react-scripts": "4.0.1",
"react-select": "^3.1.1",
"slice-lines": "^1.0.3",                 <!-- remove duplicate codes when --> 
                                         <!-- transfering to backend      -->
"styled-components": "5.1.0",            <!-- css tools-->
"web-vitals": "^0.2.4"
```
## Our Thought About Skrik
After finishing this project, we really admire those who construct google doc and HackMD. We spent almost 4 days dealing with synchronizing all cursors and correctly displaying the texts. What's more adding cursors into texts by CodeMirror and preventing them collapsing into same position are both disasters. To further improve Skrik, the speed of DB access is significant. In the current version, DB access is the limit of the fluency, which may cause a long wait when refreshing the data. Still racing conditions should be more thoroughly taken into considerations.

We have encountered tons of obstacles since we started. Let us mention some. To maintain the mutual independency of each project, we separate the WebSocket connections into different channels. We carefully protect the data structure when users enter and leave the project. Furthermore, displaying file structure of the project is also a tough task, let alone rename, addition, and deletion. We utilize recursive render to display the tree structures, and also recursively modify them. Last but not least, CSS has long been a hard part, we develop an SOP of debugging. The quintessence is to change the background color of each block.

Through developing Skrik, we have gone through the procedure of setting up website in detail and have gathered lots of sense of accomplishment.
## Contribution
* 翁瑋襄 (jill880829) leader
    * Frontend pages
        * Editor (Text)
    * Communication
        * Broadcast
        * Deal with buffers of textarea and send to backend 
    * Backend
        * DB Management
        * Backend APIs
        * Save data to DB
* 鄭謹譯 (chinyi0523)
    * Frontend pages
        * Profile
        * Editor (Hybrid)
        * Structure
    * Communication
        * Broadcast
        * Fetch data from backend and Page switching
    * Backend
        * Save data to DB
* 呂承樺 (anitalu724)
    * CSS design (All)
    * Frontend pages
        * Login/Register
        * Profile
        * Project/Modal
        * Editor (Cursor)
    * Router

#### Assistances
* 郭哲璁(nawmrofed)、賴侃軒(hallo1144)
    Helps for and consultants of backend management and deployment


## Advices
* Canceling Hackathons may be a better choice. 



