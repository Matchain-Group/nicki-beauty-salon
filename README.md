# Beauty salon booking Next.js

A full-stack beauty salon website where customers can book hair appointments and buy beauty products online.

**Live demo:** [nicki-beauty-salon.vercel.app](https://nicki-beauty-salon.vercel.app)

## Features

- Hair appointment booking
- Online store for beauty and hair products
- User sign up and login
- Secure payments with Paystack
- Email notifications for bookings and orders
- Responsive design, works on mobile and desktop
- Image sliders for services and products

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, PostCSS |
| Database | MongoDB with Mongoose |
| Auth | NextAuth.js, bcryptjs |
| Payments | Paystack |
| Email | Nodemailer |
| Forms and validation | React Hook Form, Zod |
| UI extras | Lucide React, Swiper |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A MongoDB database (local or MongoDB Atlas)
- A Paystack account (test keys are fine)
- An SMTP email account for Nodemailer

### Installation

```bash
git clone https://github.com/Matchain-Group/nicki-beauty-salon.git
cd nicki-beauty-salon
npm install
```

### Environment variables

Create a `.env.local` file in the project root. Adjust the names to match what the code reads.

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=
NEXTAUTH_SECRET=y
EMAIL_HOST=smtp.example.com
EMAIL_PORT=
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Never commit this file or share real keys.

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed the database (Windows PowerShell)

```powershell
./seed-database.ps1
```

### Other scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
nicki-beauty-salon/
├── src/                 # App source code (pages, components, API routes)
├── public/images/       # Static images
├── middleware.ts        # Route protection
├── next.config.js
├── tailwind.config.js
├── seed-database.ps1    # Seeds starter data
└── start-server.ps1     # Helper to start the server
```

## Deployment

The app is deployed on Vercel. To deploy your own:

1. Push the repo to GitHub
2. Import it on [vercel.com](https://vercel.com)
3. Add the environment variables above in the project settings
4. Deploy

## Roadmap

- Admin dashboard for managing bookings and orders
- Stylist availability calendar
- Booking reminders by email

## Author

Built by [Matchain Group](https://github.com/Matchain-Group).

## License

All rights reserved. Contact the author for usage permission.
