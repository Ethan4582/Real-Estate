# Dream House - Property Marketplace

Dream House is a modern property marketplace platform that enables users to browse, buy, sell, and rent properties. The application features user authentication, property management, and messaging capabilities with a responsive UI built using Next.js and Tailwind CSS.

![Screenshot](public/main.png)

## Key Features

- **Property Marketplace**: Browse, buy, sell, and rent properties with detailed listings
- **User Authentication**: Secure registration, login, and logout using JWT
- **Property Management**: Add, view, edit, and delete property listings
- **Advanced Search**: Filter properties by location, price, type, and bedrooms
- **Messaging System**: Direct communication between buyers and sellers
- **Responsive UI**: Mobile-friendly design with smooth animations

## Tech Stack

| Category          | Technologies                          |
|-------------------|---------------------------------------|
| Framework         | Next.js (App Router)                  |
| Database          | PostgreSQL with Prisma ORM            |
| Authentication    | JWT with bcrypt hashing               |
| Styling           | Tailwind CSS                          |
| UI Components     | Lucide icons, Framer Motion           |
| Deployment        | Docker and Docker Compose             |

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Docker (optional for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dream-house.git
cd dream-house
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and JWT secret

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database (optional):
```bash
npx prisma db seed
```

6. Start development server:
```bash
npm run dev
```

The application will be running at `http://localhost:3000`.

## Docker Deployment

```bash
docker-compose up --build
```

Access the application at `http://localhost:3000` after containers start.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dreamhouse"
JWT_SECRET="your-strong-secret-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```
## Support

For issues, feature requests, or questions:
- Open an Issue
- Email: singhashirwad2003@gmail.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.