import React from 'react';
import UploadFile from './components/UploadFile';

function App() {
  return (
    <div className="App">
      <UploadFile aspectRatio={16/9} isCropImage={true} maxWidthCrop={2080} />
    </div>
  );
}

export default App;
