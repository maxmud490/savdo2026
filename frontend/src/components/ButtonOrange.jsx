

function ButtonOrange({onClick,children}) {
    
  return (
    <button
    type="button"
    className="btn w-xs-100 my-2 btn-orange btn-sm px-3"
    onClick={onClick}
  >
    {children}
  </button>
  )
}

export default ButtonOrange