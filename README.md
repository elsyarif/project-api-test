## Deskripsi
Simple api projak api, saat ini mengelompokan fiture kedalam folder modules, untuk development lebih mudah di maintenance. dengan srukture berikut.
<br/>
* src
    * common
    * config
    * entities
    * helper
    * modules

Pada simple api, terdapat enpoint _authenticate_ dimana enpoint ini bisa untuk _register_, _login_, _refresh token_, dan juga _logout_, terdapat enpoint lain berupa _categories_ untuk menajemen kategory, enpoint _Products_ untuk menajemen Products, serta enpoint Product variant, dimana setiap produk memiliki lebih dari satu variant produk. untuk mengakses enpoint _categories_, _Products_, dan _Product variant_ pengguna harus sudah melakukan login terlebih dahulu, untuk dapat mengaksesnya.

## Instalasi

```bash
$ npm install
```

## Konfigurasi
### Copy Environment
```bash
$ cp .env.example .env
```
### Environment 
```bash
DB_DRIVER=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

#JWT TOKEN SETUP
JWT_SECRET='HFDIvjorivej083fngkj9384USGHVFjgvnl@qdhjkfhcIU9834DHFSCNIJlhuHDBNFC34_DJSIOFDH'
JWT_EXPIRE_TIME='15m'

#ENCRYPT KEY
KEY_BUFFER='fec4722ef6ed8668edd8aefdc3b81e27df0024f16fdada2d0e2291dfd520649e'
IV_BUFFER='ae2f67dee9d409ed40d4d6a199777f08'
```
## Menjalankan Aplikasi

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## URL
```
http://localhost:3000/api
 ```
<!-- 
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->
