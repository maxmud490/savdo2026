
import { RotatingLines } from 'react-loader-spinner'

function LoaderButton() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "auto" }}>
    <RotatingLines
      visible={true}
      height="20"
      width="20"
      color="blue"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
    />
  </div>
  
  
  )
}

export default LoaderButton