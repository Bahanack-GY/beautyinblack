import video from '../assets/sample-video.mp4'
import { CiSearch } from "react-icons/ci";
function VideoDisplay(){
    return(
        <div className="flex justify-start  w-full">
            <video src={video}  autoPlay></video>
            
        </div>
    )
}

export default VideoDisplay