# NRC-Archiving

Deploy aplikasi dengan docker compose

## Requirement
- Docker Desktop v4.5.x
- MongoDB v8.x

## Instruksi
Install setiap dependency yang diperlukan dan buat satu database MongoDB dengan nama 'test' <br>
Persiapkan storage untuk menyimpan setiap file-file yang diunggah lewat aplikasi

#### Clone repositori
```bash
git clone https://github.com/NRC-Archiving/Production.git
```

#### Masuk ke root folder repository
```bash
cd Production
```

#### Konfigurasikan environment variabel
- FILE_STORAGE_PATH=`<path storage>`
- VUE_URI=`<ip address host>`
- SMTP_USER=`<alamat email>`
- SMTP_PASS=`<password email>`

#### Perintah untuk mengaktifkan aplikasi 
```bash
# untuk build image dan menjalankan container
docker-compose up --build

# untuk menghapus container
docker-compose down

# untuk menjalankan container, jika sebelumnya sudah di-build dan image docker masih ada
docker-compose up
```

Setelahnya akan ada dua container yang berjalan backend dan frontend. <br>
untuk mengakses aplikasi bisa dengan mengakses `<localhost:80>` atau sesuai dengan konfigurasi `nginx.conf` dalam folder `frontend`