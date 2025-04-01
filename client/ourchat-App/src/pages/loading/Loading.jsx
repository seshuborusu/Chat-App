import { color, height } from "@mui/system"

function Loading() {
    const style = {
        height: "100vh",
        spinner: {
            width: "50px",
            height: "50px",
            color: "blueviolet"
        }

    }
    return <div>
        <div className="mt-2 text-center  d-flex flex-column justify-content-center align-items-center border" style={style}>
            {/* Optional: Add a spinner or progress bar */}
            <div className="spinner-border fw-semibold " role="status" style={style.spinner}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="p-2 fw-bold ">Loading...</h5>
        </div>
    </div>
}
export default Loading