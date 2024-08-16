Here is the frontend section of the `README.md` file:


Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js: Download and install Node.js from nodejs.org. Node.js includes npm (Node Package Manager), which you'll use for managing packages and running the project.
Installing Node.js
Download Node.js:

Visit the Node.js official website and download the latest version that matches your operating system.
Install Node.js:

Run the installer and follow the prompts to complete the installation. Make sure to include npm in the installation.
Verify Installation:

Open your terminal or command prompt and type the following commands to verify that Node.js and npm were installed correctly:

```bash
node -v
npm -v
```

This should display the version numbers of Node.js and npm, confirming that they are installed and ready to use.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


```markdown
## Frontend

### Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **JavaScript:** The programming language used for the frontend logic.
- **Axios:** A promise-based HTTP client for making API requests from the frontend.
- **React Router v6:** For managing navigation and routing within the application.
- **jspdf:** For generating PDF reports.
- **react-modal:** For implementing modals.


### Setup Instructions

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the React application:
    ```bash
    npm start
    ```

4. The frontend will be running on `http://localhost:3000`.

### Usage

1. Access the dashboard at `http://localhost:3000`.
2. Use the navigation options in the **Navbar** and **Sidebar** to:
   - Download CA bundles.
   - Download specific issued certificates.
   - Revoke certificates with a reason.
   - Apply filters by SAN and date range to search certificates.
   - Generate and download reports in PDF and CSV formats.

### Components Overview

- **Navbar:** The top navigation bar for accessing main sections of the application.
- **Sidebar:** A collapsible sidebar that dynamically displays options based on user actions.
- **Blocks:** Displays clickable blocks for different operations like downloading and revoking certificates.
- **DownloadIssuedCertificate:** Provides options to filter and download issued certificates.
- **CertificateRevoke:** Allows users to revoke certificates and displays a confirmation modal.
- **FilterOptions:** Component for selecting and applying filters on certificate data.
- **Table:** A reusable table component that supports pagination, filtering, and data export.
- **RoleSelection:** Handles user role selection and manages session timeouts.
- **Footer:** The footer of the application.

### Important Notes

- **React Router v6** is used for routing, so ensure that the paths and components are properly configured.
- **Axios** is used for making API requests; make sure the backend API endpoints are correctly set up in `CertificateService.js`.
- Custom CSS files are used to style the components; modify these as needed to fit your design requirements.
```

This section provides all the necessary information for setting up, running, and understanding the frontend part of your project.
