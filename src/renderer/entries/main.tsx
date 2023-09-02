import { createRoot } from 'react-dom/client';

import App from '@r/pages/App';

const $app = document.getElementById('app');

const root = createRoot($app);

root.render(<App />);
