
# American Spincast Manufacturing Knowledge Base

A comprehensive web-based knowledge management system designed for American Spincast Foundry to streamline manufacturing documentation, enable predictive maintenance, and create a searchable database of production data.

## 📋 Overview

This system digitizes and centralizes American Spincast's manufacturing operations, transforming handwritten logs and scattered documentation into a structured, searchable knowledge base. The platform supports data entry, advanced search capabilities, real-time analytics, and comprehensive reporting for all aspects of the manufacturing process.

## ✨ Features

### Core Functionality
- **🏠 Dashboard**: Real-time overview of production metrics, quality statistics, and equipment status
- **📝 Data Entry Hub**: Streamlined forms for capturing production data including:
  - Work Orders
  - Heat Numbers
  - Casting Runs
  - Quality Inspections
  - Maintenance Records
- **🔍 Advanced Search**: Multi-criteria search across all production data with export capabilities
- **📊 Analytics & Reporting**: Visual insights into production trends, quality metrics, and equipment performance
- **🔗 Traceability**: Complete material and process traceability throughout the production lifecycle

### Specialized Modules
- **Production Management**: Track work orders, casting runs, and production schedules
- **Quality Control**: Document inspections, measurements, and quality metrics
- **Maintenance Tracking**: Record equipment maintenance, repairs, and service history
- **Material Traceability**: Full chain-of-custody for alloys, heat numbers, and raw materials

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Chart.js + React-Chartjs-2
- **Form Management**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Package Manager**: Yarn

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Yarn package manager

### Clone the Repository
```bash
git clone git@github.com:starwreckntx/amstockhelper.git
cd amstockhelper
```

### Install Dependencies
```bash
yarn install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/american_spincast?schema=public"

# Application Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Replace `username`, `password`, and database connection details with your PostgreSQL credentials.

## 🗄️ Database Setup

### Initialize the Database

1. **Create the PostgreSQL database:**
```bash
createdb american_spincast
```

2. **Generate Prisma Client:**
```bash
yarn prisma generate
```

3. **Run database migrations:**
```bash
yarn prisma db push
```

4. **Seed initial data (optional):**
```bash
yarn prisma db seed
```

### Database Schema

The system includes comprehensive schemas for:
- Work Orders & Production Runs
- Heat Numbers & Material Tracking
- Quality Inspections & Measurements
- Equipment & Maintenance Records
- Operators & Shift Information
- Traceability & Chain of Custody

See `prisma/schema.prisma` for complete schema definitions.

## 🚀 Running the Application

### Development Mode
```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
yarn build
yarn start
```

### Lint Code
```bash
yarn lint
```

## 📁 Project Structure

```
american_spincast_foundry/
├── app/
│   ├── api/              # API routes
│   │   ├── dashboard/    # Dashboard data endpoints
│   │   ├── data-entry/   # Data entry endpoints
│   │   └── search/       # Search & export endpoints
│   ├── dashboard/        # Dashboard page
│   ├── data-entry/       # Data entry interface
│   ├── search/           # Search interface
│   ├── production/       # Production management
│   ├── quality/          # Quality control
│   ├── maintenance/      # Maintenance tracking
│   ├── traceability/     # Material traceability
│   ├── reports/          # Reporting module
│   └── settings/         # Application settings
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── data-entry/       # Data entry forms
│   ├── search/           # Search components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── lib/
│   ├── db.ts            # Database utilities
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
├── prisma/
│   └── schema.prisma    # Database schema
└── public/
    └── american-spincast-logo.png
```

## 💡 Usage Guide

### Data Entry
1. Navigate to **Data Entry** from the main menu
2. Select the type of record to create (Work Order, Heat Number, etc.)
3. Fill out the form with required information
4. Submit to save to the database

### Search & Retrieval
1. Go to the **Search** page
2. Apply filters (date range, entity type, keywords)
3. View results in the table
4. Export results to CSV if needed

### Dashboard Analytics
1. Access the **Dashboard** to view:
   - Production volume trends
   - Quality metrics and defect rates
   - Equipment status and utilization
   - Recent activity feed

### Traceability
1. Navigate to **Traceability**
2. Enter a Heat Number, Work Order, or Product ID
3. View complete production history and material lineage

## 🔐 Security Notes

- The current version has direct access without authentication
- For production deployment, consider implementing:
  - User authentication and authorization
  - Role-based access control (RBAC)
  - Audit logging for data changes
  - SSL/TLS encryption

## 📈 Roadmap

Future enhancements planned:
- [ ] User authentication and role management
- [ ] Mobile-responsive data entry
- [ ] Advanced analytics and ML-based predictive maintenance
- [ ] Integration with IoT sensors for real-time data capture
- [ ] PDF report generation
- [ ] Automated email notifications for critical events
- [ ] Multi-facility support

## 🤝 Contributing

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature description"`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 📄 License

Proprietary - American Spincast Foundry

## 📞 Support

For questions or issues:
- **Internal Support**: Contact IT Department
- **Technical Issues**: Create an issue in the GitHub repository
- **Email**: support@americanspincast.com

## 🙏 Acknowledgments

Built to support American Spincast's transition from reactive to predictive maintenance, enabling data-driven decision making and operational excellence.

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintained by**: American Spincast IT Team
