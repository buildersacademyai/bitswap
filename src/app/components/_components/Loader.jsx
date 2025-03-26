import React from 'react'
import Skeleton from 'react-loading-skeleton'

const Loader = () => {
  return (
    <>
    {/* "From" Label Skeleton */}
    <div className="flex justify-between items-center relative text-xs font-sans ">
    <Skeleton width={45} height={8} />
  </div>

  {/* Selling Dropdown Skeleton */}
  <div className="flex flex-row items-center justify-center py-2">
    <div className="relative w-[80%]">
      <Skeleton height={10} />
    </div>
    <Skeleton height={10} width="100%" className="ml-4" />
  </div>

  {/* Buying Dropdown Skeleton */}
  <div className="flex flex-row items-center justify-center py-2">
    <div className="relative w-[80%]">
      <Skeleton height={10} />
    </div>
    <Skeleton height={10} width="100%" className="ml-4" />
  </div>
  </>
  )
}

export default Loader