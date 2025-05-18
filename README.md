user-management-system-frontend
Group Project Activity: Full-Stack Application Development - FRONTEND(Angular.js)

Introduction
A fully functional Angular boilerplate app runs with email sign-up and verification, JWT authentication with fresh tokens, Role-based authorization, Profile management, Admin dashboard, and Fake backend implementation for backend-less development.

Installation
Clone the repository: git clone https://github.com/JMBaguio/user-management-system-frontend to an external site.
Install dependencies: npm install
Start the backend server: npm start
Start the Angular app: ng serve
Usage
User
• Register a new account at /account/register.
• Verify your email using the link sent to your inbox.
• Log in at /account/login.
• View and update your profile at /profile/update.
Admin
• Log in with an admin account at /account/login.
• Access dashboard at /admin/accounts/list.
• Manage user accounts (CRUD) at /admin/accounts/add-edit.
Testing
• Functional Testing: Covered key scenarios such as sign-up, login, role permissions, and password reset.
• Security Testing: Ensured JWT validation, secure routes, and form validations.
• Code Review: Ensured adherence to best practices, code organization, and documentation.
• Test cases and detailed reports can be found here (insert the link).
Contributing
Frontend Development:
1. Developer 3: Email Sign-Up, Verification, and Authentication
    • user-management-system-frontend the respository.
    • Create a feature branch: git checkout -b villarino-frontend-signup-auth, git branch to view the (villarino-frontend-signup-auth) if exist.
    • Implement the feature: Implement email sign-up, verification, and authentication.
    • Commit changes to the branch: git add ., git commit -m "Implement email sign-up, verification, and authentication"
    • Push to the remote repository: git push origin villarino-frontend-signup-auth.
    • Create a Pull Request and request review to merge into main

2. Developer 4: Profile Management, Admin Dashboard, And Fake Backend
    • user-management-system-frontend the respository.
    • Create a feature branch: git checkout -b gomez-frontend-profile-admin-fake-backend, git branch to view the (gomez-frontend-profile-admin-fake-backend) if exist.
    • Implement the feature: Implement the profile management and admin dashboard components in the Angular boilerplate.
    • Add a fake backend to simulate API responses during development.
    • Commit changes to the branch: git add ., git commit -m "Implement profile management, admin dashboard, and fake backend"
    • Push to the remote repository: git push origin gomez-frontend-profile-admin-fake-backend.
    • Create a Pull Request and request review to merge into main.
License
This project is licensed under the MIT License. See LICENSE for details.