import { getAudioMedia, AudioRecorder, getAudioSupportedMedia } from '@helpers/audio';
import useInterval from '@hooks/useInterval';
import { useRef, useState, MouseEventHandler } from 'react';
import './App.css';
import TrainUX from './ux/Train';
function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<AudioRecorder>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [timeLimit, setTimeLimit] = useState(60);
  const [mergedAudio, setMergedAudio] = useState<Blob|null>(null);

  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  const handleMerge = ()=>{
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;
    if(audio1 && audio2){
      const audio1Blob = new Blob([audio1.src], {type: 'audio/wav'});
      const audio2Blob = new Blob([audio2.src], {type: 'audio/wav'});
      const mergedAudio = new Blob([audio1Blob, audio2Blob], {type: 'audio/wav'});
      console.log(mergedAudio.size, mergedAudio);
      setMergedAudio(mergedAudio);
    }
  }
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
  const TrainData = [
    {
      time: new Date(2022, 8, 29, 10, 0, 0),
      hasEvent: true,
      eventType: "SUCCESS"
    },
    {
      time: new Date(2022, 8, 29, 10, 0, 25),
      hasEvent: true,
      eventType: "SUCCESS"
    },
    {
      time: new Date(2022, 8, 29, 10, 0, 30),
      hasEvent: true,
      eventType: "SUCCESS"
    },
    {
      time: new Date(2022, 8, 29, 10, 1, 0),
      hasEvent: true,
      eventType: "SUCCESS"
    },
     {
      time: new Date(2022, 8, 29, 10, 4, 0),
      hasEvent: true,
      eventType: "SUCCESS"
    },
    {
      time: new Date(2022, 8, 29, 10, 29, 30),
      hasEvent: true,
      eventType: "SUCCESS"
    }
  ];
  return (
    <div className="App">
      <header className="App-header">
        {!recorder&&<button onClick={getMediaSource}>Get Media</button>}
        {recorder&&!isRecording&&(<><button onClick={startRecording}>{(audioUrl?'Start all over': 'Start')}</button></>)}
        {recorder&&isRecording&&<><button onClick={stopRecording}>Stop</button><h2>Recording Time left: {timeLimit} </h2></>}
        {audioUrl&&!isRecording&&<audio controls src={audioUrl}></audio>}
      </header>
      <section>
        <TrainUX data={TrainData} startDate={new Date(2022, 8, 29, 10, 0, 0)}></TrainUX>
      </section>
      <section>
        <h2>Audio Merge Multiple to One</h2>
        <audio ref={audioRef1} src="https://cdn.freesound.org/previews/649/649728_5674468-lq.ogg" preload='true' controls={true}></audio>
        <br />
        <audio ref={audioRef2} src="https://cdn.freesound.org/previews/649/649206_1648170-lq.ogg" preload='true' controls={true}></audio>
        <br />
        <button onClick={handleMerge}>Merge Audio</button>
        <br />
        {mergedAudio&&<audio controls src={URL.createObjectURL(mergedAudio)}></audio>}
      </section>
    </div>
  );
}

export default App;
