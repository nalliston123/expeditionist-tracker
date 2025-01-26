const CountryListSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full min-h-[300px] flex flex-col space-y-4">
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-20 ml-auto bg-gray-200 rounded animate-pulse" />
      <div className="flex-grow border rounded-md p-2 space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountryListSkeleton

