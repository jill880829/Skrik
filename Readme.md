## Run Backend
- Generate ./backend/.env from ./backend/.env.example
- If not specify `FB_APP_ID` and `FB_APP_SECRET`, FB login is disabled
	- Google and Github are the same

## API list
### frontend:
- GET /register
- GET /login
- GET /projects
- GET /create

### backend:
- POST /api/register
- POST /api/login
- GET /api/login/fb
- GET /api/login/github
- GET /api/login/google
- GET /api/projects
- POST /api/create
- GET /api/ls/\<SHA256>
- ws: /api/wss/\<SHA256>
- ws: /api/wss/\<SHA256>/getfile
- ws: /api/wss/\<SHA256>/commit
- ws: /api/wss/\<SHA256>/notify

## Format Spec

### db return format

- For project collection handling

```json
{
	"success": boolean,
	"description": string
}
```

- For listing file in edit page

```json
{
	"success": boolean,
	"description": string,
	"files": [ string ]
}
```

- For getting content from specific file

```json
{
	"success": boolean,
	"description": string,
	"content":[ { "lineid": Integer, "user": string, "data": string } ]
}
```
