
import { RatesProvider } from './context/RatesProvider';
import { ToastProvider } from './components/Common/Toast';
import { ConversionScreen } from './components/Conversion/ConversionScreen';
import './styles/main.scss';
import './App.scss';

function App() {

  return (
    <RatesProvider>
      <ToastProvider>
        <div className="app">
          <h1 className='main-title'>Currency Converter</h1>
          <div className='main-subtitle'>Get real-time exchange rates</div>
          <ConversionScreen />
        </div>
      </ToastProvider>
    </RatesProvider>
  );
}

export default App;