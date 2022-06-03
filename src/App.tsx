import { getAudioMedia, AudioRecorder, getAudioSupportedMedia } from '@helpers/audio';
import useInterval from '@hooks/useInterval';
import { useState } from 'react';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<AudioRecorder>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [timeLimit, setTimeLimit] = useState(60);

  const onRecorderStop = (blob : Blob, duration : number) => {
    console.log('onStop', {blob, duration});
    setAudioUrl(URL.createObjectURL(blob));
  }
  const onRecorderError = (err:Error) => {
    console.log('onError', err);
  }
  const getMediaSource = async () => {
    const typesSupported = getAudioSupportedMedia();
    console.log(typesSupported);
    const stream = await getAudioMedia();
    setRecorder(new AudioRecorder(stream, onRecorderStop, onRecorderError));
  }
  const startRecording = () => {
    if(recorder) {
      recorder.start();
      setIsRecording(true);
      setTimeLimit(20);
    }
  }
  useInterval(
    ()=>{
      if(isRecording && timeLimit > 0) {
        setTimeLimit(timeLimit-1);
      } else {
        stopRecording();
      }
    }
    , 1000
  );

  const stopRecording = () => {
    if(recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {!recorder&&<button onClick={getMediaSource}>Get Media</button>}
        {recorder&&!isRecording&&(<><button onClick={startRecording}>{(audioUrl?'Start all over': 'Start')}</button></>)}
        {recorder&&isRecording&&<><button onClick={stopRecording}>Stop</button><h2>Recording Time left: {timeLimit} </h2></>}
        {audioUrl&&!isRecording&&<audio controls src={audioUrl}></audio>}
      </header>
    </div>
  );
}

export default App;
