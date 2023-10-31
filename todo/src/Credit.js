import SideBar from './SideBar'

function Credit() {
    return (
        <div id="outer-container">
            <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/>
            <div id="page-wrap">
                <center>
                    <h3>จัดทำโดย</h3>
                    <h1>ชัชวิทย์ อาภรณ์เทวัญ</h1>
                </center>
            </div>
        </div>
    )
}
  
export default Credit