
import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Signup from "../pages/signup/Signup"
import Updatepassword from "../pages/updatepassword/Updatepassword"
import Home from "../pages/home/Home"
import Loading from "../pages/loading/Loading"
function Routecomp() {
    const Login = lazy(() => import("../pages/login/Login"))
    const Forgotpassword = lazy(() => import("../pages/passwordforgot/Forgotpassword"))
    const Pagenotfound = lazy(() => import("../pages/pagenotfound/Pagenotfound"))
    // const Updatepassword = lazy(() => { import("../pages/updatepassword/Updatepassword") })
    return (
        <div>
            <Routes>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/" element={<Suspense fallback={<Loading/>}><Login /></Suspense>}></Route>
                <Route path="/passwordreset" element={<Suspense fallback={<Loading/>}><Forgotpassword /></Suspense>} />
                <Route path="/updatepassword" element={<Updatepassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Suspense fallback={<Loading/>}><Pagenotfound /></Suspense>} />
            </Routes>
        </div>
    )
}
export default Routecomp