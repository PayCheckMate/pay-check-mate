import {Sidebar} from "../Components/Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {EmployeeList} from "./EmployeeList";

export default function Main() {
    return (
        <>
            <div>
                <Sidebar/>
                <main className="pb-12 lg:pl-72">
                    <div className="px-4 sm:px-6 lg:px-2">
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/employees" element={<EmployeeList/>}/>
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    )
}
