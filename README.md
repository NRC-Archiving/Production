# NRC-Archiving

Deploy aplikasi dengan docker compose

## Requirement
- Docker Desktop v4.5.x
- MongoDB v8.x

## Instruksi
Install setiap dependency yang diperlukan dan buat satu database MongoDB dengan nama 'test'

#### Clone repositori
```bash
git clone https://github.com/lckmnzans/NRC-Archiving.git
```

#### Masuk ke root folder repository
```bash
cd NRC-Archiving
```

#### Konfigurasikan environment variabel
- VUE_URI=`<ip address host>`
- SMTP_USER=`<alamat email>`
- SMTP_PASS=`<password email>`
konfigurasi di atas akan dipakai dalam fitur reset password

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
untuk mengakses aplikasi bisa dengan mengakses `<localhost:80>`