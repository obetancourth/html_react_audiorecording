export const getAudioMedia = ()=>{
  return new Promise<MediaStream>((resolve, reject)=>{
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream=>{
      resolve(stream)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
export const getAudioSupportedMedia = ()=>{
  const types: string[] = ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mp3','audio/mp4', 'audio/aac'];
  const typesSupported: {[key: string]: boolean;} = {};
  types.forEach(type=>{
    typesSupported[type] = MediaRecorder.isTypeSupported(type);
  });
  return typesSupported;
}
export class AudioRecorder {
  private stream: MediaStream
  private recorder: MediaRecorder
  private chunks: Blob[] = []
  private startTime: number = 0
  private endTime: number = 0
  private onStop: (blob: Blob, duration: number)=>void
  private onError: (err: Error)=>void
  private mimeType: string = 'audio/webm'
  constructor(stream: MediaStream, onStop: (blob: Blob, duration: number)=>void, onError: (err: Error)=>void){
    this.stream = stream
    this.onStop = onStop
    this.onError = onError
    this.mimeType = this.selectPreferredMimeType()
    this.recorder = new MediaRecorder(stream, { audioBitsPerSecond: 96000})
    this.recorder.ondataavailable = (e: BlobEvent)=>{
      this.chunks.push(e.data)
    }
    this.recorder.onstop = (e: Event)=>{
      const blob = new Blob(this.chunks, {type: this.mimeType})
      const duration = this.endTime - this.startTime
      this.onStop(blob, duration)
    }
    this.recorder.onerror = (e: MediaRecorderErrorEvent)=>{
      this.onError(e.error)
    }
  }
  selectPreferredMimeType(){
    const types: {[key:string]:boolean} = getAudioSupportedMedia();
    if ((types["audio/ogg"] as boolean) === true) {
      return "audio/ogg"
    }
    if ((types["audio/webm"] as boolean) === true) {
      return "audio/webm"
    }
    if ((types["audio/mp3"] as boolean) === true) {
      return "audio/mp3"
    }
    if ((types["audio/wav"] as boolean) === true) {
      return "audio/wav"
    }
    if ((types["audio/mp4"] as boolean) === true) {
      return "audio/mp4"
    }
    if ((types["audio/aac"] as boolean) === true) {
      return "audio/aac"
    }
    return "audio/ogg";
  }
  start(){
    this.chunks = [];
    this.startTime = Date.now()
    this.recorder.start()
  }
  stop(){
    this.endTime = Date.now()
    this.recorder.stop()
  }
}
