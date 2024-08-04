export default function Loader({showStatus, message}) {
    return (<>
     { showStatus && <div className="loader">
          <div>
            <aside></aside>
            <h2>{message}</h2>
            <p>Please wait...</p>
          </div>
      </div> }
      </>)
  }
  