import { Button } from 'react-bootstrap';
import './App.scss';
import { getApiUrl } from '../../config/settings';
import "@fortawesome/fontawesome-free/js/all.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {getApiUrl()}
        <Button variant="primary">Primary</Button>{' '}
        <Button variant="secondary">Secondary</Button>{' '}
        <Button variant="success">Success</Button>{' '}
        <Button variant="warning">Warning</Button>{' '}
        <Button variant="danger">Danger</Button>{' '}
        <Button variant="info">Info</Button>{' '}
        <Button variant="light">Light</Button>{' '}
        <Button variant="dark">Dark</Button>
        <Button variant="link">Link</Button>
      </header>
    </div>
  );
}

export default App;
