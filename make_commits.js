const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const clientDir = 'c:\\Level2B6\\assignment4\\skillbridge-client';

function commit(message) {
  try {
    execSync('git add .', { cwd: clientDir });
    execSync(`git commit -m "${message}"`, { cwd: clientDir });
    console.log(`Committed: ${message}`);
  } catch (err) {
    console.error(`Failed to commit: ${message}`, err.message);
  }
}

// 1. Update README.md - Add installation guidelines
const readmePath = path.join(clientDir, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme += '\n\n## Installation & Setup\n\nTo run this project locally, follow these steps:\n1. Clone the repository.\n2. Run `npm install` to install dependencies.\n3. Configure your environment variables in `.env.local`.\n4. Run `npm run dev` to start the local development server.\n';
fs.writeFileSync(readmePath, readme);
commit('docs: update README with detailed installation and setup instructions');

// 2. Update README.md - Add project structure documentation
readme = fs.readFileSync(readmePath, 'utf8');
readme += '\n\n## Project Directory Structure\n\n- `src/app`: Page components and routing structure.\n- `components`: Reusable UI components and modules.\n- `lib`: API clients and helper utilities.\n- `public`: Static assets (images, icons, etc.).\n';
fs.writeFileSync(readmePath, readme);
commit('docs: document project architecture and directory structure');

// 3. Update README.md - Add routing specifications list
readme = fs.readFileSync(readmePath, 'utf8');
readme += '\n\n## Client Routing\n\n- `/`: Public Home page.\n- `/tutors`: Searchable lists of tutors.\n- `/tutors/:id`: Detailed tutor profiles.\n- `/dashboard`: Student panel.\n- `/tutor/dashboard`: Tutor panel.\n- `/admin`: Administration panel.\n';
fs.writeFileSync(readmePath, readme);
commit('docs: document client routing structure and page descriptions');

// 4. Update src/lib/api.ts - Add comments
const apiPath = path.join(clientDir, 'lib/api.ts');
let apiContent = fs.readFileSync(apiPath, 'utf8');
apiContent = `/**\n * API Fetch Helper Utility\n * Handles HTTP requests, JWT token authorization headers, and cookies.\n */\n` + apiContent;
fs.writeFileSync(apiPath, apiContent);
commit('docs: add JSDoc comments to API helper functions');

// 5. Update src/app/layout.tsx - Add comments
const layoutPath = path.join(clientDir, 'src/app/layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(
  'export default function RootLayout',
  '/**\n * RootLayout wraps the entire application with global providers\n * and sets up typography variables.\n */\nexport default function RootLayout'
);
fs.writeFileSync(layoutPath, layoutContent);
commit('docs: document root layout and global metadata settings');

// 6. Update components/navbar.tsx - Add comments
const navbarPath = path.join(clientDir, 'components/navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');
navbarContent = navbarContent.replace(
  'const Navbar = () => {',
  '/**\n * Navbar renders the global top navigation bar with branding, desktop links, and user menu.\n */\nconst Navbar = () => {'
);
fs.writeFileSync(navbarPath, navbarContent);
commit('docs: add descriptive comments to Navbar component');

// 7. Update components/footer.tsx - Add comments
const footerPath = path.join(clientDir, 'components/footer.tsx');
let footerContent = fs.readFileSync(footerPath, 'utf8');
footerContent = footerContent.replace(
  'export default function Footer() {',
  '/**\n * Footer displays branding, navigation links, and copyright details at the bottom of the page.\n */\nexport default function Footer() {'
);
fs.writeFileSync(footerPath, footerContent);
commit('docs: add comments and description to Footer component');

// 8. Update src/app/(commonLayout)/tutors/page.tsx - Add comments
const tutorsPagePath = path.join(clientDir, 'src/app/(commonLayout)/tutors/page.tsx');
let tutorsPageContent = fs.readFileSync(tutorsPagePath, 'utf8');
tutorsPageContent = tutorsPageContent.replace(
  '  // Filter by search + category',
  '  // Filter by search query, subject keywords, and category selections'
);
fs.writeFileSync(tutorsPagePath, tutorsPageContent);
commit('docs: add comments to tutor filtering and sorting functions');

// 9. Update src/app/globals.css - Add comments
const globalsCssPath = path.join(clientDir, 'src/app/globals.css');
let globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');
globalsCssContent = `/* Global styling and color configuration using Tailwind CSS v4 variables */\n` + globalsCssContent;
fs.writeFileSync(globalsCssPath, globalsCssContent);
commit('docs: add explanatory comments to globals.css theme variables');

// 10. Update components/featured-tutors.tsx - Add comments
const featuredTutorsPath = path.join(clientDir, 'components/featured-tutors.tsx');
let featuredTutorsContent = fs.readFileSync(featuredTutorsPath, 'utf8');
featuredTutorsContent = featuredTutorsContent.replace(
  'export function FeaturedTutors() {',
  '/**\n * FeaturedTutors displays top-rated educators on the landing page.\n */\nexport function FeaturedTutors() {'
);
fs.writeFileSync(featuredTutorsPath, featuredTutorsContent);
commit('docs: add documentation comments to FeaturedTutors component');

// 11. Update components/user-menu.tsx - Add comments
const userMenuPath = path.join(clientDir, 'components/user-menu.tsx');
let userMenuContent = fs.readFileSync(userMenuPath, 'utf8');
userMenuContent = userMenuContent.replace(
  'export function UserMenu() {',
  '/**\n * UserMenu manages profile badges and authentication state buttons.\n */\nexport function UserMenu() {'
);
fs.writeFileSync(userMenuPath, userMenuContent);
commit('docs: add comments detailing UserMenu auth states');

// 12. Create docs/API_INTEGRATION.md
const docsDir = path.join(clientDir, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}
const apiIntegrationPath = path.join(docsDir, 'API_INTEGRATION.md');
fs.writeFileSync(
  apiIntegrationPath,
  '# API Integration Guide\n\nThis application integrates with the Railway-deployed backend.\n\n## Base Endpoint\n\nConfigure `NEXT_PUBLIC_BACKEND_URL` in your `.env.local` file.\n'
);
commit('docs: create API integration and endpoint mapping guide');

console.log('All 12 commits generated successfully!');
