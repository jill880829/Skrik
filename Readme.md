## API list
### frontend:
- GET /register
- GET /login
- GET /projects
- GET /create

### backend:
- POST /api/register
- POST /api/login
- GET /api/projects
- POST /api/create
- GET /api/ls/\<SHA256>
- ws: /api/wss/\<SHA256>
- ws: /api/wss/\<SHA256>/getfile
- ws: /api/wss/\<SHA256>/commit
- ws: /api/wss/\<SHA256>/notify

## Format Spec

### db return format

- for project handling

```json
{
	"success": [boolean],
	"description": [string]
}
```

- for listing file in edit page

```json
{
	"success": [boolean],
	"description": [string],
	"files":[]
}
```
- for getting content from specific file

```json
{
	"success": [boolean],
	"description": [string],
	"content":[{"lineid": [Number], "user": [string], "data": [string]}]
}
```
## Run Backend
- Generate ./backend/.env from ./backend/.env.example
- If not specify `FB_APP_ID` and `FB_APP_SECRET`, FB login is disabled
	- Google and Github are the same
