# React + Vite

## Deploy frontend dengan Gin backend

Frontend membutuhkan variabel Vite berikut pada proses build/deploy:

```env
VITE_API_BASE_URL=https://your-gin-backend.example.com
```

Salin `.env.example` menjadi `.env.local` untuk development lokal, atau tambahkan
`VITE_API_BASE_URL` pada environment settings penyedia hosting sebelum build.

Tidak boleh menggunakan `http://localhost:8081` pada deployment production karena
`localhost` merujuk ke perangkat pengunjung, bukan server Gin. Jangan mengakhiri
nilai dengan `/`.

Contoh:

```env
VITE_API_BASE_URL=https://api.example.com
```

Backend Gin juga harus:

- dapat diakses melalui HTTPS atau HTTP host publik, bukan hanya `localhost`;
- mengizinkan origin frontend melalui CORS;
- mengizinkan header `Authorization` dan `Content-Type`;
- mengizinkan method `GET`, `POST`, `PUT`, `PATCH`, dan `DELETE`.

Setelah mengubah environment variable, lakukan build ulang. Vite memasukkan nilai
`VITE_*` ke bundle saat build, sehingga perubahan environment tidak berlaku pada
build lama.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
