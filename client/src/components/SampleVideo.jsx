import sampleWebm from "../assets/sample.webm";
import sampleMp4 from "../assets/sample.mp4";

const SampleVideo = () => {
  return (
    <div className='sample-video'>
      <video controls autoPlay muted loop preload="auto">
        <source src={sampleWebm} type="video/webm" />
        <source src={sampleMp4} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default SampleVideo;
