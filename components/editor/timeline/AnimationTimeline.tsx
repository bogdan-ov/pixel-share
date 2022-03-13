import React from "react";

const AnimationTimeline: React.FC = ()=> {
    return (
        <footer className="animation-timeline">

            <main className="animation-timeline-content">
                <div className="frames-count">
                    { [...Array(20)].map((_, i)=>
                        <div className="frame-count field">{ i }</div>
                    ) }
                </div>

                <div className="timeline">
                </div>
            </main>
            
        </footer>
    );
};

export default AnimationTimeline;