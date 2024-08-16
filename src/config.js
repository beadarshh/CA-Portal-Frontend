const AppConfig = {
    appName: 'Certificate Management',
    navItems: {
        home: 'Home',
        services: 'Services',
        about: 'About',
        contact: 'Contact',
        logout: 'Logout',
    },
    sidebarItems: {
        frontpage:'Home',
        certificatebundle:'Download CA Certificate Bundle',
        dashboard: 'Dashboard',
        certificate: 'Download Certificates',
        revoke: 'Revoke Certificate',
        issuedCertificate : 'Download Issued Cerrificate',
    },

    outerbox:{
        downloadblockheading: 'Download Issued Certificate',
        revokeblockheading: 'Revoke Certificate',
    },

    blocks: {
        selectsubscriber:{
             heading: 'Select Subscriber',
             option1: 'Option 1',
             option2: 'Option 2',
             option3: 'Option 3',
        },
        selectservice: {
            heading: 'Select Service Subscription',
            option1: 'Option 1',
            option2: 'Option 2',
            option3: 'Option 3',
       },
        downloadcabundle: 'Download CA Certificate Bundle',
    },
    table: {
        tableboxheading: 'IIER Certificate',
        reason: [ 'Unspecified','Key compromise','CA compromise','Affiliation changed','Superseded','Cessation of operation','Certificate hold'],
        headers: ['CN', 'CERTNAME', 'CERTTYPE', 'DATEISSUED', 'REQNAME', 'SAN', 'VALIDITY'],
        actions: 'Action',
        revoke: 'Revoke',
        download: 'Download',
        pdfExport: 'Download as PDF',
        csvExport: 'Download as CSV',
        rowsPerPage: 'Rows per page:',
        rowsPerPageOptions: [5, 10, 20, 50],
        filterBy: 'Filter by:',
        filterOptions: {
            applyfilter: 'Apply Filter', // This key should be present
            applydaterangefilter: 'Apply Date Range Filter',
            applyadvancefilter: 'Apply Advanced Filter',
        },
        confirmRevocation: 'Confirm Revocation',
        selectReasonPlaceholder: 'Please select the reason for revocation:',
        selectReason: 'Select a reason',
        submit: 'Submit',
        cancel: 'Cancel',
        revokeerrormessage: 'Select a reason',
    },
    footer: {
        links: ['Home', 'Blog', 'Contact', 'Feedback'],
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        cookiesSetting: 'Cookies Setting',
    },
    roleSelection: {
        selectRole: 'Select User Role',
        admin: 'Admin',
        user: 'User',
    },
};

export default AppConfig;