Website Name: CivicFix

live link: https://civic-fix-project-96.netlify.app/

admin: admin1@gmail.com

pass: Admin1@gmail.com

citizen: citi5@gmail.com

pass: Citi5@gmail.com

staff: staff5@gmail.com

pass: Staff5@gmail.com


 Civic Issue Reporting Platform

A modern web application for citizens to report and track civic issues with real-time management capabilities.

## Overview

This platform enables citizens to report civic issues, track their progress, and engage with local authorities through a transparent and efficient system. With role-based access control and real-time updates, it streamlines the entire issue resolution process from reporting to completion.

## Key Features

### User Management
- **Three-Tier Role System**: Citizen, Staff, and Admin roles with specific permissions
- **Secure Authentication**: Firebase Admin SDK with JWT token-based security
- **Persistent Sessions**: Local storage-based session management for seamless user experience

### Issue Reporting
- **Comprehensive Reporting**: Submit issues with images, titles, categories, locations, and detailed descriptions
- **Advanced Filtering**: Filter by category, status, and priority with real-time search
- **Community Engagement**: Upvote system to highlight important issues
- **Complete Transparency**: Timeline tracking from report to resolution

### Premium Features
- **Issue Boosting**: Prioritize urgent issues (TK100 via Stripe integration)
- **Smart Assignment**: Admins can assign specific staff members to issues
- **Live Updates**: Real-time status changes with automatic timeline generation

### Management Tools
- **Admin Dashboard**: Comprehensive oversight with issue approval and user management
- **Staff Dashboard**: Task management with status update capabilities
- **Block/Unblock**: Control user account access
- **Interactive Analytics**: Visual charts displaying issue progress and statistics

### Performance Optimizations
- **Debounced Search**: Optimized server requests during real-time search
- **Responsive Design**: Status and priority badges for quick information access
- **Dynamic Statistics**: Real-time dashboard updates for all user roles

## Tech Stack

- **Authentication**: Firebase Admin SDK, JWT
- **Payment**: Stripe
- **Charts**: Recharts
- **Security**: Role-based middleware (verifyRole)

## User Roles

### Citizen
- Report issues with detailed information
- Track submitted issues and payments
- Upvote community issues
- View personal dashboard with statistics
- Boost issues to high priority

### Staff
- View assigned issues
- Update issue status in real-time
- Add timeline entries
- Track progress with visual analytics

### Admin
- Assign issues to staff members
- Approve or reject reported issues
- Manage user accounts (block/unblock)
- Access comprehensive analytics
- Oversee entire platform operations

## Getting Started

### Prerequisites
```bash
- Node.js (v14 or higher)
- Firebase account
- Stripe account
```

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your Firebase and Stripe credentials

# Start the development server
npm run dev
```

### Environment Variables
```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Platform Workflow

1. **Citizen Reports Issue** → Issue appears in public feed
2. **Admin Reviews** → Approves or rejects the issue
3. **Admin Assigns Staff** → Staff receives notification
4. **Staff Updates Status** → Timeline automatically updated
5. **Issue Resolved** → Complete transparency maintained

## Security Features

- Middleware-based role verification
- JWT token authentication
- Firebase Admin SDK integration
- Secure payment processing via Stripe
- Protected sensitive routes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ for better civic engagement