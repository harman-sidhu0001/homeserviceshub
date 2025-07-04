import { BsStarFill } from "react-icons/bs";
const ReviewsBlock = ({ reviews, loading }) => (
  <div className="bg-white rounded-xl shadow p-6 mt-6">
    <div className="text-xl font-semibold mb-4">Reviews</div>
    {loading ? (
      <div className="text-center text-primary">Loading...</div>
    ) : !reviews || reviews.length === 0 ? (
      <div className="text-2xl font-bold text-gray-400 text-center py-10">
        No Reviews Yet!!!
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-2"
          >
            <div className="text-lg font-bold">{review.service}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <BsStarFill
                  key={i}
                  className={
                    i < review.stars ? "text-yellow-400" : "text-gray-300"
                  }
                />
              ))}
            </div>
            <div className="text-xs text-gray-400">{review.date}</div>
            <div className="text-gray-700">{review.description}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
export default ReviewsBlock;
