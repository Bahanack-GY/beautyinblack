import Header from "../components/Header";
import Navbar from "../components/Navbar";
import VideoDisplay from "../components/Video";
import BodyContent from "../components/Body-content";
import ProductCard from "../components/Product-card";
function Home() {
    return(
        <>
        <div className="flex flex-col bg-[#FAF9F6] h-screen w-screen mb-32">
        <Header/>
        <VideoDisplay />
        <BodyContent />
        
        <Navbar />
        </div>
        </>
    )
}

export default Home;