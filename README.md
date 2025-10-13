# Student Management System

A comprehensive web-based application for managing student information, attendance, health records, and academic performance.

## Features

- **Student Profile Management**: Store and manage detailed student information including personal details, contact information, and academic data.
- **Attendance Tracking**: Record and monitor student attendance with monthly summaries and statistics.
- **Health Information**: Maintain health records including height, weight, and BMI calculations.
- **Academic Performance**: Track student marks for different terms and subjects with automatic grade calculation.
- **Result Generation**: Create professional-looking result reports with PDF export functionality.
- **Multi-language Support**: Available in both English and Marathi.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Technologies Used

- **Frontend**: React.js, HTML5, CSS3
- **Build Tool**: Vite
- **State Management**: React Hooks
- **PDF Generation**: html2pdf.js
- **Data Storage**: LocalStorage (Client-side)

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd student-management-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` (or the port shown in the terminal)

## Usage

1. **Login**: Use the default credentials (admin/admin) to access the system
2. **Dashboard**: Navigate through different sections using the main navigation menu
3. **Student Management**: Add, edit, or delete student profiles
4. **Attendance**: Record attendance for students by class
5. **Health Info**: Update student health information
6. **Academic Records**: Enter and manage student marks
7. **Results**: Generate and download student result reports in PDF format

## Key Functionalities

- **Individual Student Results**: View detailed reports for specific students
- **Class Results**: See performance summaries for entire classes
- **Landscape Mode**: Toggle between portrait and landscape views for better PDF formatting
- **Print-Ready Reports**: Generate professional PDF reports with exactly 2 pages
- **Data Persistence**: All data is stored locally in your browser

## Customization

You can customize the following aspects:
- Color scheme (in `src/App.css`)
- Language translations (in component files)
- PDF formatting and layout
- Additional fields for student information

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Santosh Bansode

## Support

For support, please contact the author or open an issue in the repository.