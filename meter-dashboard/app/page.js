import Image from "next/image";
import "./page.css";

export default function Home() {
  return (
    <div className="container">
      <h1>Meter Dashboard</h1>
      <div className="status">
        <div className="status-body">
          <div className="status-block">
            35 c
          </div>
          <div className="status-block">
            0 f
          </div>
          <div className="status-block">
            14:00
          </div>
        </div>
      </div>
      <div className="meter">
      </div>
    </div>
  );
}


