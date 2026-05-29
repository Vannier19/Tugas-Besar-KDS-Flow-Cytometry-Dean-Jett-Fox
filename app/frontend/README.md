# Dean-Jett-Fox Virtual Lab

React virtual lab for the local FastAPI Dean-Jett-Fox model service.

## Run

Start the backend from the repository root:

```powershell
uvicorn app.backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Start the frontend:

```powershell
cd app\frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173`.

Set `VITE_API_BASE_URL` to override the backend URL. The default is `http://127.0.0.1:8000`.

## Validate

```powershell
npm run test
npm run build
```
