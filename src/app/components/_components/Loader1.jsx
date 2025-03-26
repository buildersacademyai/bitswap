import React from 'react'
import Skeleton from 'react-loading-skeleton'

const Loader = () => {
  return (
    <>
    {/* "From" Label Skeleton */}
    <div className="flex justify-between items-center relative text-xs font-sans ">
    <Skeleton width={380} height={8} />
  </div>
  </>
  )
}

export default Loader