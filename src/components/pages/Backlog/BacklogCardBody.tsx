
const Goals = () => {
  return (
    <ul>
      <div>
        <input type="checkbox" />
        <div>Goal 1</div>
      </div>
      <div>
        <input type="checkbox" />
        <div>Goal 2</div>
      </div>
    </ul>
  )
}

const BacklogCardBody = () => {
  return (
    <>
      <Goals></Goals>
      <div>
        <button>Status</button>
        <button>Category</button>
        <button>Notes</button>
        <button>Goals</button>
      </div>
    </>
  )
}

export default BacklogCardBody;