import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pagenotfound = () => {
    const navigate = useNavigate()
    const gohome = () => {
        navigate("/home")
    }
    return (
        <div className="container-fluid border text-center position-relative">
            {/* Button positioned above the image */}
            <button className="btn btn-primary position-absolute top-50 start-50 translate-middle mb-3" onClick={gohome}>Go back to Home</button>

            {/* Image */}
            <img
                src="https://img.freepik.com/free-vector/404-concept-illustration_114360-26118.jpg?t=st=1743136721~exp=1743140321~hmac=6f501e4094d17c50028c4c35bce1031a51b2fbac6556b991874edc586adf66ff&w=740"
                alt="404"
                className="img-fluid mx-auto d-block w-50"
            />
        </div>
    );
};

export default Pagenotfound;
