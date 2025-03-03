import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomProvider } from './components/ui/provider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<StrictMode>
		<CustomProvider>
			<App />
		</CustomProvider>
	</StrictMode>
)
