# Community Manager

A modern condo association management platform built on [loomOS](https://github.com/yourorg/loomos).

---

## What is Community Manager?

Community Manager is a full-featured property management solution designed for condominiums, HOAs, and residential communities. Built on the loomOS platform, it provides residents, board members, and property managers with an intuitive interface for communication, event planning, document management, and financial operations.

---

## ✨ Features

- **Communication Hub** - Announcements, threaded messages, and resident directory
- **Event Management** - Calendar, RSVPs, and community scheduling
- **Document Library** - Secure storage for bylaws, meeting minutes, and shared files
- **Financial Tools** - Fee payments, budgeting, and financial reporting
- **Task Management** - Work orders, maintenance requests, and board initiatives
- **Access Control** - Role-based permissions for residents, board members, and admins

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourorg/community-manager.git
cd community-manager

# Install dependencies
yarn install

# Configure your environment
cp .env.example .env
# Edit .env with your database and service credentials

# Set up the database
yarn prisma migrate deploy
yarn prisma db seed

# Start the development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Change the default password immediately after first login!**

---

## 📋 Requirements

- Node.js 18+
- PostgreSQL 14+
- A [loomOS](https://github.com/yourorg/loomos) installation or compatible runtime

---

## 🛠️ Built With

- **[loomOS](https://github.com/yourorg/loomos)** - Modern desktop OS framework
- **Next.js 14** - React framework
- **PostgreSQL** - Database
- **Prisma** - Database ORM

---

## 📚 Documentation

- **[Setup Guide](docs/setup/)** - Detailed installation instructions
- **[User Guide](docs/USER_GUIDE_COMPREHENSIVE.md)** - How to use Community Manager
- **[API Documentation](docs/API_SETUP_GUIDE.md)** - Integration endpoints
- **[FAQ](docs/FAQ_COMPREHENSIVE.md)** - Common questions

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Credits

Built with [loomOS](https://github.com/yourorg/loomos) by the OurFi Team.
