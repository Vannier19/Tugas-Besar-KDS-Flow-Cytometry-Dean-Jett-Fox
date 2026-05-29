# IF3211 Domain-Specific Computation

Tugas besar untuk mata kuliah **IF3211 Domain-Specific Computation** dengan topik **Siklus Sel dan Meiosis**.

Judul proyek:
**Estimasi Distribusi Fase Siklus Sel dari Data Flow Cytometry Menggunakan Model Dean–Jett–Fox**

## Ringkasan

Proyek ini memproses data flow cytometry (DNA content) menjadi histogram, lalu melakukan fitting menggunakan model **Dean–Jett–Fox (DJF)** untuk mengestimasi proporsi fase siklus sel:

- **G1**
- **S**
- **G2/M**

Di repo ini juga tersedia aplikasi web sederhana:

- **Backend**: FastAPI (API untuk dataset dan fitting)
- **Frontend**: React + Vite (UI untuk mencoba fitting dan melihat hasil)

## Prasyarat

- Node.js + npm
- Python (disarankan Python 3.10+)
- `uv` (dipakai untuk membuat venv dan menjalankan backend)

Catatan: repo ini sengaja dibuat supaya setup bisa dilakukan cukup dari satu perintah `npm install`.

## Instalasi

Jalankan dari root repository:

```powershell
npm install
```

Perintah ini akan:

- Membuat virtual environment Python di `.venv` (via `uv`)
- Meng-install dependency Python dari `requirements.txt`
- Meng-install dependency frontend di `app/frontend`

Jika kamu tidak memakai `uv`, alternatif paling sederhana:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
npm --prefix app/frontend install
```

## Dataset

Dataset utama berasal dari Zenodo (record 14928071):

- Record: <https://zenodo.org/records/14928071>
- API metadata: <https://zenodo.org/api/records/14928071>
- DOI: `10.5281/zenodo.14928071`

Channel awal yang dipakai untuk histogram DNA/PI: `PI-A`.

## Alur Kerja Data (opsional)

Jika ingin mengambil data mentah dan menyiapkan histogram secara lokal, jalankan dari root repo:

```powershell
python scripts\download_zenodo_14928071.py
python scripts\inspect_fcs_metadata.py
python scripts\preprocess_zenodo_histograms.py
```

Notebook eksplorasi/analisis ada di:

```text
notebooks/dean_jett_fox_flow_cytometry.ipynb
```

## Menjalankan Aplikasi

Jalankan backend + frontend bersamaan:

```powershell
npm run dev
```

Alamat lokal:

Frontend tersedia di `https://djf-demo.khalshaqzzy.site`, 

### Endpoint API

- `GET /health`
- `GET /datasets`
- `POST /fit`
- `POST /fit/csv`

Contoh request fitting untuk dataset demo:

```json
{
  "dataset_id": "zenodo-14928071-ai-0"
}
```

Untuk `POST /fit/csv`, upload file CSV sebagai multipart form field `file`.
Format yang diterima:

- header `bin,count` atau `bins,counts`, atau
- dua kolom numerik tanpa header

Field opsional `g1_mean` dan `g2_mean` menggunakan satuan bin (raw).

### Model Dean–Jett–Fox

Fungsi fitting utama ada di:

```python
from models.dean_jett_fox import fit_dean_jett_fox
```

Model default yang dipakai adalah `djf_polynomial_broadened_v2`:

- G1 dan G2/M dimodelkan sebagai Gaussian (berbasis area)
- S-phase dimodelkan sebagai polinomial orde 2 dengan broadening
- Ada komponen debris/background sederhana

## Testing

Menjalankan seluruh test (backend + frontend):

```powershell
npm test
```

Validasi build frontend:

```powershell
npm --prefix app/frontend run build
```

## Docker (opsional)

Konfigurasi Docker Compose ada di folder `deploy/`. Ini berguna kalau ingin menjalankan versi "production-like" secara lokal atau di server.

```powershell
docker compose -f deploy/docker-compose.yml up -d --build
```

Jika ingin dipakai untuk domain publik/HTTPS, sesuaikan konfigurasi reverse proxy di file dalam folder `deploy/` sesuai kebutuhan.

## Artefak Penting

- `data/metadata/dataset_sources.md`
- `data/raw/zenodo/14928071/`
- `data/processed/zenodo_14928071_histograms/`
- `data/processed/zenodo_14928071_djf_fit_summary.csv`
- `models/dean_jett_fox.py`
- `app/backend/`
- `app/frontend/`
- `tests/test_dean_jett_fox.py`
- `tests/test_backend_api.py`

## Anggota Kelompok

- 18223026 Jacob Reinhard Marudut Siagian
- 18223028 Stevan Einer Bonagabe
- 18223080 Michael Ballard Isaiah Silaen
- 18223104 Muhammad Khalfani Shaquille Indrajaya
